// components/Pricing.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UpgradeButton from "@/components/UpgradeButton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Minus,
  Sparkles,
  Zap,
  Crown,
  Star,
  Rocket,
  BadgeCheck,
  InfinityIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

function PricingCard({
  plan,
  tagline,
  quota,
  features,
  isPro = false,
  user,
}: {
  plan: string;
  tagline: string;
  quota: number;
  features: any[];
  isPro?: boolean;
  user: any;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const price =
    PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl hover:-translate-y-2",
        {
          "border-transparent bg-gradient-to-br from-blue-50 to-purple-50":
            !isPro,
          "border-blue-200/50 bg-gradient-to-br from-blue-100/20 to-purple-100/20":
            isPro,
        }
      )}
    >
      {/* Pro Badge */}
      {isPro && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute -top-4 left-0 right-0 mx-auto w-48 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white text-center flex items-center justify-center space-x-2 shadow-lg"
        >
          <Crown className="h-4 w-4" />
          <span>Most Popular</span>
        </motion.div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              "inline-flex items-center justify-center p-4 rounded-2xl mb-4",
              isPro
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-gradient-to-r from-gray-600 to-gray-700"
            )}
          >
            {isPro ? (
              <Rocket className="h-8 w-8 text-white" />
            ) : (
              <Star className="h-8 w-8 text-white" />
            )}
          </motion.div>

          <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan}</h3>
          <p className="text-gray-600 text-lg">{tagline}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-5xl font-bold text-gray-900">£{price}</span>
            <span className="text-gray-600 text-lg">/month</span>
          </div>
          {price === 0 && (
            <p className="text-green-600 font-medium">Forever free</p>
          )}
        </div>

        {/* Quota */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {quota === 1000000 ? (
                <span className="flex items-center">
                  <InfinityIcon className="h-5 w-5 mr-1" />
                  Unlimited
                </span>
              ) : (
                `${quota.toLocaleString()} PDFs/mo`
              )}
            </span>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="w-60 p-2">
                Number of PDFs you can upload per month
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map(({ text, footnote, negative }, index) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm"
            >
              <div
                className={cn("flex-shrink-0 mt-0.5 p-1 rounded-full", {
                  "bg-green-100 text-green-600": !negative,
                  "bg-gray-100 text-gray-400": negative,
                })}
              >
                {negative ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <span
                  className={cn("text-gray-700 font-medium", {
                    "text-gray-400 line-through": negative,
                  })}
                >
                  {text}
                </span>
                {footnote && (
                  <Tooltip>
                    <TooltipTrigger className="cursor-default ml-1.5">
                      <HelpCircle className="h-3 w-3 text-gray-400 inline" />
                    </TooltipTrigger>
                    <TooltipContent className="w-60 p-2">
                      {footnote}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="border-t border-gray-200/50 pt-6"
        >
          {plan === "Free" ? (
            <Link
              href={user ? "/dashboard" : "/sign-in"}
              className={cn(
                buttonVariants({
                  className: "w-full py-6 text-lg font-semibold rounded-xl",
                  variant: "outline",
                }),
                "relative overflow-hidden group border-2 border-gray-300 hover:border-blue-300 transition-all duration-300"
              )}
            >
              <span className="relative z-10">
                {user ? "Continue with Free" : "Get Started Free"}
              </span>
              <ArrowRight className="h-5 w-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Link>
          ) : user ? (
            <UpgradeButton />
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({
                  className:
                    "w-full py-6 text-lg font-semibold rounded-xl relative overflow-hidden group",
                }),
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              )}
            >
              <span className="relative z-10">Upgrade to Pro</span>
              <Sparkles className="h-5 w-5 ml-2 relative z-10" />
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Glow effect for Pro card */}
      {isPro && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </motion.div>
  );
}

const Pricing = ({ user }: { user: any }) => {
  const pricingItems = [
    {
      plan: "Free",
      tagline: "Perfect for getting started",
      quota: 10,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Basic AI responses",
        },
        {
          text: "Standard support",
          negative: true,
        },
        {
          text: "Advanced analytics",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For power users and businesses",
      quota: PLANS.find((p) => p.slug === "pro")!.quota,
      features: [
        {
          text: "15 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Advanced AI responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
        {
          text: "Advanced analytics dashboard",
        },
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-100/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-100/20 to-transparent" />

          {/* Animated blobs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <MaxWidthWrapper className="py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you and start having
              conversations with your documents in minutes.
            </p>
          </motion.div>

          <TooltipProvider>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {pricingItems.map(({ plan, tagline, quota, features }, index) => (
                <PricingCard
                  key={plan}
                  plan={plan}
                  tagline={tagline}
                  quota={quota}
                  features={features}
                  isPro={index === 1}
                  user={user}
                />
              ))}
            </div>
          </TooltipProvider>

          {/* Enterprise Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl mb-4">
                <BadgeCheck className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Enterprise Grade
              </h2>
              <p className="text-gray-600 mb-6">
                Need custom solutions, dedicated support, or enterprise-level
                features? Our team can create a tailored plan for your
                organization.
              </p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/contact">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 mb-4">
              Have questions about our plans?
            </p>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              Contact our team
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default Pricing;
