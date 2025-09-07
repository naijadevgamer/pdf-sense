import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { utapi } from "@/lib/uploadthing";
import { utapi } from "./uploadthing";
import { getPineconeClient } from "@/lib/pinecone";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    try {
      const { getUser } = getKindeServerSession();
      const user = await getUser(); // Properly await the Promise

      if (!user || !user.id || !user.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User authentication failed. Please sign in again.",
        });
      }

      // ✅ Check if user exists in your database
      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        console.log("DB user not found, creating new user...");

        // ✅ Create the user in the database if not found
        await db.user.create({
          data: {
            id: user.id,
            email: user.email,
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error in authCallback:", error);

      if (error instanceof TRPCError) {
        // If it's already a TRPCError, just rethrow it
        throw error;
      }

      // If it's a database error, handle it properly
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database error: ${error.message}`,
        });
      }

      // Catch-all for any other unexpected errors
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong during authentication.",
      });
    }
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    try {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const files = await db.file.findMany({
        where: { userId },
      });

      if (!files) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Files not found.",
        });
      }

      return files;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error; // If it's a known tRPC error, rethrow it
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database error: ${error.message}`,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user files. Please try again later.",
      });
    }
  }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() })) // Accepts fileId as input
    .mutation(async ({ ctx, input }) => {
      try {
        const { userId } = ctx;
        const { key } = input;

        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated.",
          });
        }

        const file = await db.file.findFirst({
          where: {
            key,
            userId, // Ensures the file belongs to the authenticated user
          },
        });

        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found.",
          });
        }

        return file;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // If it's a known tRPC error, rethrow it
        }
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database error: ${error.message}`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching the file.",
        });
      }
    }),

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/dashboard/billing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { userId } = ctx;
        const { fileId, cursor } = input;
        const limit = input.limit ?? INFINITE_QUERY_LIMIT;

        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated.",
          });
        }

        const file = await db.file.findFirst({
          where: {
            id: fileId,
            userId,
          },
        });

        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found.",
          });
        }

        const messages = await db.message.findMany({
          take: limit + 1,
          where: {
            fileId,
          },
          orderBy: {
            createdAt: "desc",
          },
          cursor: cursor ? { id: cursor } : undefined,
          select: {
            id: true,
            isUserMessage: true,
            createdAt: true,
            text: true,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (messages.length > limit) {
          const nextItem = messages.pop();
          nextCursor = nextItem?.id;
        }

        return {
          messages,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // If it's a known tRPC error, rethrow it
        }
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database error: ${error.message}`,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() })) // Accepts fileId as input
    .query(async ({ ctx, input }) => {
      try {
        const { userId } = ctx;
        const { fileId } = input;

        if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

        const file = await db.file.findFirst({
          where: {
            id: fileId,
            userId, // Ensures the file belongs to the authenticated user
          },
        });

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        return {
          status: file.uploadStatus,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error; // If it's a known tRPC error, rethrow it
        }
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database error: ${error.message}`,
          });
        }
        // Handle unexpected errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const file = await db.file.findFirst({
        where: {
          id,
          userId, // Ensures the file belongs to the authenticated user
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      try {
        // Execute all deletion operations in parallel
        const [pineconeResult, uploadThingResult] = await Promise.allSettled([
          // Delete from Pinecone
          (async () => {
            const pinecone = await getPineconeClient();
            const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
            await pineconeIndex.namespace(id).deleteAll();
          })(),

          // Delete from UploadThing
          (async () => {
            if (file.key) {
              await utapi.deleteFiles(file.key);
            }
          })(),
        ]);

        // Check if any deletion failed
        const failures = [
          pineconeResult.status === "rejected" && pineconeResult.reason,
          uploadThingResult.status === "rejected" && uploadThingResult.reason,
        ].filter(Boolean);

        if (failures.length > 0) {
          console.error("Partial deletion failures:", failures);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to completely delete file: ${failures.join(", ")}`,
          });
        }

        // Finally delete from database
        await db.file.delete({
          where: { id },
        });

        return file;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while deleting the file.",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
