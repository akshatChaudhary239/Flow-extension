import type { ContextDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const driveDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes("drive.google.com/drive")) return null;
    
    // Check if a specific file is selected in the list view
    const selectedRow = document.querySelector('[aria-selected="true"]');
    if (selectedRow) {
      const fileName = selectedRow.getAttribute('aria-label') || selectedRow.textContent?.trim() || "Unknown File";
      return {
        id: "selected-file",
        module: "google-drive",
        type: "file",
        title: `File: ${fileName}`,
        bodyText: "User has selected a file in the list view.",
        url: window.location.href, 
      };
    }

    // Otherwise, assume folder view context
    const folderNameEl = document.querySelector('h1') || document.querySelector('[aria-label="My Drive"]');
    const folderName = folderNameEl ? folderNameEl.textContent?.trim() : "Drive Folder";
    
    return {
      id: window.location.pathname,
      module: "google-drive",
      type: "folder",
      title: folderName || "Drive Folder",
      bodyText: "Browsing folder",
      url: window.location.href,
    };
  }
};
