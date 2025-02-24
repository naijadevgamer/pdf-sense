"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    queryKey: ["authCallback", undefined],
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    console.log("Auth callback data:", data);
    console.log("Auth callback error:", error);
  }, [data, error]);

  // Handle success and error cases in `useEffect`
  useEffect(() => {
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    } else if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    } else if (error) {
      console.error("Auth callback error:", error);
      router.push("/error-page"); // Redirect to an error page instead of looping
    }
  }, [data, error, router, origin]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
