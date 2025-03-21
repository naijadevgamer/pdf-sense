import { db } from "@/db";
import { getHuggingFaceEmbeddings } from "@/lib/huggingface";
import { getPineconeClient } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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
        const response = await fetch(`https://9syn0q6snr.ufs.sh/f/${file.key}`);

        const blob = await response.blob();

        const loader = new PDFLoader(blob, {});

        const pageLevelDocs = await loader.load();

        // const pagesAmt = pageLevelDocs.length;
        // const pageNum = pageLevelDocs[0].metadata.loc.pageNumber;

        // vectorize and index entire document
        const pinecone = await getPineconeClient();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

        for (const doc of pageLevelDocs) {
          const text = doc.pageContent; // Extract text from PDF page
          const embedding = await getHuggingFaceEmbeddings(text); // Get embeddings

          await pineconeIndex.upsert([
            {
              id: `${createdFile.id}-${doc.metadata.loc.pageNumber}`, // Unique ID per page
              values: embedding, // Store the embedding vector
            },
          ]);
        }

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (err) {
        console.error(err);
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }

      //   // return { success: true };
      //   // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
