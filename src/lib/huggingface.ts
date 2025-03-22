import { HfInference } from "@huggingface/inference";

if (!process.env.HUGGINGFACE_API_KEY) {
  throw new Error("Missing HUGGINGFACE_API_KEY in environment variables");
}

export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
