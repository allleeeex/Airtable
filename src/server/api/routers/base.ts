// server/routers/base.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  // Create a new Base
  createBase: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // ensure the workspace belongs to this user
      await ctx.db.workSpace.findFirstOrThrow({
        where: { id: input.workspaceId, createdById: ctx.session.user.id },
      });

      return ctx.db.base.create({
        data: {
          name: "Untitled Base",
          openedAt:    new Date(),
          workspace:   { connect: { id: input.workspaceId } },
          createdBy:   { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // List all Bases for current user (optionally filter by workspace)
  listBase: protectedProcedure
    .input(z.object({ workspaceId: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      return ctx.db.base.findMany({
        where: {
          createdById: ctx.session.user.id,
          workspaceId: input?.workspaceId ?? undefined,
        },
        orderBy: { createdAt: "desc" },
        include: {
          sharedUsers: true,
        }
      });
    }),

  // Star / unstar a Base
  starBase: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.base.findFirstOrThrow({
        where: { id: input.id, createdById: ctx.session.user.id },
        select: { starred: true },
      });
      return ctx.db.base.update({
        where: { id: input.id },
        data: { starred: !existing.starred },
      });
    }),

  // Rename a Base
  renameBase: protectedProcedure
    .input(
      z.object({
        id:   z.string(),
        name: z.string().min(1, "Name cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.base.update({
        where: {
          id:           input.id,
          createdById:  ctx.session.user.id,
        },
        data: { name: input.name },
      });
    }),

  // Delete a Base
  deleteBase: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.base.delete({
        where: {
          id:          input.id,
          createdById: ctx.session.user.id,
        },
      });
      return { id: input.id };
    }),
  
  // Open a base
  openBase: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.base.update({
        where: {
          id:          input.id,
          createdById: ctx.session.user.id,
        },
        data: { openedAt: new Date() },
      });
    }),
});
