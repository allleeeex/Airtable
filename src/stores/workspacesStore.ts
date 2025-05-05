import { create } from "zustand";

import type { WorkSpaceWithRelations, BaseWithRelations } from "~/app/helper/types";
import type { WorkspaceSortKey } from "./workspaceSort";
import { SORT_OPTIONS } from "./workspaceSort";

interface DataState {
  // workspaces
  items: WorkSpaceWithRelations[];
  byId: Record<string, WorkSpaceWithRelations>;
  sortKey: WorkspaceSortKey;
  setSortKey: (k: WorkspaceSortKey) => void;
  getWorkspaces: () => WorkSpaceWithRelations[];
  readonly sorted: WorkSpaceWithRelations[];
  readonly alphabetical: WorkSpaceWithRelations[];
  setWorkspaces: (list: WorkSpaceWithRelations[]) => void;
  addWorkspace:  (w: WorkSpaceWithRelations) => void;
  updateWorkspace: (patch: { id: string } & Partial<WorkSpaceWithRelations>) => void;
  removeWorkspace: (id: string) => void;
  getNextName: (base: string) => string;
  getWorkspaceById: (id: string) => WorkSpaceWithRelations | null;

  // bases
  bases: BaseWithRelations[];
  byBaseId: Record<string, BaseWithRelations>;
  setBases: (list: BaseWithRelations[]) => void;
  addBase:  (b: BaseWithRelations) => void;
  updateBase:(b: BaseWithRelations) => void;
  removeBase:(id: string) => void;
  getBases: () => BaseWithRelations[];

  // selectors
  getBasesByWorkspace: (wsId: string) => BaseWithRelations[];
  getBaseById: (id: string) => BaseWithRelations | null;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Workspaces (your existing logic, renamed)
  items: [], byId: {},
  sortKey: "NAME_ASC",
  setSortKey: (sortKey) => set({ sortKey }),
  getWorkspaces: () => get().items,
  get sorted() {
    const { items, sortKey } = get();
    return [...items].sort(SORT_OPTIONS[sortKey].comparator);
  },
  get alphabetical() {
    return [...get().items].sort((a,b)=>a.name.localeCompare(b.name));
  },
  setWorkspaces: (items) =>
    set({ items, byId: Object.fromEntries(items.map(w=>[w.id,w])) }),
  addWorkspace: (w) =>
    set(s=>({ items:[...s.items,w], byId:{...s.byId,[w.id]:w} })),
  updateWorkspace: (patch: Partial<WorkSpaceWithRelations> & { id: string }) =>
    set(s => {
      const existing = s.byId[patch.id];
      if (!existing) return {};
      const merged = { ...existing, ...patch };
      return {
        items: s.items.map(w => w.id === patch.id ? merged : w),
        byId:   { ...s.byId, [patch.id]: merged },
      };
    }),
  removeWorkspace: (id) =>
    set(s=>{
      const { [id]:_,...rest } = s.byId;
      return { items:s.items.filter(w=>w.id!==id), byId:rest };
    }),
  getNextName: base => {
    const used = new Set<number>();
    const pattern = new RegExp(`^${base}(?: (\\d+))?$`);
    for(const w of get().items){
      const m = pattern.exec(w.name);
      if(m) used.add(m[1]?+m[1]:0);
    }
    let n=0; while(used.has(n)) n++;
    return n? `${base} ${n}`: base;
  },
  getWorkspaceById: id=>get().byId[id] ?? null,

  // Bases
  bases: [], byBaseId: {},
  setBases: (list) =>
    set({ bases: list, byBaseId: Object.fromEntries(list.map(b=>[b.id,b])) }),
  addBase: b =>
    set(s=>({ bases:[...s.bases,b], byBaseId:{...s.byBaseId,[b.id]:b} })),
  updateBase: b =>
    set(s=>({
      bases: s.bases.map(x=>x.id===b.id?b:x),
      byBaseId: {...s.byBaseId,[b.id]:b}
    })),
  removeBase: id =>
    set(s=>{
      const { [id]:_,...rest } = s.byBaseId;
      return { bases:s.bases.filter(b=>b.id!==id), byBaseId:rest };
    }),
  getBases: () => get().bases,

  // Selector: get bases for a workspace
  getBasesByWorkspace: wsId =>
    get().bases.filter(b=>b.workspaceId === wsId),
  getBaseById: (id) => get().byBaseId[id] ?? null,
}));
