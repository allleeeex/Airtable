import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import { deleteWorkspace, createWorkspaceForUser } from "~/server/services/workspace";

export const workspaceRouter = createTRPCRouter({
	// Create a workspace
	create: protectedProcedure
    .input(z.object({ id: z.string(), baseName: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      return createWorkspaceForUser({
        prisma: ctx.db,
        userId: ctx.session.user.id,
        id: input.id,
        baseName: input.baseName,
      });
    }),

  // Rename a workspace
  rename: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1, "Name cannot be empty"), }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.workSpace.findUnique({
        where: { id: input.id, createdById: ctx.session.user.id, },
      });
      if (!existing || existing.createdById !== ctx.session.user.id) {
        throw new Error("Workspace not found or not yours");
      }
      return ctx.db.workSpace.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    }),

  // Star a workspace
  toggleStar: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.workSpace.findUnique({
      where: { id: input.id, createdById: ctx.session.user.id, },
      select: { starred: true },
    });
    if (!existing) throw new Error("Not found");
    return ctx.db.workSpace.update({
      where: { id: input.id },
      data: { starred: !existing.starred },
    });
  }),

  // Return a single workspace
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))     // validate your ID format
    .query(async ({ ctx, input }) => {
      return ctx.db.workSpace.findFirst({
        where: { createdBy: { id: ctx.session.user.id }, id: input.id },
        orderBy: { createdAt: "desc" },
      });
  }),

	// List workspaces
	list: protectedProcedure
    .query(async ({ ctx }) => {
    return ctx.db.workSpace.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),

  // List alphabetically workspaces
  listAlphabetical: protectedProcedure
    .query(async ({ ctx }) => {
    return ctx.db.workSpace.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { name: "asc" },
    });
  }),

  // List starred workspaces
  listStarred: protectedProcedure
    .query(async ({ ctx }) => {
    return ctx.db.workSpace.findMany({
      where: { createdById: ctx.session.user.id, starred: true },
      orderBy: { createdAt: "desc" },
    });
  }),

	// Open workspace
	open: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workSpace.update({
        where: { id: input.id, createdById: ctx.session.user.id, },
        data: { openedAt: new Date() },
      });
    }),
	
	// Delete workspaces
	delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<{ id: string }> => {
      return deleteWorkspace({
        prisma:     ctx.db,
        userId:     ctx.session.user.id,
        workspaceId: input.id, 
      });
    }),
})