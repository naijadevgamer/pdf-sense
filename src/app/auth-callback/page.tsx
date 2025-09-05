// app/auth-callback/page.tsx
"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { trpc } from "../_trpc/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FloatingBackground } from "@/components/FloatingBackground";

const AuthCallbackInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      setTimeout(() => {
        router.push(origin ? `/${origin}` : "/dashboard");
      }, 1000);
    } else if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    } else if (error) {
      toast.error("Authentication failed. Please try again.", {
        description: error.message || "An unknown error occurred.",
      });
    }
  }, [data, error, router, origin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* <FloatingBackground /> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center backdrop-blur-sm z-10"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" },
          }}
          className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Preparing Your Experience
        </h3>
        <p className="text-gray-600 mb-6">
          We're setting up your personalized AI document assistant
        </p>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-500">Initializing...</span>
        </div>
      </motion.div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
};

export default Page;
