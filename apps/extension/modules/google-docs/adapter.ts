import type { SiteAdapter } from "../../core/types";
import { documentDetector, documentSelectionDetector } from "./detectors";
import { handleCreateTaskFromSelection, handleBookmarkSection, handleSaveKnowledgeNote } from "./actions";

export const googleDocsAdapter: SiteAdapter = {
  moduleName: "google-docs",
  matchesUrl: (url) => url.includes("docs.google.com/document"),
  detectors: [documentDetector],
  selectionDetectors: [documentSelectionDetector],
  actions: [
    {
      id: "create_task_from_selection",
      label: "Create Task",
      icon: "check-square",
      isAvailable: (ctx) => ctx.type === "selection",
    },
    {
      id: "bookmark_section",
      label: "Bookmark Section",
      icon: "bookmark",
      isAvailable: (ctx) => ctx.type === "selection",
    },
    {
      id: "save_knowledge_note",
      label: "Save Knowledge Note",
      icon: "book",
      isAvailable: (ctx) => ctx.type === "selection",
    }
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_task_from_selection": return handleCreateTaskFromSelection(context);
      case "bookmark_section": return handleBookmarkSection(context);
      case "save_knowledge_note": return handleSaveKnowledgeNote(context);
      default: throw new Error("Action not supported");
    }
  }
};
