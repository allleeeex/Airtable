import { create } from "zustand";
import type { WorkSpace, Base } from "@prisma/client";
import type { WorkspaceSortKey } from "./workspaceSort";
import { SORT_OPTIONS } from "./workspaceSort";

interface DataState {
  // workspaces
  items: WorkSpace[];
  byId: Record<string, WorkSpace>;
  sortKey: WorkspaceSortKey;
  setSortKey: (k: WorkspaceSortKey) => void;
  readonly sorted: WorkSpace[];
  readonly alphabetical: WorkSpace[];
  setWorkspaces: (list: WorkSpace[]) => void;
  addWorkspace:  (w: WorkSpace) => void;
  updateWorkspace: (w: WorkSpace) => void;
  removeWorkspace: (id: string) => void;
  getNextName: (base: string) => string;
  getWorkspaceById: (id: string) => WorkSpace | null;

  // bases
  bases: Base[];
  byBaseId: Record<string, Base>;
  setBases: (list: Base[]) => void;
  addBase:  (b: Base) => void;
  updateBase:(b: Base) => void;
  removeBase:(id: string) => void;

  // selectors
  getBasesByWorkspace: (wsId: string) => Base[];
}

export const useDataStore = create<DataState>((set, get) => ({
  // Workspaces (your existing logic, renamed)
  items: [], byId: {},
  sortKey: "NAME_ASC",
  setSortKey: (sortKey) => set({ sortKey }),
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
  updateWorkspace: (w) =>
    set(s=>({
      items: s.items.map(x=>x.id===w.id?w:x),
      byId: {...s.byId,[w.id]:w}
    })),
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

  // Selector: get bases for a workspace
  getBasesByWorkspace: wsId =>
    get().bases.filter(b=>b.workspaceId === wsId),
}));
