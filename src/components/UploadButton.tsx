// components/UploadButton.tsx
"use client";

import { trpc } from "@/app/_trpc/client";
import { useUploadThing } from "@/lib/uploadthing";
import { motion } from "framer-motion";
import {
  AlertCircle,
  File,
  Loader2,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Progress } from "./ui/progress";

type UploadDropzoneProps = {
  isSubscribed: boolean;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadError: boolean;
  setUploadError: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  startPolling: (params: { key: string }) => void;
};

const UploadDropzone = ({
  isSubscribed,
  isUploading,
  setIsUploading,
  uploadError = false,
  setUploadError,
  isLoading,
  startPolling,
}: UploadDropzoneProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader"
  );

  const startSimulatedProgress = (timeout: number) => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        if (prevProgress > 80) {
          return prevProgress + 0.03;
        }
        if (prevProgress > 60) {
          return prevProgress + 0.2;
        }
        if (prevProgress > 40) {
          return prevProgress + 0.05;
        }
        if (prevProgress > 20) {
          return prevProgress + 0.08;
        }

        return prevProgress + 0.05;
      });
    }, timeout);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      disabled={isUploading || isLoading}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const timeout = +(
          (acceptedFile[0].size / 1024 / 1024) * 4 +
          30
        ).toFixed(2);
        console.log("Simulated timeout (ms):", timeout);
        const progressInterval = startSimulatedProgress(timeout);

        try {
          const res = await startUpload(acceptedFile);

          console.log("Upload response:", res);

          if (!res || res.length === 0) {
            throw new Error("No response from upload");
          }

          const [fileResponse] = res;

          if (!fileResponse || !fileResponse.key) {
            throw new Error("Invalid upload response");
          }

          clearInterval(progressInterval);
          setUploadProgress(100);

          startPolling({ key: fileResponse.key });
        } catch (error) {
          console.error("Upload error:", error);
          clearInterval(progressInterval);
          setIsUploading(false);
          setUploadProgress(0);
          setUploadError(true);

          toast.error("Upload Failed", {
            description:
              error instanceof Error ? error.message : "Something went wrong!",
          });
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300  rounded-2xl bg-white/80 backdrop-blur-sm transition-all hover:border-blue-400 hover:shadow-lg w-full"
        >
          <div className="flex items-center justify-center p-3 md:p-8">
            <div className="flex flex-col items-center justify-center w-full cursor-pointer">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative mb-0 sm:mb-2"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20" />

                {uploadError ? (
                  <div className="relative p-3 sm:p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg md:rounded-2xl">
                    <AlertCircle className="size-4 sm:size-6 md:size-8 text-white" />
                  </div>
                ) : (
                  <div className="relative p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg md:rounded-2xl">
                    <UploadCloud className="size-4 sm:size-6 md:size-8 text-white" />
                  </div>
                )}
              </motion.div>

              <div className="text-center mb-0 sm:mb-2">
                {uploadError ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Upload failed
                    </p>
                    <p className="text-sm text-gray-600">Please try again</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your PDF here
                    </p>
                    <p className="text-sm text-gray-600">
                      or click to browse files
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum file size: {isSubscribed ? "16MB" : "4MB"}
                    </p>
                  </>
                )}
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-52 sm:w-fit sm:max-w-xs px-2 flex items-center rounded-xl shadow-md border border-gray-200 overflow-hidden mb-0 sm:mb-2"
                >
                  <div className="p-2 bg-blue-50">
                    <File className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="px-4 py-3 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {acceptedFiles[0].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              ) : null}

              {(isUploading || isLoading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-md space-y-2 sm:space-y-4"
                >
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {isLoading || uploadProgress === 100
                        ? "Finalizing..."
                        : "Uploading..."}
                    </span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress
                    value={uploadProgress}
                    className="h-2 bg-gray-200"
                    indicatorColor={
                      uploadProgress === 100
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
                    }
                  />

                  {isUploading &&
                    uploadProgress > 50 &&
                    uploadProgress < 100 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-gray-500 text-center"
                      >
                        This might take a moment. Please be patient.
                      </motion.div>
                    )}

                  {/* {isLoading && uploadProgress > 50 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-gray-500 text-center"
                    >
                      This might take a moment. Please be patient.
                    </motion.div>
                  )} */}

                  {/* {isLoading || uploadProgress === 100 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2 text-xs text-gray-600"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing your document...
                      </motion.div>
                    ) : null} */}
                </motion.div>
              )}

              <input {...getInputProps()} className="hidden" />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<boolean>(false);

  const { mutate: startPolling, isLoading } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    onError: (error) => {
      console.error("Error fetching file:", error);
      setIsUploading(false);
      // setIsOpen(false);

      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Unauthorized", {
          description: "You need to be logged in to access this file.",
        });
      } else if (error.data?.code === "NOT_FOUND") {
        toast.error("File Not Found", {
          description: "The file may have been deleted or moved.",
        });
      } else {
        toast.error("Upload Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    },
    retry: (failureCount, error) => {
      if (
        error.data?.code === "UNAUTHORIZED" ||
        error.data?.code === "NOT_FOUND"
      ) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attempt) => attempt * 500,
  });

  const handleOpenChange = (open: boolean) => {
    if (isUploading || isLoading) {
      toast.info("Upload in progress", {
        description: "Please wait until the upload completes before closing.",
      });
      return;
    }

    if (open) {
      // Reset states when opening
      setUploadError(false);
      // setUploadProgress(0);
    }

    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disabled={isUploading || isLoading}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isUploading || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              {isLoading
                ? "Processing..."
                : isUploading
                ? "Uploading..."
                : "Upload PDF"}
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-xs sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between md:mb-2"
        >
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Upload Document
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Add a PDF to start chatting with AI
            </DialogDescription>
          </div>
        </motion.div>

        <UploadDropzone
          isSubscribed={isSubscribed}
          isLoading={isLoading}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          startPolling={startPolling}
          uploadError={uploadError}
          setUploadError={setUploadError}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between text-[10px] text-gray-500 md:mt-2"
        >
          <div className="flex items-center gap-1">
            <Zap className="size-2 sm:size-3 text-yellow-500" />
            <span>AI-powered document analysis</span>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles className="size-2 sm:size-3 text-purple-500" />
            <span>Instant insights</span>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
