import { prisma } from "../prisma";
import {
  IProviderAdapter,
  ProviderCapability,
  ProviderMetadataOutput,
  CreateTaskInput,
  CreateNoteInput
} from "../../domain/providers/types";

export class NotionAdapter implements IProviderAdapter {
  getSupportedCapabilities(): ProviderCapability[] {
    return [
      ProviderCapability.CREATE_TASK,
      ProviderCapability.CREATE_NOTE
    ];
  }

  async executeAction(capability: ProviderCapability, userId: string, payload: any): Promise<ProviderMetadataOutput> {
    const connection = await prisma.notionConnection.findFirst({
      where: { userId, status: "active" },
      orderBy: { createdAt: "desc" }
    });

    if (!connection || !connection.accessToken) {
      throw new Error("Notion account is not connected or token is missing.");
    }

    switch (capability) {
      case ProviderCapability.CREATE_TASK:
        return this.createTask(userId, payload, connection.accessToken);
      case ProviderCapability.CREATE_NOTE:
        return this.createNote(userId, payload, connection.accessToken);
      default:
        throw new Error(`NotionAdapter does not support capability: ${capability}`);
    }
  }

  private async createTask(userId: string, input: CreateTaskInput, accessToken: string): Promise<ProviderMetadataOutput> {
    console.log(`[NotionAdapter] Creating Task with token ${accessToken.substring(0, 5)}...`, input);
    // STUB: Simulate network request to Notion API
    
    return {
      provider: "notion",
      providerObjectId: `notion_task_${Date.now()}`,
      syncStatus: "synced"
    };
  }

  private async createNote(userId: string, input: CreateNoteInput, accessToken: string): Promise<ProviderMetadataOutput> {
    console.log(`[NotionAdapter] Creating Note with token ${accessToken.substring(0, 5)}...`, input);
    // STUB: Simulate network request to Notion API

    return {
      provider: "notion",
      providerObjectId: `notion_page_${Date.now()}`,
      syncStatus: "synced"
    };
  }
}
