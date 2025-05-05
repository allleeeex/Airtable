import type { WorkSpace, User, Base, Table, Field, Record as TableRecord, Cell } from "@prisma/client";

export type WorkSpaceWithRelations = WorkSpace & {
  createdBy: User;
  sharedUsers: User[];
  pendingUsers: User[];
};

export type BaseWithRelations = Base & {
  createdBy: User;
  sharedUsers: User[];
  pendingUsers: User[];
};

export type BaseWithTables = Base & {
  createdBy: User;
  sharedUsers: User[];
  pendingUsers: User[];
  tables: Table[];
};

export type AirtableViewConfig = {
  sort: { fieldId: string; direction: "asc" | "desc" }[];
  filters: {
    fieldId: string;
    op: "gt" | "lt" | "eq" | "contains" | "isEmpty" | "isNotEmpty";
    value?: string | number;
  }[];
  searchQuery: string;
  hiddenFieldIds: string[];
};

export interface BaseStoreState {
  base: BaseWithTables | null;
  table: Table | null; 
  selectedBaseId: string | null;
  selectedTableId: string | null;
  viewConfigs: Record<string, AirtableViewConfig>;

  setSelectedBase: (id: string | null) => void;
  setBase: (base: BaseWithTables | null) => void;
  setSelectedTable: (id: string | null) => void;
  setTable: (table: Table | null) => void;
  updateViewConfig: (tableId: string, config: Partial<AirtableViewConfig>) => void;
}