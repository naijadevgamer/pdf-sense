"use client";

import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import { Ghost, Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import { Button } from "./ui/button";
import UploadButton from "./UploadButton";

import { getUserSubscriptionPlan } from "@/lib/stripe";

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
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

  return (
    <main className="md:py-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        {files && files?.length > 0 ? (
          <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
        ) : null}
      </div>

      {/* display all user files */}
      {filesError ? (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="size-10 text-destructive-foreground" />
          <h3 className="font-semibold text-xl text-red-600">
            Failed to load files
          </h3>
          <p>
            {filesError.message ||
              "Please check your connection and try again."}
          </p>
          <Button
            onClick={() => utils.getUserFiles.invalidate()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a: { createdAt: string }, b: { createdAt: string }) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => {
                      deleteFile({ id: file.id });
                    }}
                    size="sm"
                    className="w-full"
                    variant="destructive"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs">
                      {currentlyDeletingFile === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </div>
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <Ghost className="size-10 text-destructive-foreground" />
          <h3 className="font-semibold text-xl">
            Looks like you don’t have any files yet
          </h3>
          <p>
            Start by uploading your first PDF to get started. Just click the
            button below!
          </p>
          <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
