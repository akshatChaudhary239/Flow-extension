import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";

export const handleCreateSlackTask = async (context: ContextObject) => {
  return apiClient.post("/tasks", {
    title: `Task: ${context.title}`,
    description: `Context: "${context.bodyText}"`,
    sourceUrl: context.url,
  });
};

export const handleBookmarkSlackMessage = async (context: ContextObject) => {
  return apiClient.post("/bookmarks", {
    title: context.title || "Slack Message",
    url: context.url,
    metadata: JSON.stringify({ snippet: context.bodyText }),
  });
};

export const handleRemindSlackThread = async (context: ContextObject) => {
  return apiClient.post("/reminders", {
    title: `Reminder for ${context.title}`,
    time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), 
    message: context.bodyText,
  });
};
