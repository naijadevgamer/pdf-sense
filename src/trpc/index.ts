import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser(); // Properly await the Promise

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Check if user exists in the database (optional, but recommended)

    // if (!user?.id || !user?.email) {
    //   throw new TRPCError({ code: "UNAUTHORIZED" });
    // }

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
});

export type AppRouter = typeof appRouter;
