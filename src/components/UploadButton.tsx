"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import Dropzone from "react-dropzone";
import { File, Loader2, UploadCloud } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

type UploadDropzoneProps = {
  isSubscribed: boolean;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  startPolling: (params: { key: string }) => void;
};

const UploadDropzone = ({
  isSubscribed,
  isUploading,
  setIsUploading,
  isLoading,
  startPolling,
}: UploadDropzoneProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing("fileUploader");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 0.5;
      });
    }, 50);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      disabled={isUploading || isLoading} // 🔥 Disable dropzone while loading
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // handle file uploading
        const res = await startUpload(acceptedFile);

        if (!res) {
          toast.error("Upload Failed", {
            description: "Something went wrong! Please try again later.",
          });
          setIsUploading(false);
          return;
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;
        if (!key) {
          toast.error("Upload Failed", {
            description: "Something went wrong! Please try again later.",
          });
          return;
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        console.log("Progress set to 100");

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <div
              // htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {/* {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null} */}
                  {isLoading || uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Retrieving file...
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { mutate: startPolling, isLoading } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
      toast.success("File Retrieved", {
        description: "The file was successfully fetched!",
      });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Unauthorized", {
          description: "You need to be logged in to access this file.",
        });
      } else if (error.data?.code === "NOT_FOUND") {
        toast.error("File Not Found", {
          description: "The file may have been deleted or moved.",
        });
      } else {
        toast.error("Unexpected Error", {
          description: "Something went wrong. Please try again later.",
        });
      }
    },
    retry: (failureCount, error) => {
      // Retry only for network errors, NOT for permission or missing file errors
      if (
        error.data?.code === "UNAUTHORIZED" ||
        error.data?.code === "NOT_FOUND"
      ) {
        return false;
      }
      return failureCount < 3; // Retry up to 3 times
    },
    retryDelay: (attempt) => attempt * 500, // Exponential backoff: 500ms, 1000ms, 1500ms
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        disabled={isUploading || isLoading}
        asChild
      >
        <Button disabled={isUploading || isLoading}>
          {(isUploading || isLoading) && (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          )}
          {isLoading
            ? "Fetching..."
            : isUploading
            ? "Uploading..."
            : "Upload PDF"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Upload PDF</DialogTitle>
        <UploadDropzone
          isSubscribed
          isLoading={isLoading}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          startPolling={startPolling}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
