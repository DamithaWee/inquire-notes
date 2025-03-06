import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

const apiKey = process.env.GOOGLE_API_KEY ?? ctx.env.GOOGLE_API_KEY;

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the API key from environmental variables
    
    if (!apiKey) {
      throw new Error(
        "GOOGLE_API_KEY environment variable is not set in Convex deployment"
      );
    }

    try {
      await ConvexVectorStore.fromTexts(
        args.splitText,
        { fileId: args.fileId },
        new GoogleGenerativeAIEmbeddings({
          apiKey,
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );
    } catch (error) {
      console.error("Error in ingest action:", error);
      throw new Error(`Failed to create embeddings: ${error.message}`);
    }
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
          apiKey,
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        })
      , { ctx });

    const resultOne = (await vectorStore.similaritySearch(args.query, 100))
    .filter(q => q.metadata.fileId == args.fileId);

    return JSON.stringify(resultOne)
  },
});