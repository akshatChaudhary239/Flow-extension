import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";

export const handleCreateTask = async (context: ContextObject) => {
  return apiClient.post("/tasks", {
    title: `Follow up with ${context.title}`,
    description: context.bodyText?.substring(0, 500),
    sourceUrl: context.url,
  });
};

export const handleSaveNote = async (context: ContextObject) => {
  return apiClient.post("/notes", {
    content: `Note regarding ${context.title}: `,
    sourceUrl: context.url,
  });
};

export const handleBookmark = async (context: ContextObject) => {
  return apiClient.post("/bookmarks", {
    title: context.title || "LinkedIn Profile",
    url: context.url,
  });
};

export const handleTrackConnection = async (context: ContextObject) => {
  return apiClient.post("/connections", {
    profileUrl: context.url,
    profileName: context.title,
    status: context.metadata?.connectionStatus || "none",
  });
};
