import { registry } from "../module-registry";
import { useContextStore } from "../state/store";

export class ContextEngine {
  /**
   * Manually extract context from the current page.
   * This is explicitly invoked by the user via the Command Palette,
   * enforcing the Zero-Spyware philosophy.
   */
  async extractNow(url: string) {
    console.log("[ContextEngine] Manually extracting context for:", url);
    
    // Clear any stale context before extraction
    useContextStore.getState().setActiveContext(null);

    const adapter = registry.getActiveAdapter(url);
    if (!adapter) {
      console.log("[ContextEngine] No adapter found for this URL.");
      return null;
    }

    if (adapter.init) {
      adapter.init();
    }

    // 1. Try Selection-based detection first
    if (adapter.selectionDetectors) {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";
      if (text.length > 0) {
        for (const detector of adapter.selectionDetectors) {
          const context = detector.detectSelection(text, selection);
          if (context) {
            useContextStore.getState().setActiveContext(context);
            return context;
          }
        }
      }
    }

    // 2. Fall back to generic page-based detection
    for (const detector of adapter.detectors) {
      const context = detector.detect();
      if (context) {
        useContextStore.getState().setActiveContext(context);
        return context;
      }
    }

    console.log("[ContextEngine] No context detected by adapter.");
    return null;
  }

  /**
   * Enforce Zero-Knowledge philosophy by explicitly destroying
   * the active context after an action is executed.
   */
  discardContext() {
    console.log("[ContextEngine] Discarding context (Zero-Knowledge Enforced).");
    useContextStore.getState().setActiveContext(null);
  }
}

export const contextEngine = new ContextEngine();
