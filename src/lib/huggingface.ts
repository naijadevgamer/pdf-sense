import { HfInference } from "@huggingface/inference";

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("Missing HUGGINGFACE_API_KEY in environment variables");
}

export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function getHuggingFaceEmbeddings(text: string) {
  try {
    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    if (!Array.isArray(response)) {
      throw new Error("Unexpected response format from Hugging Face API");
    }

    return Array.isArray(response[0])
      ? (response.flat() as number[])
      : (response as number[]);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
}
