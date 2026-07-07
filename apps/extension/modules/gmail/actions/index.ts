import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";
import { extractDeadline } from "../parsers/date-parser";

export const handleCreateTask = async (context: ContextObject) => {
  let dueDate = null;
  if (context.bodyText) {
    dueDate = extractDeadline(context.bodyText);
  }

  return apiClient.post("/tasks", {
    title: context.title || "New Task from Email",
    description: context.bodyText?.substring(0, 500),
    dueDate: dueDate ? dueDate.toISOString() : undefined,
    sourceUrl: context.url,
  });
};

export const handleSetReminder = async (context: ContextObject) => {
  return apiClient.post("/reminders", {
    title: context.title,
    time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 day default
  });
};
