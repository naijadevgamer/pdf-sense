// lib/pinecone.ts
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

let pineconeInstance: PineconeClient | null = null;

export const getPineconeClient = async () => {
  if (pineconeInstance) {
    return pineconeInstance;
  }

  try {
    console.log("Initializing Pinecone client...");

    pineconeInstance = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    return pineconeInstance;
  } catch (error) {
    console.error("Failed to initialize Pinecone client:", error);
    throw error;
  }
};
