import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";

export const handleCreateFileTask = async (context: ContextObject) => {
  return apiClient.post("/tasks", {
    title: `Task for ${context.title}`,
    description: `Created from Google Drive`,
    sourceUrl: context.url,
  });
};

export const handleWatchFolder = async (context: ContextObject) => {
  return apiClient.post("/bookmarks", {
    title: `Watching: ${context.title}`,
    url: context.url,
    metadata: JSON.stringify({ watchForChanges: true }),
  });
};
