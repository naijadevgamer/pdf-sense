"use client";

import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircle, Brain, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import ChatInput from "./ChatInput";
import { ChatContextProvider } from "@/context/ChatContext";
import Messages from "./Messages";
import { toast } from "sonner";
import { PLANS } from "@/config/stripe";
import { motion } from "framer-motion";

interface ChatWrapperProps {
  fileId: string;
  isSubscribed: boolean;
}

const ChatWrapper = ({ fileId, isSubscribed }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          toast.error("Unauthorized Access", {
            description: "You are not authorized to access this file.",
          });
        } else if (err.data?.code === "NOT_FOUND") {
          toast.error("File Not Found", {
            description: "The file was not found.",
          });
        } else {
          toast.error("Unexpected Error", {
            description: "Something went wrong. Please try again later.",
          });
        }
      },
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center flex-1 justify-center items-center flex"
        >
          <div className="flex flex-col items-center ">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Preparing Your PDF
            </h3>
            <p className="text-gray-600">
              We're getting everything ready for you
            </p>
          </div>
        </motion.div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between">
        <div className="flex-1 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing PDF
            </h3>
            <p className="text-gray-600">This will just take a moment...</p>
          </motion.div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between">
        <div className="flex-1 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-2xl mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              File Too Large
            </h3>
            <p className="text-gray-600 mb-4">
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "Pro" : "Free"}
              </span>{" "}
              plan supports up to{" "}
              {isSubscribed
                ? PLANS.find((p) => p.name === "Pro")?.pagesPerPdf
                : PLANS.find((p) => p.name === "Free")?.pagesPerPdf}{" "}
              pages per PDF.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between overflow-hidden">
        <div className="flex-1 justify-between flex flex-col">
          <Messages fileId={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
