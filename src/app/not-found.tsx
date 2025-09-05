"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Ghost, Home, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { ClientOnlyParticlesNotFound } from "@/components/ClientOnlyParticles";

export default function NotFoundPage() {
  const router = useRouter();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-200/70 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20" />
            <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl">
              <Ghost className="w-24 h-24 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-900 mb-3"
        >
          Page Not Found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 max-w-md"
        >
          The page you're looking for seems to have wandered off{dots}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => router.push("/")}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            size="lg"
          >
            <Navigation className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        <ClientOnlyParticlesNotFound />
      </div>
    </div>
  );
}
