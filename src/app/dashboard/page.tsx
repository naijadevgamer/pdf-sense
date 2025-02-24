import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Properly await the user data

  if (!user || !user.id) {
    console.log("DB user not found, redirecting...");
    redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) {
    console.log("DB user not found, redirecting...");
    redirect("/auth-callback?origin=dashboard");
  }

  return <Dashboard />;
};

export default Page;
