import type { SiteAdapter } from "../../core/types";
import { driveDetector } from "./detectors";
import { handleCreateFileTask, handleWatchFolder } from "./actions";

export const googleDriveAdapter: SiteAdapter = {
  moduleName: "google-drive",
  matchesUrl: (url) => url.includes("drive.google.com/drive"),
  detectors: [driveDetector],
  actions: [
    {
      id: "create_file_task",
      label: "Create Quick Task (Smart Suggestion)",
      icon: "check-circle",
      isAvailable: (ctx) => ctx.type === "file",
    },
    {
      id: "watch_folder",
      label: "Watch for Changes (Smart Suggestion)",
      icon: "eye",
      isAvailable: (ctx) => ctx.type === "folder",
    }
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_file_task": return handleCreateFileTask(context);
      case "watch_folder": return handleWatchFolder(context);
      default: throw new Error("Action not supported");
    }
  }
};
