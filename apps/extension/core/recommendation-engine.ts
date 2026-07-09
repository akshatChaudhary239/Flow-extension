import { registry } from "./module-registry";
import type { ContextObject } from "@flow/types";
import type { ActionDefinition } from "./types";

export class RecommendationEngine {
  /**
   * Generates a list of all theoretically possible actions for a given context.
   */
  generateRecommendations(context: ContextObject, url: string): ActionDefinition[] {
    console.log("[RecommendationEngine] Generating recommendations for context...", context);
    const adapter = registry.getActiveAdapter(url);
    if (!adapter) {
      console.log("[RecommendationEngine] No adapter found, falling back to global generic actions.");
      // If we had global generic actions, they would go here.
      return [];
    }

    // Filter the adapter's actions to only those available for this context
    const recommendations = adapter.actions.filter(action => action.isAvailable(context));
    
    console.log(`[RecommendationEngine] Found ${recommendations.length} possible actions.`);
    return recommendations;
  }
}

export const recommendationEngine = new RecommendationEngine();
