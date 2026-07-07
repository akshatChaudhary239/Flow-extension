import type { SiteAdapter } from "../../core/types";
import { messageDetector } from "./detectors";
import { handleCreateSlackTask, handleBookmarkSlackMessage, handleRemindSlackThread } from "./actions";

export const slackAdapter: SiteAdapter = {
  moduleName: "slack",
  matchesUrl: (url) => url.includes("app.slack.com"),
  detectors: [messageDetector],
  actions: [
    {
      id: "create_slack_task",
      label: "Create Task",
      icon: "check-square",
      isAvailable: (ctx) => ctx.type === "message",
    },
    {
      id: "bookmark_slack_message",
      label: "Bookmark Message",
      icon: "bookmark",
      isAvailable: (ctx) => ctx.type === "message",
    },
    {
      id: "remind_slack_thread",
      label: "Remind Me",
      icon: "clock",
      isAvailable: (ctx) => ctx.type === "message",
    }
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_slack_task": return handleCreateSlackTask(context);
      case "bookmark_slack_message": return handleBookmarkSlackMessage(context);
      case "remind_slack_thread": return handleRemindSlackThread(context);
      default: throw new Error("Action not supported");
    }
  }
};
