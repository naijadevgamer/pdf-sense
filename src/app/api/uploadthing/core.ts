import { db } from "@/db";
// import { getHuggingFaceEmbeddings } from "@/lib/huggingface";
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
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
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
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId);

      // console.log("file url", file.url);

      // const isFileExist = await db.file.findFirst({
      //   where: {
      //     key: file.key,
      //   },
      // });

      // if (isFileExist) return;

      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          // url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          url: `https://9syn0q6snr.ufs.sh/f/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        console.log("Starting file processing...");
        console.log(
          "Fetching file from URL:",
          `https://9syn0q6snr.ufs.sh/f/${file.key}`
        );

        const response = await fetch(`https://9syn0q6snr.ufs.sh/f/${file.key}`);
        console.log("File fetched successfully.");

        const blob = await response.blob();
        console.log("File converted to blob.");

        const loader = new PDFLoader(blob, {});
        console.log("PDFLoader initialized.");

        const pageLevelDocs = await loader.load();
        console.log(`PDF loaded. Total pages: ${pageLevelDocs.length}`);

        const pinecone = await getPineconeClient();
        console.log("Connected to Pinecone client.");

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
        console.log("Pinecone index initialized.");

        // Initialize Hugging Face embeddings
        const embeddings = new HuggingFaceInferenceEmbeddings({
          model: "sentence-transformers/all-MiniLM-L6-v2",
          apiKey: process.env.HUGGINGFACE_API_KEY!, // Use your Hugging Face API key
        });

        console.log("Embeddings generated");

        // Store all documents at once
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        console.log("Documents stored in Pinecone.");

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
        console.error("Error occurred during file processing:", err);

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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
