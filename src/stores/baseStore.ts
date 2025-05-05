// stores/baseStore.ts
import { create } from "zustand";
import type { BaseStoreState, AirtableViewConfig } from "~/app/helper/types";

const defaultViewConfig: AirtableViewConfig = {
  sort: [],
  filters: [],
  searchQuery: "",
  hiddenFieldIds: [],
};

export const useBaseStore = create<BaseStoreState>((set) => ({
  base: null,
  table: null,
  selectedBaseId: null,
  selectedTableId: null,
  fieldsByTable: {},
  viewConfigs: {},
  
  setBase: (base) => set({ base: base }),
  setTable: (table) => set({ table: table }),
  setSelectedBase: (id) => set({ selectedBaseId: id }),
  setSelectedTable: (id) => set({ selectedTableId: id }),
    
  updateViewConfig: (tableId, config) =>
    set((state) => ({
      viewConfigs: {
        ...state.viewConfigs,
        [tableId]: {
          ...defaultViewConfig,
          ...state.viewConfigs[tableId],
          ...config,
        },
      },
    })),
}));
