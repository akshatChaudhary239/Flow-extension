import type { ContextDetector, SelectionDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const documentDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    return null; 
  }
}

export const documentSelectionDetector: SelectionDetector = {
  detectSelection: (selectedText: string): ContextObject | null => {
    if (!window.location.href.includes("docs.google.com/document/")) return null;
    if (!selectedText || selectedText.trim().length === 0) return null;

    const titleEl = document.querySelector('.docs-title-input') as HTMLInputElement;
    const documentTitle = titleEl ? titleEl.value : "Untitled Document";

    return {
      id: window.location.pathname,
      module: "google-docs",
      type: "selection",
      title: `Selection from: ${documentTitle}`,
      bodyText: selectedText,
      url: window.location.href, 
    };
  }
};
