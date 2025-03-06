import { handler } from "tailwindcss-animate";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.string(),
    createdBy: v.string(),
  },

  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    if (record?.length == 0) {
      await ctx.db.insert("notes", {
        fileId: args.fileId,
        notes: args.notes,
        createdBy: args.createdBy,
      });
    } else {
      await ctx.db.patch(record[0]._id, {
        notes: args.notes,
      });
    }
  },
});

export const GetNotes = query({
  args: {
    fileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args?.fileId) {
      return;
    }
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    return result[0].notes;
  },
});

