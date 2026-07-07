import type { ContextDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const profileDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes("linkedin.com/in/")) return null;
    
    const nameEl = document.querySelector('h1.text-heading-xlarge');
    if (!nameEl) return null;
    
    const title = nameEl.textContent?.trim() || "Unknown Profile";
    const headlineEl = document.querySelector('div.text-body-medium');
    const headline = headlineEl?.textContent?.trim() || "";
    
    const connectBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Connect') || b.textContent?.includes('Pending') || b.textContent?.includes('Message'));
    let status = "none";
    if (connectBtn?.textContent?.includes('Pending')) status = "pending";
    if (connectBtn?.textContent?.includes('Message')) status = "connected";

    return {
      id: window.location.pathname,
      module: "linkedin",
      type: "profile",
      title,
      bodyText: headline,
      url: window.location.href,
      metadata: { connectionStatus: status }
    };
  }
};

export const messageDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes("linkedin.com/messaging/")) return null;
    
    const senderEl = document.querySelector('h2.msg-s-message-list__profile-name');
    if (!senderEl) return null;
    
    const sender = senderEl.textContent?.trim() || "Unknown Sender";
    const threadId = window.location.pathname.split('/').pop() || "";

    const messages = document.querySelectorAll('.msg-s-event-listitem__body');
    let bodyText = "";
    if (messages.length > 0) {
      bodyText = messages[messages.length - 1].textContent?.trim() || "";
    }

    return {
      id: threadId,
      module: "linkedin",
      type: "message",
      title: `Message from ${sender}`,
      sender,
      bodyText,
      url: window.location.href,
    };
  }
};
