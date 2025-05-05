import { create } from "zustand";

interface UIState {
  sidebarOpened: boolean;
  setSidebarOpened: (open: boolean) => void;
  toggleSidebar: () => void;
  createBaseModal: {
    isOpen: boolean;
    workspaceId: string | null;
  };
  openCreateBaseModal: (workspaceId: string) => void;
  closeCreateBaseModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpened: false,
  setSidebarOpened: (open) => set({ sidebarOpened: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpened: !s.sidebarOpened })),
  createBaseModal: { isOpen: false, workspaceId: null },
  openCreateBaseModal: (workspaceId) =>
    set((s) => ({
      createBaseModal: {
        workspaceId: workspaceId !== "" 
          ? workspaceId 
          : s.createBaseModal.workspaceId,
        isOpen: true,
      },
    })),
  closeCreateBaseModal: () =>
    set((s) => ({
      createBaseModal: {
        ...s.createBaseModal,
        isOpen: false,
      },
    })),
}));
