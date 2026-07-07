import { registry } from "../module-registry";
import { useContextStore } from "../state/store";

export class ContextEngine {
  private intervalId: number | null = null;
  private currentUrl: string = "";
  private selectionListener = this.handleSelection.bind(this);
  private selectionTimeout: number | null = null;
  
  // MutationObserver for SPAs like Slack
  private mutationObserver: MutationObserver | null = null;
  private mutationTimeout: number | null = null;

  start() {
    this.currentUrl = window.location.href;
    const adapter = registry.getActiveAdapter(this.currentUrl);
    
    if (adapter?.init) {
      adapter.init();
    }

    // Run interval-based detection as a fallback and for traditional apps
    this.intervalId = window.setInterval(() => this.detect(), 1000);
    
    // Listen for selection changes
    document.addEventListener("selectionchange", this.selectionListener);

    // Setup MutationObserver for aggressive SPAs
    this.mutationObserver = new MutationObserver(() => this.handleMutation());
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    document.removeEventListener("selectionchange", this.selectionListener);
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.mutationTimeout) {
      window.clearTimeout(this.mutationTimeout);
    }
    if (this.selectionTimeout) {
      window.clearTimeout(this.selectionTimeout);
    }
  }

  private handleMutation() {
    // Debounce mutation events (SPAs trigger hundreds per second during navigation)
    if (this.mutationTimeout) {
      window.clearTimeout(this.mutationTimeout);
    }
    this.mutationTimeout = window.setTimeout(() => {
      this.detect();
    }, 250);
  }

  private handleSelection() {
    if (this.selectionTimeout) {
      window.clearTimeout(this.selectionTimeout);
    }
    // Throttle selection event
    this.selectionTimeout = window.setTimeout(() => {
      const adapter = registry.getActiveAdapter(this.currentUrl);
      if (!adapter || !adapter.selectionDetectors) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      if (text.length > 0) {
        for (const detector of adapter.selectionDetectors) {
          const context = detector.detectSelection(text, selection);
          if (context) {
            useContextStore.getState().setActiveContext(context);
            return;
          }
        }
      } else {
        // Fall back to standard detector if selection is cleared
        this.detect();
      }
    }, 200);
  }

  private detect() {
    // If URL changed, re-init
    if (window.location.href !== this.currentUrl) {
      this.currentUrl = window.location.href;
      const newAdapter = registry.getActiveAdapter(this.currentUrl);
      if (newAdapter?.init) {
        newAdapter.init();
      }
    }

    // If there is an active selection-based context, do not override it with a generic context
    const currentContext = useContextStore.getState().activeContext;
    if (currentContext && currentContext.type === "selection") {
      return;
    }

    const adapter = registry.getActiveAdapter(this.currentUrl);
    if (!adapter) {
      useContextStore.getState().setActiveContext(null);
      return;
    }

    for (const detector of adapter.detectors) {
      const context = detector.detect();
      if (context) {
        useContextStore.getState().setActiveContext(context);
        return;
      }
    }
    
    // No context matched
    useContextStore.getState().setActiveContext(null);
  }
}

export const contextEngine = new ContextEngine();
