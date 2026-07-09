import type { ActionDefinition } from "./types";
import type { ContextObject } from "@flow/types";

export interface ConfidentAction extends ActionDefinition {
  confidenceScore: number; // 0 to 100
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW";
}

export class ConfidenceEngine {
  /**
   * Evaluates the recommended actions, assigns confidence scores,
   * filters out low confidence, and limits to top 3.
   */
  evaluate(actions: ActionDefinition[], context: ContextObject): ConfidentAction[] {
    console.log("[ConfidenceEngine] Evaluating confidence for actions...");
    
    const scoredActions: ConfidentAction[] = actions.map(action => {
      // In a production AI implementation, this score would be dynamic.
      // For now, we use a deterministic heuristics approach.
      let score = 50;

      // Heuristic Example: If context is a selection, creating a task is highly likely.
      if (context.type === "selection" && action.id === "create_task_from_selection") {
        score = 95;
      }
      
      // Heuristic Example: Emails often result in Tasks or Reminders
      if (context.type === "email") {
        if (action.id === "create_task") score = 85;
        if (action.id === "set_reminder") score = 75;
      }

      let level: "HIGH" | "MEDIUM" | "LOW" = "LOW";
      if (score >= 80) level = "HIGH";
      else if (score >= 50) level = "MEDIUM";

      return {
        ...action,
        confidenceScore: score,
        confidenceLevel: level
      };
    });

    // Filter out LOW confidence and sort by highest score
    const filteredAndSorted = scoredActions
      .filter(a => a.confidenceLevel !== "LOW")
      .sort((a, b) => b.confidenceScore - a.confidenceScore);

    // Enforce the Golden Rule: Maximum 3 suggested actions
    const finalActions = filteredAndSorted.slice(0, 3);
    
    console.log(`[ConfidenceEngine] Returning top ${finalActions.length} confident actions.`, finalActions);
    return finalActions;
  }
}

export const confidenceEngine = new ConfidenceEngine();
