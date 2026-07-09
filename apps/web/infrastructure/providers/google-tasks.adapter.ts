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
    
    // Call the official Google Tasks API
    const response = await fetch("https://tasks.googleapis.com/tasks/v1/lists/@default/tasks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: input.title,
        notes: input.description ? `${input.description}\n\nSource: ${input.sourceUrl || "Flow"}` : `Source: ${input.sourceUrl || "Flow"}`,
        due: input.dueDate ? new Date(input.dueDate).toISOString() : undefined,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Tasks API failed: ${errText}`);
    }

    const data = await response.json();
    console.log("[GoogleTasksAdapter] Task successfully created in Google!", data);

    return {
      provider: "google_tasks",
      providerObjectId: data.id,
      syncStatus: "synced"
    };
  }
}
