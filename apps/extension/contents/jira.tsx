import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { JiraContextCard } from "../modules/jira/ui/JiraContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { jiraAdapter } from "../modules/jira/adapter";

export const config: PlasmoCSConfig = {
  matches: ["https://*.atlassian.net/*"],
};

registry.register(jiraAdapter);

const JiraContentScript = () => {
  useEffect(() => {
    contextEngine.start();
    return () => contextEngine.stop();
  }, []);

  return <JiraContextCard />;
};

export default JiraContentScript;
