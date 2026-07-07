import React from "react";
import { useContextStore } from "../../../core/state/store";
import { actionEngine } from "../../../core/action-engine";
import { registry } from "../../../core/module-registry";

export const ContextCard = () => {
  const { activeContext } = useContextStore();

  if (!activeContext) return null;

  const adapter = registry.getActiveAdapter(window.location.href);
  const availableActions = adapter?.actions.filter(a => a.isAvailable(activeContext)) || [];

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "16px",
      background: "#0077b5", // LinkedIn blue theme
      color: "white",
      border: "1px solid #005582",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      zIndex: 9999,
      fontFamily: "sans-serif",
      width: "300px"
    }}>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>LinkedIn Context</h3>
      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#e0f2fe" }}>
        <strong>Title:</strong> {activeContext.title || "None"}<br/>
        <strong>Type:</strong> {activeContext.type}
      </p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {availableActions.map(action => (
          <button
            key={action.id}
            onClick={() => actionEngine.triggerAction(action.id)}
            style={{
              padding: "8px 12px",
              background: "white",
              color: "#0077b5",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
