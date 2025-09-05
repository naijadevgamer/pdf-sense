"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = /^\/dashboard\/[^/]+$/.test(pathname);

  if (hideFooter) return null;
  return <Footer />;
}
