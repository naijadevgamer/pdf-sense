import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { $Enums } from "@prisma/client";
import { utapi } from "@/server/api/uploadthing";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // Use a transaction to ensure all operations succeed or fail together
  let createdFile: {
    id: string;
    name: string;
    userId: string | null;
    key: string;
    url: string;
    uploadStatus: $Enums.UploadStatus;
    createdAt: Date;
    updatedAt: Date;
  } | null = null;
  try {
    // Check if file already exists
    const existingFile = await db.file.findFirst({
      where: {
        key: file.key,
      },
    });

    if (existingFile) {
      console.log("File already exists");
      return { success: true, message: "File already exists" };
    }

    // Create file record in database
    createdFile = await db.file.create({
      data: {
        key: file.key,
        name: file.name,
        userId: metadata.userId,
        url: `https://9syn0q6snr.ufs.sh/f/${file.key}`,
        uploadStatus: "PROCESSING",
      },
    });

    // Fetch file for processing
    const response = await fetch(`https://9syn0q6snr.ufs.sh/f/${file.key}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();

    // Process PDF
    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();
    const pagesAmt = pageLevelDocs.length;

    // Check page limits based on subscription plan
    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const proPlan = PLANS.find((plan) => plan.name === "Pro");
    const freePlan = PLANS.find((plan) => plan.name === "Free");

    if (!proPlan || !freePlan) {
      throw new Error("Subscription plans not configured properly");
    }

    const isProExceeded = pagesAmt > proPlan.pagesPerPdf;
    const isFreeExceeded = pagesAmt > freePlan.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: { uploadStatus: "FAILED" },
        where: { id: createdFile.id },
      });
      throw new Error(`Page limit exceeded: ${pagesAmt} pages`);
    }

    // Initialize Pinecone
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

    // Validate environment variables
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY environment variable is not set");
    }

    if (!process.env.PINECONE_INDEX) {
      throw new Error("PINECONE_INDEX environment variable is not set");
    }

    // Initialize embeddings and store in Pinecone
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
      maxConcurrency: 5, // Add concurrency limit for better performance
    });

    // Update database with success status
    await db.file.update({
      data: { uploadStatus: "SUCCESS" },
      where: { id: createdFile.id },
    });

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

    // Clean up any partially created resources
    try {
      if (createdFile) {
        // Delete from database
        await db.file.delete({
          where: { id: createdFile.id },
        });

        // Delete from Pinecone if it was created
        try {
          const pinecone = await getPineconeClient();
          const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
          await pineconeIndex.namespace(createdFile.id).deleteAll();
        } catch (pineconeError) {
          console.error("Error cleaning up Pinecone:", pineconeError);
        }

        // Delete from UploadThing
        try {
          await utapi.deleteFiles(file.key);
        } catch (uploadError) {
          console.error("Error cleaning up uploaded file:", uploadError);
        }
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }

    throw new UploadThingError(
      error instanceof Error ? error.message : "Failed to process upload"
    );
  }
};

// FileRouter for your app
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
