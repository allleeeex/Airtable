// server/routers/table.router.ts
import { record, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  createTable: protectedProcedure
    .input(z.object({
      baseId: z.string(),
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
      const table = await ctx.db.table.create({
        data: {
          name: input.table.name,
          baseId: input.baseId,
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
        where: { id: input.baseId },
        data: { lastSelectedTableId: table.id },
      });

      return ctx.db.table.findUniqueOrThrow({
        where: { id: table.id },
        include: {
          fields: true,
          records: { take: 5, include: { cells: true } },
        }
      })
    }),

  getTableById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          fields: {
            orderBy: { order: "asc" },
          }
        }
      })
    }),

  getRecordsForTable: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      cursor: z.string().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ ctx, input }) => {
      const { tableId, cursor, limit } = input;
  
      const records = await ctx.db.record.findMany({
        where: {
          tableId,
          ...(cursor && { order: { gt: cursor } }),
        },
        orderBy: { order: "asc" },
        take: limit + 1,
        include: {
          cells: true,
        },
      });
  
      const hasNextPage = records.length > limit;
      const sliced = records.slice(0, limit);
  
      return {
        rows: sliced,
        nextCursor: hasNextPage ? sliced.at(-1)?.order : undefined,
      };
    }),
});
