import type { SiteAdapter } from "../types";

class ModuleRegistry {
  private adapters: SiteAdapter[] = [];

  register(adapter: SiteAdapter) {
    this.adapters.push(adapter);
  }

  getActiveAdapter(url: string): SiteAdapter | null {
    return this.adapters.find(adapter => adapter.matchesUrl(url)) || null;
  }
}

export const registry = new ModuleRegistry();
