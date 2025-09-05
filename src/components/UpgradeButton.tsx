"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";

const UpgradeButton = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });

  return (
    <Button
      className="relative overflow-hidden group w-full"
      onClick={() => createStripeSession()}
    >
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </Button>
  );
};

export default UpgradeButton;
