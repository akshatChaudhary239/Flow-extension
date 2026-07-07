import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { SelectionContextCard } from "../modules/google-docs/ui/SelectionContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { googleDocsAdapter } from "../modules/google-docs/adapter";

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/document/*"],
};

registry.register(googleDocsAdapter);

const GoogleDocsContentScript = () => {
  useEffect(() => {
    contextEngine.start();
    return () => contextEngine.stop();
  }, []);

  return <SelectionContextCard />;
};

export default GoogleDocsContentScript;
