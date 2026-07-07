import { registry } from "../module-registry";
import { useContextStore } from "../state/store";

export class ActionEngine {
  async triggerAction(actionId: string) {
    const context = useContextStore.getState().activeContext;
    if (!context) {
      throw new Error("No active context");
    }

    const adapter = registry.getActiveAdapter(window.location.href);
    if (!adapter) {
      throw new Error("No active adapter");
    }

    try {
      console.log(`[ActionEngine] Triggering action: ${actionId} for context:`, context);
      const result = await adapter.handleAction(actionId, context);
      console.log(`[ActionEngine] Action ${actionId} successful! Result:`, result);
      return result;
    } catch (error) {
      console.error(`[ActionEngine] Action ${actionId} failed:`, error);
      throw error;
    }
  }
}

export const actionEngine = new ActionEngine();
