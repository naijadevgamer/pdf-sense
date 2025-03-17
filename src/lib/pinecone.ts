import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

export const getPineconeClient = async () => {
  const pinecone = new PineconeClient(); // No need to pass config manually
  return pinecone;
};
