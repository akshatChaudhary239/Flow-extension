import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { ContextCard } from "../modules/gmail/ui/ContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { gmailAdapter } from "../modules/gmail/adapter";

// Configure Plasmo to run this on Gmail
export const config: PlasmoCSConfig = {
  matches: ["https://mail.google.com/*"],
};

// Register the Gmail Adapter immediately
registry.register(gmailAdapter);

const GmailContentScript = () => {
  useEffect(() => {
    // Start context engine loop when the content script loads
    contextEngine.start();
    
    return () => {
      contextEngine.stop();
    };
  }, []);

  return <ContextCard />;
};

export default GmailContentScript;
