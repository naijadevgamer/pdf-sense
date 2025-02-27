import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Provider";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/sonner";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDFSense",
  description:
    "Upload PDFs and ask anything—AI-powered insights at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={cn("min-h-screen antialiased grainy", `${sora.className}`)}
        >
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}

// export const metadata: Metadata = {
//   title: "PDFSense",
//   description:
//     "Upload PDFs and ask anything—AI-powered insights at your fingertips.",
//   keywords: [
//     "AI PDF Reader",
//     "Chat with PDF",
//     "PDFSense",
//     "AI-powered insights",
//     "Upload and search PDFs",
//   ],
//   authors: [{ name: "Your Name", url: "https://yourwebsite.com" }], // Replace with actual details
//   openGraph: {
//     title: "PDFSense – AI-powered PDF Assistant",
//     description:
//       "Upload PDFs and ask anything. Get instant AI-driven insights.",
//     url: "https://pdfsense.com", // Replace with your actual URL
//     type: "website",
//     images: [
//       {
//         url: "https://yourwebsite.com/og-image.jpg", // Replace with your actual image URL
//         width: 1200,
//         height: 630,
//         alt: "PDFSense AI PDF Assistant",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "PDFSense – AI-powered PDF Assistant",
//     description:
//       "Upload PDFs and ask anything. Get instant AI-driven insights.",
//     images: ["https://yourwebsite.com/twitter-image.jpg"], // Replace with your actual image URL
//   },
//   metadataBase: new URL("https://pdfsense.com"), // Ensures all relative URLs resolve correctly
// };
