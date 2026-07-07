import { prisma } from "../prisma";
import {
  IProviderAdapter,
  ProviderCapability,
  ProviderMetadataOutput,
  CreateTaskInput,
  CreateNoteInput,
  CreateBookmarkInput,
  CreateReminderInput,
  UploadAttachmentInput
} from "../../domain/providers/types";

export class FlowLocalAdapter implements IProviderAdapter {
  getSupportedCapabilities(): ProviderCapability[] {
    return [
      ProviderCapability.CREATE_TASK,
      ProviderCapability.CREATE_NOTE,
      ProviderCapability.CREATE_BOOKMARK,
      ProviderCapability.CREATE_REMINDER,
      ProviderCapability.UPLOAD_ATTACHMENT
    ];
  }

  async executeAction(capability: ProviderCapability, userId: string, payload: any): Promise<ProviderMetadataOutput> {
    switch (capability) {
      case ProviderCapability.CREATE_TASK:
        return this.createTask(userId, payload);
      case ProviderCapability.CREATE_NOTE:
        return this.createNote(userId, payload);
      case ProviderCapability.CREATE_BOOKMARK:
        return this.createBookmark(userId, payload);
      case ProviderCapability.CREATE_REMINDER:
        return this.createReminder(userId, payload);
      case ProviderCapability.UPLOAD_ATTACHMENT:
        return this.uploadAttachment(userId, payload);
      default:
        throw new Error(`FlowLocalAdapter does not support capability: ${capability}`);
    }
  }

  private async createTask(userId: string, input: CreateTaskInput): Promise<ProviderMetadataOutput> {
    const task = await prisma.flowLocalTask.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        sourceUrl: input.sourceUrl,
        sourceRef: input.sourceRef,
      }
    });

    return {
      provider: "flow_local",
      providerObjectId: task.id,
      syncStatus: "synced"
    };
  }

  private async createNote(userId: string, input: CreateNoteInput): Promise<ProviderMetadataOutput> {
    const note = await prisma.flowLocalNote.create({
      data: {
        userId,
        content: input.content,
        sourceUrl: input.sourceUrl,
        sourceRef: input.sourceRef,
      }
    });

    return {
      provider: "flow_local",
      providerObjectId: note.id,
      syncStatus: "synced"
    };
  }

  private async createBookmark(userId: string, input: CreateBookmarkInput): Promise<ProviderMetadataOutput> {
    const bookmark = await prisma.flowLocalBookmark.create({
      data: {
        userId,
        title: input.title,
        url: input.url,
        metadata: input.metadata,
        sourceRef: input.sourceRef,
      }
    });

    return {
      provider: "flow_local",
      providerObjectId: bookmark.id,
      syncStatus: "synced"
    };
  }

  private async createReminder(userId: string, input: CreateReminderInput): Promise<ProviderMetadataOutput> {
    const reminder = await prisma.flowLocalReminder.create({
      data: {
        userId,
        title: input.title,
        time: new Date(input.time),
        message: input.message,
        sourceRef: input.sourceRef,
      }
    });

    return {
      provider: "flow_local",
      providerObjectId: reminder.id,
      syncStatus: "synced"
    };
  }

  private async uploadAttachment(userId: string, input: UploadAttachmentInput): Promise<ProviderMetadataOutput> {
    const attachment = await prisma.flowLocalAttachment.create({
      data: {
        userId,
        filename: input.filename,
        size: input.size,
        mimeType: input.mimeType,
        storageKey: input.storageKey,
        url: input.url,
        sourceRef: input.sourceRef,
      }
    });

    return {
      provider: "flow_local",
      providerObjectId: attachment.id,
      syncStatus: "synced"
    };
  }
}
