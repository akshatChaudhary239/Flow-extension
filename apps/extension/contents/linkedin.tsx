import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { ContextCard } from "../modules/linkedin/ui/ContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { linkedinAdapter } from "../modules/linkedin/adapter";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"],
};

registry.register(linkedinAdapter);

const LinkedInContentScript = () => {
  useEffect(() => {
    contextEngine.start();
    return () => contextEngine.stop();
  }, []);

  return <ContextCard />;
};

export default LinkedInContentScript;
