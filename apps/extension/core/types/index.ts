import type { ContextObject, ActionDefinition } from "@flow/types";

export interface ContextDetector {
  /**
   * Attempts to detect context from the current DOM.
   * Returns a ContextObject if matched, or null if no context is found.
   */
  detect: () => ContextObject | null;
}

export interface SelectionDetector {
  /**
   * Specifically handles a user text selection event.
   */
  detectSelection: (selectedText: string, selectionContext?: any) => ContextObject | null;
}

export interface SiteAdapter {
  /** Unique module identifier (e.g. 'gmail') */
  moduleName: string;
  
  /** URL matcher function to determine if this adapter should run on the current page */
  matchesUrl: (url: string) => boolean;
  
  /** Detectors used to parse the DOM and return context */
  detectors: ContextDetector[];

  /** Array of selection detectors (optional) */
  selectionDetectors?: SelectionDetector[];
  
  /** Array of available actions this module provides */
  actions: ActionDefinition[];
  
  /** Called when the module is first loaded to attach any global listeners or MutationObservers */
  init?: () => void;
  
  /** Called when a specific action is triggered from the ActionEngine */
  handleAction: (actionId: string, context: ContextObject) => Promise<any>;
}
