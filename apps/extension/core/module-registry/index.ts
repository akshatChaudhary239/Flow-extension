import type { SiteAdapter } from "../types";

// Import all adapters
import { gmailAdapter } from "../../modules/gmail/adapter";
import { googleDocsAdapter } from "../../modules/google-docs/adapter";
import { googleDriveAdapter } from "../../modules/google-drive/adapter";
import { jiraAdapter } from "../../modules/jira/adapter";
import { linkedinAdapter } from "../../modules/linkedin/adapter";
import { slackAdapter } from "../../modules/slack/adapter";

class ModuleRegistry {
  private adapters: SiteAdapter[] = [];

  constructor() {
    // Automatically register all known adapters
    this.register(gmailAdapter);
    this.register(googleDocsAdapter);
    this.register(googleDriveAdapter);
    this.register(jiraAdapter);
    this.register(linkedinAdapter);
    this.register(slackAdapter);
  }

  register(adapter: SiteAdapter) {
    if (adapter) {
      this.adapters.push(adapter);
    }
  }

  getActiveAdapter(url: string): SiteAdapter | null {
    return this.adapters.find(adapter => adapter.matchesUrl(url)) || null;
  }
}

export const registry = new ModuleRegistry();
