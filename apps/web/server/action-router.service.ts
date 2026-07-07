import { prisma } from "../infrastructure/prisma";
import { IProviderAdapter, ProviderCapability } from "../domain/providers/types";
import { FlowLocalAdapter } from "../infrastructure/providers/flow-local.adapter";
import { NotionAdapter } from "../infrastructure/providers/notion.adapter";
import { GoogleTasksAdapter } from "../infrastructure/providers/google-tasks.adapter";

export class ActionRouterService {
  private adapters: Map<string, IProviderAdapter> = new Map();

  constructor() {
    this.adapters.set("flow_local", new FlowLocalAdapter());
    this.adapters.set("notion", new NotionAdapter());
    this.adapters.set("google_tasks", new GoogleTasksAdapter());
  }

  async routeAction(userId: string, capability: ProviderCapability, payload: any, sourcePlatform?: string) {
    // 1. Fetch User Settings to determine preferred provider for this capability
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    let preferences: Record<string, string> = {};
    if (settings && settings.jsonPreferences) {
      try {
        preferences = JSON.parse(settings.jsonPreferences);
      } catch (e) {
        console.error("Failed to parse user preferences", e);
      }
    }

    // Determine the preferred provider for this capability, default to flow_local
    let providerName = preferences[`default_${capability}`] || "flow_local";
    let adapter = this.adapters.get(providerName);

    // 2. Capability Discovery - Verify if the chosen provider supports this action
    if (adapter && !adapter.getSupportedCapabilities().includes(capability)) {
      console.warn(`Provider ${providerName} does not support ${capability}. Falling back to flow_local.`);
      providerName = "flow_local";
      adapter = this.adapters.get(providerName);
    }

    if (!adapter) {
      throw new Error(`Failed to resolve adapter for provider: ${providerName}`);
    }

    try {
      // 3. Execute the action using the resolved adapter
      const metadataOutput = await adapter.executeAction(capability, userId, payload);

      // 4. Save the metadata locally
      const actionMeta = await prisma.actionMetadata.create({
        data: {
          userId,
          provider: metadataOutput.provider,
          providerObjectId: metadataOutput.providerObjectId,
          actionType: capability,
          sourceUrl: payload.sourceUrl || null,
          sourceRef: payload.sourceRef || null,
          sourcePlatform: payload.sourcePlatform || sourcePlatform || null,
          syncStatus: metadataOutput.syncStatus,
          errorMessage: metadataOutput.errorMessage,
        }
      });

      return {
        success: true,
        metadata: actionMeta
      };
    } catch (error: any) {
      console.error(`ActionRouter failed to execute ${capability} on ${providerName}:`, error);
      
      // Save failed metadata record
      const failedMeta = await prisma.actionMetadata.create({
        data: {
          userId,
          provider: providerName,
          actionType: capability,
          sourceUrl: payload.sourceUrl || null,
          sourceRef: payload.sourceRef || null,
          sourcePlatform: payload.sourcePlatform || sourcePlatform || null,
          syncStatus: "failed",
          errorMessage: error.message,
        }
      });

      return {
        success: false,
        metadata: failedMeta,
        error: error.message
      };
    }
  }
}

export const actionRouter = new ActionRouterService();
