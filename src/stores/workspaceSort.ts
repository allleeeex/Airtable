import type { WorkSpace } from "@prisma/client";

export type WorkspaceSortKey =  
  | "NAME_ASC"  
  | "NAME_DESC"  
  | "OPENED_ASC"  
  | "OPENED_DESC";

export const SORT_OPTIONS: Record<WorkspaceSortKey, {  
  label: string;  
  comparator: (a: WorkSpace, b: WorkSpace) => number;  
}> = {
  NAME_ASC: {
    label: "Name (A → Z)",
    comparator: (a, b) => a.name.localeCompare(b.name),
  },
  NAME_DESC: {
    label: "Name (Z → A)",
    comparator: (a, b) => b.name.localeCompare(a.name),
  },
  OPENED_ASC: {
    label: "Opened (oldest first)",
    comparator: (a, b) => a.openedAt.getTime() - b.openedAt.getTime(),
    },
  OPENED_DESC: {
    label: "Opened (newest first)",
    comparator: (a, b) => b.openedAt.getTime() - a.openedAt.getTime(),
  },
};