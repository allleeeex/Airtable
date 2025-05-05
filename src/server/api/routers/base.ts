// server/routers/base.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  // Create a new Base
  createBase: protectedProcedure
    .input(z.object({ 
      workspaceId: z.string(),
      table: z.object({
        name: z.string(),
        fields: z.array(z.object({
          name: z.string(),
          type: z.string(),
          order: z.string(),
          options: z.any().optional(),
        })),
        records: z.array(z.object({
          order: z.string(),
          cells: z.array(z.object({
            fieldOrder: z.number(),
            value: z.any(),
          })),
        })),
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.db.base.create({
        data: {
          name: "Untitled Base",
          openedAt: new Date(),
          workspace: { connect: { id: input.workspaceId } },
          createdBy: { connect: { id: ctx.session.user.id } },
          lastSelectedTableId: "",
        },
      });

      const table = await ctx.db.table.create({
        data: {
          name: input.table.name,
          baseId: base.id,
        },
      });

      const createdFields = await Promise.all(
        input.table.fields.map((field) =>
          ctx.db.field.create({
            data: {
              name: field.name,
              type: field.type,
              order: field.order,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              options: field.options,
              tableId: table.id,
            },
          })
        )
      );

      for (const record of input.table.records) {
        const createdRecord = await ctx.db.record.create({
          data: {
            order: record.order,
            tableId: table.id,
          },
        });
  
        await Promise.all(
          record.cells.map((cell) => {
            const field = createdFields[cell.fieldOrder];
            return ctx.db.cell.create({
              data: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: cell.value,
                recordId: createdRecord.id,
                fieldId: field!.id,
              },
            });
          })
        );
      }

      await ctx.db.base.update({
        where: { id: base.id },
        data: { lastSelectedTableId: table.id },
      });

      return ctx.db.base.findUniqueOrThrow({
        where: { id: base.id },
        include: {
          tables: true,
          createdBy: true,
          sharedUsers: true,
          pendingUsers:true,
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
          createdBy:    true,
          sharedUsers:  true,
          pendingUsers: true,
          tables: true,
        },
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
        include: {
          createdBy:    true,
          sharedUsers:  true,
          pendingUsers: true,
          tables: true,
        },
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
        include: {
          createdBy:    true,
          sharedUsers:  true,
          pendingUsers: true,
          tables: true,
        },
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
        include: {
          createdBy:    true,
          sharedUsers:  true,
          pendingUsers: true,
          tables: true,
        },
      });
    }),
  
  // Get a base by id
  getBaseById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.base.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          createdBy:    true,
          sharedUsers:  true,
          pendingUsers: true,
          tables: true,
        },
      });
    }),

});
