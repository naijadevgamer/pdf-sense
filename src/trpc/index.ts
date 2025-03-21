import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser(); // Properly await the Promise

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() })) // Accepts fileId as input
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { key } = input;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const file = await db.file.findFirst({
        where: {
          key: key,
          userId, // Ensures the file belongs to the authenticated user
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() })) // Accepts fileId as input
    .query(async ({ ctx, input }) => {
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
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
