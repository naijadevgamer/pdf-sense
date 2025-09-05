// app/api/subscription/route.ts
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan();

    return NextResponse.json(subscriptionPlan);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
