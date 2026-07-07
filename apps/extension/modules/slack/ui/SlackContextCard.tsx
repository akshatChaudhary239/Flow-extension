import React from "react";
import { useContextStore } from "../../../core/state/store";
import { actionEngine } from "../../../core/action-engine";
import { registry } from "../../../core/module-registry";

export const SlackContextCard = () => {
  const { activeContext } = useContextStore();

  if (!activeContext || activeContext.module !== "slack") {
    return null;
  }

  const adapter = registry.getActiveAdapter(window.location.href);
  const availableActions = adapter?.actions.filter(a => a.isAvailable(activeContext)) || [];

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "16px",
      background: "#4A154B", 
      color: "white",
      border: "1px solid #361036",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      zIndex: 9999,
      fontFamily: "sans-serif",
      width: "300px"
    }}>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Slack Message</h3>
      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#e8d5e8" }}>
        <strong>From:</strong> {activeContext.sender || "Unknown"}<br/>
        <em style={{display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px'}}>
          "{activeContext.bodyText}"
        </em>
      </p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {availableActions.map(action => (
          <button
            key={action.id}
            onClick={() => actionEngine.triggerAction(action.id)}
            style={{
              padding: "8px 12px",
              background: "white",
              color: "#4A154B",
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
