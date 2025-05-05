import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function createWorkspaceForUser(opts: {prisma: PrismaClient; id: string; userId: string; baseName: string; }) {
  const { prisma, id, userId, baseName } = opts;
  // 4) Create & return
  return prisma.workSpace.create({
    data: {
      id: id,
      name: baseName,
      createdById: userId,
    },
  });
}

export async function deleteWorkspace(opts: { prisma: PrismaClient; userId: string; workspaceId: string; }) {
  const { prisma, userId, workspaceId } = opts;

  const workspace = await prisma.workSpace.findUnique({ where: { id: workspaceId } });
  if (!workspace) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found." });
  }
  if (workspace.createdById !== userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your workspace." });
  }

  await prisma.workSpace.delete({ where: { id: workspaceId } });
  return { id: workspaceId };
}

