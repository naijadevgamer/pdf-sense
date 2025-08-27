import Dashboard from "@/components/Dashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Properly await the user data

  if (!user || !user.id) {
    redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <MaxWidthWrapper>
      <Dashboard subscriptionPlan={subscriptionPlan} />
    </MaxWidthWrapper>
  );
};

export default Page;
