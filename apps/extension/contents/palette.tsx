import type { PlasmoCSConfig } from "plasmo";
import React, { useState, useEffect } from "react";
import { contextEngine } from "../core/context-engine";
import { recommendationEngine } from "../core/recommendation-engine";
import { confidenceEngine, type ConfidentAction } from "../core/confidence-engine";
import { actionEngine } from "../core/action-engine";
import { useContextStore } from "../core/state/store";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
};

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState<ConfidentAction[]>([]);
  const { activeContext } = useContextStore();

  useEffect(() => {
    const handleMessage = async (request: any) => {
      if (request.action === "TOGGLE_FLOW_PALETTE") {
        if (!isOpen) {
          // Extract Context On-Demand (Zero-Spyware Rule)
          const ctx = await contextEngine.extractNow(window.location.href);
          if (ctx) {
            // Generate Recommendations
            const recommended = recommendationEngine.generateRecommendations(ctx, window.location.href);
            // Apply Confidence Scoring
            const finalActions = confidenceEngine.evaluate(recommended, ctx);
            setActions(finalActions);
          } else {
            setActions([]);
          }
        }
        setIsOpen(!isOpen);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    
    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        contextEngine.discardContext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(4px)",
      zIndex: 2147483647, // max z-index
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        width: "600px",
        backgroundColor: "#1a1a1a",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        border: "1px solid #333",
        color: "#fff"
      }}>
        {/* Header / Context Info */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #333" }}>
          {activeContext ? (
            <div>
              <div style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                Context: {activeContext.module} • {activeContext.type}
              </div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {activeContext.title || "Unknown Context"}
              </h2>
            </div>
          ) : (
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#888" }}>
              No contextual actions available here
            </h2>
          )}
        </div>

        {/* Actions List */}
        <div style={{ padding: "12px" }}>
          {actions.length > 0 ? actions.map((action, index) => (
            <button
              key={action.id}
              onClick={async () => {
                await actionEngine.triggerAction(action.id);
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: index === 0 ? "#2563eb" : "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#fff",
                textAlign: "left",
                marginBottom: "4px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (index !== 0) e.currentTarget.style.backgroundColor = "#333";
              }}
              onMouseLeave={(e) => {
                if (index !== 0) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: "500" }}>{action.label}</span>
              </div>
              <span style={{ 
                fontSize: "12px", 
                backgroundColor: "rgba(255,255,255,0.1)", 
                padding: "4px 8px", 
                borderRadius: "4px" 
              }}>
                {action.confidenceLevel} Match
              </span>
            </button>
          )) : (
            <div style={{ padding: "24px", textAlign: "center", color: "#666" }}>
              Press Esc to close
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
