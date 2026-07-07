import { z } from "zod";

export const ContextObjectSchema = z.object({
  id: z.string(),
  module: z.string(),
  type: z.enum(["email", "thread", "compose", "profile", "document", "file", "message", "issue"]),
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  sender: z.string().optional(),
  bodyText: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
export type ContextObject = z.infer<typeof ContextObjectSchema>;

export type ActionId = "create_task" | "set_reminder" | "bookmark" | "save_note" | "save_attachment" | "track_connection" | "create_task_from_selection" | "bookmark_section" | "save_knowledge_note" | "create_file_task" | "watch_folder" | "create_slack_task" | "bookmark_slack_message" | "remind_slack_thread" | "create_jira_issue" | "sync_jira_task";

export interface ActionDefinition {
  id: ActionId;
  label: string;
  icon: string;
  description?: string;
  isAvailable: (context: ContextObject) => boolean;
}

export type MessageBusPayload =
  | { type: "CONTEXT_DETECTED"; payload: ContextObject }
  | { type: "ACTION_TRIGGERED"; payload: { actionId: ActionId; context: ContextObject } }
  | { type: "ACTION_SUCCESS"; payload: { actionId: ActionId; result: any } }
  | { type: "ACTION_ERROR"; payload: { actionId: ActionId; error: string } };
