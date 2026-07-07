import type { ContextDetector } from "../../../core/types";
import type { ContextObject } from "@flow/types";

export const emailDetector: ContextDetector = {
  detect: (): ContextObject | null => {
    // Gmail specific DOM selectors
    const subjectEl = document.querySelector('h2[data-thread-perm-id]');
    if (!subjectEl) return null;

    const threadId = subjectEl.getAttribute('data-thread-perm-id') || "";
    const subject = subjectEl.textContent || "No Subject";
    
    // Attempt to find the last message body
    const messages = document.querySelectorAll('.a3s.aiL');
    let bodyText = "";
    if (messages.length > 0) {
      bodyText = messages[messages.length - 1].textContent || "";
    }

    const senderEl = document.querySelector('span[email]');
    const sender = senderEl ? senderEl.getAttribute('email') || "" : "";

    return {
      id: threadId,
      module: "gmail",
      type: "email",
      title: subject,
      sender,
      bodyText,
      url: window.location.href,
    };
  }
};
