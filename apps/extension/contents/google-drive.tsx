import type { PlasmoCSConfig } from "plasmo";
import { useEffect } from "react";
import { DriveContextCard } from "../modules/google-drive/ui/DriveContextCard";
import { contextEngine } from "../core/context-engine";
import { registry } from "../core/module-registry";
import { googleDriveAdapter } from "../modules/google-drive/adapter";

export const config: PlasmoCSConfig = {
  matches: ["https://drive.google.com/drive/*"],
};

registry.register(googleDriveAdapter);

const GoogleDriveContentScript = () => {
  useEffect(() => {
    contextEngine.start();
    return () => contextEngine.stop();
  }, []);

  return <DriveContextCard />;
};

export default GoogleDriveContentScript;
