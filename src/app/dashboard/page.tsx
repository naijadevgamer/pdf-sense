// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FloatingBackground } from "@/components/FloatingBackground";

const Page = () => {
  const { user, isLoading: userLoading } = useKindeBrowserClient();
  const [subscriptionPlan, setSubscriptionPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && (!user || !user.id)) {
      redirect("/auth-callback?origin=dashboard");
    }

    if (user) {
      const fetchSubscription = async () => {
        try {
          const response = await fetch("/api/subscription");
          if (response.ok) {
            const data = await response.json();
            setSubscriptionPlan(data);
          }
        } catch (error) {
          console.error("Failed to fetch subscription:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSubscription();
    }
  }, [user, userLoading]);

  if (userLoading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <FloatingBackground />
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <MaxWidthWrapper className="pt-24 relative z-10">
            <Dashboard subscriptionPlan={subscriptionPlan} />
          </MaxWidthWrapper>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Page;
