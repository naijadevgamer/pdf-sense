"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading, error } = trpc.authCallback.useQuery(undefined, {
    queryKey: ["authCallback", undefined],
    retry: true,
    retryDelay: 500,
  });

  // Handle success and error cases in `useEffect`
  useEffect(() => {
    if (data?.success) {
      // User is synced to DB, redirect
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, router, origin]);

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    }
  }, [error, router]);

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
