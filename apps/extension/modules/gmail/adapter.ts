import type { SiteAdapter } from "../../core/types";
import { emailDetector } from "./detectors";
import { handleCreateTask, handleSetReminder } from "./actions";

export const gmailAdapter: SiteAdapter = {
  moduleName: "gmail",
  matchesUrl: (url) => url.includes("mail.google.com"),
  detectors: [emailDetector],
  actions: [
    {
      id: "create_task",
      label: "Create Task",
      icon: "check-circle",
      isAvailable: (ctx) => ctx.type === "email",
    },
    {
      id: "set_reminder",
      label: "Set Reminder",
      icon: "clock",
      isAvailable: (ctx) => ctx.type === "email",
    }
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_task":
        return handleCreateTask(context);
      case "set_reminder":
        return handleSetReminder(context);
      default:
        throw new Error("Action not supported");
    }
  }
};
