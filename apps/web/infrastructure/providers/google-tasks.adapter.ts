import { prisma } from "../prisma";
import {
  IProviderAdapter,
  ProviderCapability,
  ProviderMetadataOutput,
  CreateTaskInput
} from "../../domain/providers/types";

export class GoogleTasksAdapter implements IProviderAdapter {
  getSupportedCapabilities(): ProviderCapability[] {
    return [
      ProviderCapability.CREATE_TASK
    ];
  }

  async executeAction(capability: ProviderCapability, userId: string, payload: any): Promise<ProviderMetadataOutput> {
    const connection = await prisma.googleTasksConnection.findFirst({
      where: { userId, status: "active" },
      orderBy: { createdAt: "desc" }
    });

    if (!connection || !connection.accessToken) {
      throw new Error("Google Tasks account is not connected or token is missing.");
    }

    switch (capability) {
      case ProviderCapability.CREATE_TASK:
        return this.createTask(userId, payload, connection.accessToken);
      default:
        throw new Error(`GoogleTasksAdapter does not support capability: ${capability}`);
    }
  }

  private async createTask(userId: string, input: CreateTaskInput, accessToken: string): Promise<ProviderMetadataOutput> {
    console.log(`[GoogleTasksAdapter] Creating Task with token ${accessToken.substring(0, 5)}...`, input);
    // STUB: Simulate network request to Google Tasks API
    
    return {
      provider: "google_tasks",
      providerObjectId: `gtask_${Date.now()}`,
      syncStatus: "synced"
    };
  }
}
