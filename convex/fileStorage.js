import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const AddFileEntry = mutation( {
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string()
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      createdBy: args.createdBy
    })
    return 'File added successfully'
  },
})


export const getFileUrl = mutation({
  args:{
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  }
})


export const getFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('pdfFiles').filter((q) => q.eq(q.field('fileId'), args.fileId)).collect();
    return result[0];
  }
})


export const getUserFiles = query({
  args:{
    userEmail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args?.userEmail) {
      return
    }
    const result = await ctx.db.query('pdfFiles')
    .filter((q) => q.eq(q.field('createdBy'), args.userEmail))
    .collect()

    return result
  }
})