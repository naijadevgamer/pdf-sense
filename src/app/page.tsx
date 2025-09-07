// app/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Eye,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { FloatingBackground } from "@/components/FloatingBackground";

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 h-full">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md mb-4">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const mainRef = useRef(null);
  const isInView = useInView(mainRef, { once: true, margin: "-100px" });

  return (
    <>
      <div className="relative overflow-hidden">
        <FloatingBackground />

        <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-7 py-2 shadow-md transition-all hover:border-gray-300 hover:bg-white/60 animate-bounce"
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-semibold text-gray-700">
                PDFSense is now public!
              </p>
            </motion.button>
          </motion.div>

          <motion.h1
            ref={mainRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl text-3xl sm:text-5xl font-bold md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient"
          >
            Conversational Intelligence for Your Documents
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-prose text-zinc-700 sm:text-lg"
          >
            PDFSense transforms static documents into interactive conversations.
            Upload your PDFs and engage with AI that understands context,
            extracts insights, and answers your questions in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8"
          >
            <Button
              asChild
              size={"lg"}
              className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Link href="/dashboard" target="_blank">
                <span className="relative z-10">Experience the Future</span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </Button>
          </motion.div>
        </MaxWidthWrapper>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animate-pulse" />
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 sm:py-20:sm:py-24 overflow-hidden">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
              Revolutionary Document Interaction
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of document analysis with
              AI-powered insights and seamless interaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast Analysis"
              description="Process and understand complex documents in seconds, not minutes."
              delay={0.1}
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Insights"
              description="Get meaningful answers and summaries from your documents with advanced AI."
              delay={0.2}
            />
            <FeatureCard
              icon={Eye}
              title="Visual Document Mapping"
              description="See how concepts connect within your documents through interactive visualizations."
              delay={0.3}
            />
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Demo Section */}
      <div className="relative py-20 sm:py-24 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
              See It In Action
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how PDFSense transforms your document workflow with
              immersive AI interactions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
            <div className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-8 md:p-12">
              <div className="aspect-video bg-gray-900/5 rounded-lg flex items-center justify-center">
                <div className="text-center p-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Interactive Demo
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Experience the future of document interaction
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard">
                      Try Live Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
