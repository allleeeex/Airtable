import type { WorkSpace, User } from "@prisma/client";

export type WorkSpaceWithRelations = WorkSpace & {
  createdBy: User;
  sharedUsers: User[];
  pendingUsers: User[];
};