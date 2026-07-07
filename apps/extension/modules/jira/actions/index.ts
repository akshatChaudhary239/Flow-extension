import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";

export const handleCreateJiraIssue = async (context: ContextObject) => {
  return apiClient.post("/tasks", {
    title: `Follow up: ${context.title}`,
    description: `Created from Jira Context.`,
    sourceUrl: context.url,
  });
};

export const handleSyncJiraTask = async (context: ContextObject) => {
  return apiClient.post("/bookmarks", {
    title: `Syncing: ${context.title}`,
    url: context.url,
    metadata: JSON.stringify({ syncStatus: "linked" }),
  });
};
