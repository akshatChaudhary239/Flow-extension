import React from "react";
import { useContextStore } from "../../../core/state/store";
import { actionEngine } from "../../../core/action-engine";
import { registry } from "../../../core/module-registry";

export const SelectionContextCard = () => {
  const { activeContext } = useContextStore();

  if (!activeContext || activeContext.type !== "selection" || activeContext.module !== "google-docs") {
    return null;
  }

  const adapter = registry.getActiveAdapter(window.location.href);
  const availableActions = adapter?.actions.filter(a => a.isAvailable(activeContext)) || [];

  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 16px",
      background: "#333", // Dark theme for floating toolbar
      color: "white",
      borderRadius: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
      zIndex: 9999,
      fontFamily: "sans-serif",
      display: "flex",
      gap: "12px",
      alignItems: "center"
    }}>
      <span style={{ fontSize: "14px", fontWeight: "bold", marginRight: "8px" }}>
        Flow
      </span>
      {availableActions.map(action => (
        <button
          key={action.id}
          onClick={() => actionEngine.triggerAction(action.id)}
          style={{
            background: "transparent",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};
