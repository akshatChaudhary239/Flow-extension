import type { ContextObject } from "@flow/types";
import { apiClient } from "../../../core/api-client";

export const handleCreateTaskFromSelection = async (context: ContextObject) => {
  return apiClient.post("/tasks", {
    title: `Task from: ${context.title}`,
    description: `Selected text: "${context.bodyText}"`,
    sourceUrl: context.url,
  });
};

export const handleBookmarkSection = async (context: ContextObject) => {
  return apiClient.post("/bookmarks", {
    title: context.title || "Google Docs Section",
    url: context.url,
    metadata: JSON.stringify({ snippet: context.bodyText }),
  });
};

export const handleSaveKnowledgeNote = async (context: ContextObject) => {
  return apiClient.post("/notes", {
    content: `Knowledge snippet from ${context.title}:\n\n> ${context.bodyText}`,
    sourceUrl: context.url,
  });
};
