// NavbarClient.tsx (client component)
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";

export default function NavbarClient({ user }: { user: any }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const groundNav = /^\/dashboard\/[^/]+$/.test(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={
        !groundNav
          ? `fixed h-16 inset-x-0 top-0 z-50 w-full transition-all duration-500 ${
              scrolled
                ? "bg-white sm:bg-white/90 sm:backdrop-blur-md shadow-lg border-b border-gray-200/30"
                : "bg-transparent"
            }`
          : "h-16 w-full transition-all duration-500 border-b border-gray-200"
      }
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <h1 className="relative text-2xl font-bold bg-gradient-to-r text- from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  PDFSense.
                </h1>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
              </motion.div>
            </motion.div>
          </Link>

          <MobileNav isAuth={!!user} user={user} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <motion.div
                  className="hidden items-center space-x-4 sm:flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button asChild size={"sm"} variant={"ghost"}>
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                  <Button asChild size={"sm"} variant={"ghost"}>
                    <LoginLink>Sign in</LoginLink>
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="relative overflow-hidden">
                      <RegisterLink>
                        <span className="relative z-10">Get started</span>
                        <ArrowRight className="ml-1.5 size-5 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
                      </RegisterLink>
                    </Button>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <>
                <Button asChild size={"sm"} variant={"ghost"}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>

                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </motion.nav>
  );
}
