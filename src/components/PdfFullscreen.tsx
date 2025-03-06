import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";

interface PdfFullscreenProps {
  fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          variant="ghost"
          className="h-auto px-1.5 py-1 sm:h-10 sm:px-4 sm:py-2"
          aria-label="fullscreen"
        >
          <Expand className="size-2 sm:size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full min-w-0">
        <DialogTitle className="hidden">PDF Viewer</DialogTitle>
        <SimpleBar
          autoHide={false}
          className="max-h-[calc(100vh-10rem)] mt-6 min-w-0"
        >
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast.error("Error loading PDF, Please try again later", {
                  style: { backgroundColor: "#DC3545", color: "white" }, // Red for success
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileUrl}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
