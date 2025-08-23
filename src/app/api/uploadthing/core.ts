import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { getUser } = getKindeServerSession();
      const user = await getUser(); // Properly await the user data

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const isFileExist = await db.file.findFirst({
          where: {
            key: file.key,
          },
        });

        if (isFileExist) {
          console.log("File already exists");
          return { success: true, message: "File already exists" }; // Add return
        }

        const createdFile = await db.file.create({
          data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://9syn0q6snr.ufs.sh/f/${file.key}`,
            uploadStatus: "PROCESSING",
          },
        });

        // Process the file asynchronously without blocking the response
        processFileAsync(createdFile, file.key).catch(console.error);

        // Return the expected response format
        return {
          success: true,
          file: {
            key: file.key,
            name: file.name,
            url: `https://9syn0q6snr.ufs.sh/f/${file.key}`,
          },
        };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        // Return error response
        return {
          success: false,
          error: "Failed to process upload",
        };
      }
    }),
} satisfies FileRouter;

// Separate function for async processing
async function processFileAsync(createdFile: any, fileKey: string) {
  try {
    console.log("Starting file processing for:", fileKey);

    // Fetch file
    const response = await fetch(`https://9syn0q6snr.ufs.sh/f/${fileKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }
    console.log("File fetched successfully.");

    const blob = await response.blob();
    console.log("blob created from response.", blob);
    console.log("File converted to blob.");

    // Process PDF
    const loader = new PDFLoader(blob);
    console.log("loader", loader);

    console.log("PDFLoader initialized.");

    const pageLevelDocs = await loader.load();
    console.log(`PDF loaded. Total pages: ${pageLevelDocs.length}`);

    // Initialize Pinecone
    const pinecone = await getPineconeClient();
    console.log("Connected to Pinecone client.");

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    console.log("Pinecone index initialized.");

    // Initialize embeddings
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY!,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    console.log("Embeddings initialized.");
    console.log("Embeddings initialized.");
    console.log("Embeddings initialized.", embeddings);

    // Add this to your processFileAsync function after embeddings initialization
    const sampleEmbedding = await embeddings.embedQuery("test");
    console.log("Embedding dimension:", sampleEmbedding.length);

    // You can also check if your Pinecone index has the right dimension
    const indexStats = await pineconeIndex.describeIndexStats();
    console.log("Index stats:", indexStats);

    // Store documents in Pinecone
    console.log("Storing documents in Pinecone...");
    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });
    console.log("Documents stored in Pinecone successfully.");

    // Update database
    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      },
    });
    console.log("File processing completed successfully.");
  } catch (err) {
    console.error("Error in async processing:", err);
    throw err;

    // Update database with error
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
    console.log("File processing marked as FAILED.");
  }
}

export type OurFileRouter = typeof ourFileRouter;
