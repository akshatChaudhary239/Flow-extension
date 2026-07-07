export enum ProviderCapability {
  CREATE_TASK = "CREATE_TASK",
  CREATE_NOTE = "CREATE_NOTE",
  CREATE_BOOKMARK = "CREATE_BOOKMARK",
  CREATE_REMINDER = "CREATE_REMINDER",
  UPLOAD_ATTACHMENT = "UPLOAD_ATTACHMENT",
}

export interface ProviderMetadataOutput {
  provider: string;
  providerObjectId: string | null;
  syncStatus: "synced" | "pending" | "failed";
  errorMessage?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  sourceUrl?: string | null;
  sourceRef?: string | null;
  sourcePlatform?: string | null;
  dueDate?: string | null;
}

export interface CreateNoteInput {
  content: string;
  sourceUrl?: string | null;
  sourceRef?: string | null;
  sourcePlatform?: string | null;
}

export interface CreateBookmarkInput {
  title: string;
  url: string;
  metadata?: string | null;
  sourceRef?: string | null;
  sourcePlatform?: string | null;
}

export interface CreateReminderInput {
  title?: string | null;
  time: string;
  message?: string | null;
  sourceRef?: string | null;
  sourcePlatform?: string | null;
}

export interface UploadAttachmentInput {
  filename: string;
  size: number;
  mimeType: string;
  storageKey: string;
  url?: string | null;
  sourceRef?: string | null;
  sourcePlatform?: string | null;
}

export interface IProviderAdapter {
  /** Returns the list of capabilities this provider supports */
  getSupportedCapabilities(): ProviderCapability[];
  
  /** Execute action routing based on capability */
  executeAction(capability: ProviderCapability, userId: string, payload: any): Promise<ProviderMetadataOutput>;
}
