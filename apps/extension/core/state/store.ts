import { create } from "zustand";
import type { ContextObject } from "@flow/types";

interface ContextState {
  activeContext: ContextObject | null;
  setActiveContext: (context: ContextObject | null) => void;
}

export const useContextStore = create<ContextState>((set) => ({
  activeContext: null,
  setActiveContext: (context) => set({ activeContext: context }),
}));
