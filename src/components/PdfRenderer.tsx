"use client";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import PdfFullscreen from "./PdfFullscreen";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow overflow-hidden flex flex-col items-center">
      {/* PDF Control bar top */}
      <div className="min-h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5 ">
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currPage - 1));
            }}
            variant="ghost"
            className="h-auto px-1 py-0.5 sm:h-10 sm:px-4 sm:py-2"
            aria-label="previous page"
          >
            <ChevronUp className="size-2 sm:size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "size-6 sm:size-8 text-center p-0 rounded-sm ",
                errors.page
                  ? "focus-visible:ring-red-500"
                  : "focus-visible:ring-primary"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue("page", String(currPage + 1));
            }}
            className="h-auto px-1 py-0.5 sm:h-10 sm:px-4 sm:py-2"
            variant="ghost"
            aria-label="next page"
          >
            <ChevronDown className="size-2 sm:size-4" />
          </Button>
        </div>

        <div className="space-x-2 flex flex-wrap justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "gap-1 sm:gap-1.5 h-auto px-1.5 py-1 sm:h-10 sm:px-4 sm:py-2 sm:bg-transparent bg-zinc-200 rounded-sm"
                )}
                aria-label="zoom"
                variant="ghost"
              >
                <Search className="size-2 sm:size-4" />
                {scale * 100}%
                <ChevronDown className="size-2 sm:size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center">
            <Button
              onClick={() => setRotation((prev) => prev + 90)}
              variant="ghost"
              aria-label="rotate 90 degrees"
              className="h-auto px-1.5 py-1 sm:h-10 sm:px-4 sm:py-2"
            >
              <RotateCw className="size-2 sm:size-4" />
            </Button>

            <PdfFullscreen fileUrl={url} />
          </div>
        </div>
      </div>

      {/* PDF Main */}
      <div className="flex-1 w-full max-h-screen min-w-0">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-8rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast.error("Error loading PDF. Please try again later", {
                  style: { backgroundColor: "#DC3545", color: "white" }, // Medium red for error
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-h-full"
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
