// components/BillingForm.tsx
"use client";

import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Loader2,
  Crown,
  Calendar,
  Zap,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BillingFormProps {
  subscriptionPlan: any;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          toast.error("There was a problem...", {
            description: "Please try again in a moment.",
          });
        }
      },
    });

  const features = [
    "15 pages per PDF",
    "16MB file size limit",
    "Priority processing",
    "Advanced AI insights",
    "Premium support",
    "Early access to new features",
  ];

  return (
    <MaxWidthWrapper className="max-w-4xl py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Subscription Management
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your subscription and unlock the full potential of AI-powered
          document analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Current Plan
              </CardTitle>
              <CardDescription className="text-gray-600">
                {subscriptionPlan.isSubscribed ? "Pro Plan" : "Free Plan"}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {subscriptionPlan.isSubscribed ? "£14.99" : "£0"}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              {subscriptionPlan.isSubscribed && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {subscriptionPlan.isCanceled ? "Expires on " : "Renews on "}
                    {format(
                      subscriptionPlan.stripeCurrentPeriodEnd!,
                      "MMMM dd, yyyy"
                    )}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {features
                  .slice(0, subscriptionPlan.isSubscribed ? 6 : 3)
                  .map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Manage Subscription
              </CardTitle>
              <CardDescription className="text-gray-600">
                {subscriptionPlan.isSubscribed
                  ? "Update your payment method or cancel"
                  : "Upgrade to unlock premium features"}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                {subscriptionPlan.isSubscribed ? (
                  <>
                    <p className="text-gray-600">
                      Manage your subscription details, update payment
                      information, or cancel your plan.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Sparkles className="h-4 w-4" />
                      <span>Active Pro subscriber</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">
                      Upgrade to Pro and get access to advanced features, higher
                      limits, and priority support.
                    </p>
                    <div className="space-y-3 text-left">
                      {features.slice(3).map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 text-sm text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createStripeSession();
                }}
                className="w-full"
              >
                <Button
                  type="submit"
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {subscriptionPlan.isSubscribed
                    ? "Manage Subscription"
                    : "Upgrade to Pro"}
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {subscriptionPlan.isSubscribed && subscriptionPlan.isCanceled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center bg-yellow-50 border border-yellow-200 rounded-2xl p-4"
        >
          <p className="text-sm text-yellow-800">
            ⚠️ Your subscription is scheduled for cancellation. You'll have
            access until{" "}
            {format(subscriptionPlan.stripeCurrentPeriodEnd!, "MMMM dd, yyyy")}.
          </p>
        </motion.div>
      )}
    </MaxWidthWrapper>
  );
};

export default BillingForm;
