import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "PDFSense - AI-powered PDF Assistant",
  description = "Upload PDFs and ask anything—AI-powered insights at your fingertips.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
  keywords = [
    "PDFSense",
    "PDF chat",
    "AI document analysis",
    "SaaS PDF tool",
    "chat with PDF",
    "AI PDF assistant",
    "document Q&A",
    "PDF reader AI",
    "AI for students",
    "open-source SaaS",
    "study productivity",
    "AI PDF reader",
    "AI-powered insights",
    "Upload and search PDFs",
  ],
  canonicalUrl = "https://pdf-sense.vercel.app",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  keywords?: string[];
  canonicalUrl?: string;
} = {}): Metadata {
  return {
    title,
    description,
    keywords,
    metadataBase: new URL("https://pdf-sense.vercel.app"),

    authors: [
      {
        name: "Abdullah Saleeman (naijadevgamer)",
        url: "https://github.com/naijadevgamer",
      },
    ],

    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "PDFSense",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@naijadevgamer",
    },

    icons,
    alternates: {
      canonical: canonicalUrl,
    },
    themeColor: "#FFF",

    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),

    // Extra: JSON-LD structured data for better search engine rich results
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "PDFSense",
        description,
        operatingSystem: "Web",
        applicationCategory: "Productivity",
        url: canonicalUrl,
        image,
      }),
    },
  };
}
