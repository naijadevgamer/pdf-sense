// components/Dashboard.tsx
"use client";

import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import { motion, Variants } from "framer-motion";
import {
  Brain,
  FileText,
  FolderOpen,
  Ghost,
  Loader2,
  MessageSquare,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import { Button } from "./ui/button";
import UploadButton from "./UploadButton";
import { SubscriptionPlan } from "./MobileNav";

interface PageProps {
  subscriptionPlan: SubscriptionPlan;
}

const Dashboard = ({ subscriptionPlan }: PageProps) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useUtils();

  const {
    data: files,
    isLoading,
    error: filesError,
  } = trpc.getUserFiles.useQuery(undefined, {
    onError: (error) => {
      toast.error("Failed to load files", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
      toast.success("File deleted successfully!", {
        description: "The selected file has been removed from your account.",
      });
    },
    onError: (error) => {
      switch (error.data?.code) {
        case "UNAUTHORIZED":
          toast.error("Unauthorized Action", {
            description: "You do not have permission to delete this file.",
          });
          break;
        case "NOT_FOUND":
          toast.error("File Not Found", {
            description:
              "The file may have already been deleted or does not exist.",
          });
          break;
        case "FORBIDDEN":
          toast.error("Access Denied", {
            description: "You are not allowed to delete this file.",
          });
          break;
        default:
          toast.error("Failed to Delete File", {
            description:
              "There was an issue deleting the file. Please try again.",
          });
      }
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex flex-col items-start justify-between gap-6 pb-8 border-b border-gray-200">
          <div className="flex items-start md:items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
            >
              <FolderOpen className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                My Documents
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and interact with your uploaded PDF files
              </p>
            </div>
          </div>

          {files && files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UploadButton isSubscribed={subscriptionPlan?.isSubscribed} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Files Grid */}
      <div className="my-12">
        {filesError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100 "
          >
            <Ghost className="size-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load files
            </h3>
            <p className="text-gray-600 mb-4">
              {"Please check your connection and try again."}
            </p>
            <Button
              onClick={() => utils.getUserFiles.invalidate()}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Retry
            </Button>
          </motion.div>
        ) : files && files.length !== 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {files
              .sort(
                (a: { createdAt: string }, b: { createdAt: string }) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((file) => (
                <motion.div
                  key={file.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <Link
                    href={`/dashboard/${file.id}`}
                    className="flex flex-col gap-4 p-4 sm:p-6 relative z-10"
                  >
                    <div className="flex items-center justify-between">
                      <motion.div
                        className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center shadow-md"
                        whileHover={{ rotate: 5 }}
                      >
                        <FileText className="h-6 w-6 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Sparkles className="h-5 w-5 text-purple-500" />
                      </motion.div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                        {file.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Uploaded{" "}
                        {format(new Date(file.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </Link>

                  <div className="px-4 sm:px-6 pb-4 grid grid-cols-2 gap-4 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>Ready</span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteFile({ id: file.id });
                        }}
                        size="sm"
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        disabled={currentlyDeletingFile === file.id}
                      >
                        {currentlyDeletingFile === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <Skeleton height={80} className="mb-4 rounded-xl" />
                <Skeleton height={20} className="mb-2" />
                <Skeleton height={16} width="60%" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-100"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
            >
              <Ghost className="h-12 w-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Your digital library awaits
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload your first PDF to unlock the power of AI-driven document
              conversations and insights.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UploadButton isSubscribed={subscriptionPlan?.isSubscribed} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Stats Section */}
      {files && files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {files.length}
                </p>
                <p className="text-gray-600">Total Files</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptionPlan?.isSubscribed ? "Pro" : "Free"}
                </p>
                <p className="text-gray-600">Plan</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">∞</p>
                <p className="text-gray-600">AI Conversations</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default Dashboard;
