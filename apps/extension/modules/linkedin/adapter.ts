import type { SiteAdapter } from "../../core/types";
import { profileDetector, messageDetector } from "./detectors";
import { handleCreateTask, handleSaveNote, handleBookmark, handleTrackConnection } from "./actions";

export const linkedinAdapter: SiteAdapter = {
  moduleName: "linkedin",
  matchesUrl: (url) => url.includes("linkedin.com"),
  detectors: [profileDetector, messageDetector],
  actions: [
    {
      id: "create_task",
      label: "Create Follow-up Task",
      icon: "check-circle",
      isAvailable: (ctx) => ctx.type === "profile" || ctx.type === "message",
    },
    {
      id: "save_note",
      label: "Save Candidate Note",
      icon: "file-text",
      isAvailable: (ctx) => ctx.type === "profile",
    },
    {
      id: "bookmark",
      label: "Bookmark Profile",
      icon: "bookmark",
      isAvailable: (ctx) => ctx.type === "profile",
    },
    {
      id: "track_connection",
      label: "Track Connection Status",
      icon: "user-plus",
      isAvailable: (ctx) => ctx.type === "profile",
    } // wait, need to define track_connection in ActionId
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_task": return handleCreateTask(context);
      case "save_note": return handleSaveNote(context);
      case "bookmark": return handleBookmark(context);
      case "track_connection": return handleTrackConnection(context);
      default: throw new Error("Action not supported");
    }
  }
};
