import type { SiteAdapter } from "../../core/types";
import { issueDetector, backlogDetector } from "./detectors";
import { handleCreateJiraIssue, handleSyncJiraTask } from "./actions";

export const jiraAdapter: SiteAdapter = {
  moduleName: "jira",
  matchesUrl: (url) => url.includes(".atlassian.net"),
  detectors: [issueDetector, backlogDetector],
  actions: [
    {
      id: "create_jira_issue",
      label: "Create Quick Flow Task",
      icon: "check-square",
      isAvailable: (ctx) => ctx.type === "issue" || ctx.type === "board",
    },
    {
      id: "sync_jira_task",
      label: "Sync with Flow",
      icon: "refresh-cw",
      isAvailable: (ctx) => ctx.type === "issue",
    }
  ],
  handleAction: async (actionId, context) => {
    switch (actionId) {
      case "create_jira_issue": return handleCreateJiraIssue(context);
      case "sync_jira_task": return handleSyncJiraTask(context);
      default: throw new Error("Action not supported");
    }
  }
};
