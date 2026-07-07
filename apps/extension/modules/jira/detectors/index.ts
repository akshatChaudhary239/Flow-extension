import type { ContextDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const issueDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes(".atlassian.net/browse/")) return null;
    
    const titleEl = document.querySelector('h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]');
    const title = titleEl ? titleEl.textContent?.trim() : "Unknown Issue";
    
    const key = window.location.pathname.split('/').pop() || "UNKNOWN-KEY";

    return {
      id: key,
      module: "jira",
      type: "issue",
      title: `[${key}] ${title}`,
      bodyText: "Jira Issue",
      url: window.location.href,
    };
  }
};

export const backlogDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes(".atlassian.net/jira/software/")) return null;
    if (!window.location.href.includes("/backlog") && !window.location.href.includes("/boards/")) return null;

    return {
      id: "board-view",
      module: "jira",
      type: "board",
      title: "Jira Board / Backlog",
      bodyText: "Browsing Jira Project",
      url: window.location.href,
    };
  }
};
