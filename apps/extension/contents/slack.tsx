import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { SlackContextCard } from "../modules/slack/ui/SlackContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { slackAdapter } from "../modules/slack/adapter";

export const config: PlasmoCSConfig = {
  matches: ["https://app.slack.com/*"],
};

registry.register(slackAdapter);

const SlackContentScript = () => {
  useEffect(() => {
    contextEngine.start();
    return () => contextEngine.stop();
  }, []);

  return <SlackContextCard />;
};

export default SlackContentScript;
