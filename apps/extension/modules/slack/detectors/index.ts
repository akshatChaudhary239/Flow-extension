import type { ContextDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const messageDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    if (!window.location.href.includes("app.slack.com")) return null;
    
    const messages = document.querySelectorAll('[data-qa="message_content"]');
    if (!messages || messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];
    const senderEl = lastMessage.querySelector('[data-qa="message_sender"]');
    const sender = senderEl ? senderEl.textContent?.trim() : "Unknown Sender";
    
    const bodyEl = lastMessage.querySelector('[data-qa="message-text"]');
    const bodyText = bodyEl ? bodyEl.textContent?.trim() : "No content";

    const timestampEl = lastMessage.querySelector('[data-qa="message_timestamp"]');
    const timestamp = timestampEl ? timestampEl.getAttribute('href') : window.location.href;

    return {
      id: timestamp || window.location.href,
      module: "slack",
      type: "message",
      title: `Slack message from ${sender}`,
      sender,
      bodyText,
      url: window.location.href, 
    };
  }
};
