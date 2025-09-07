import { Sora } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Provider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingBackground } from "@/components/FloatingBackground";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import FooterWrapper from "@/components/FooterWrapper";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <Providers>
        <body className={cn("min-h-screen antialiased", `${sora.className}`)}>
          <FloatingBackground />
          <Toaster richColors position="top-center" className="md:hidden" />
          <Toaster richColors className="hidden md:block" />
          <Navbar />
          {children}
          <FooterWrapper />
        </body>
      </Providers>
    </html>
  );
}
