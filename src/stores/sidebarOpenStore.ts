// src/stores/uiStore.ts
import { create } from "zustand";

interface UIState {
  sidebarOpened: boolean;
  setSidebarOpened: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpened: false,
  setSidebarOpened: (open) => set({ sidebarOpened: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpened: !s.sidebarOpened })),
}));
