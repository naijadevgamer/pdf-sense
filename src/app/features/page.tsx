// app/features/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Eye,
  Shield,
  Clock,
  Globe,
  Sparkles,
  BarChart3,
  FileText,
  MessageSquare,
  CloudUpload,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced natural language processing that understands context and extracts meaningful insights from your documents.",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description:
      "Process complex documents in seconds with our optimized AI infrastructure and real-time analysis.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Eye,
    title: "Visual Document Mapping",
    description:
      "Interactive visualizations that show how concepts connect within your documents for better understanding.",
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "End-to-end encryption, secure file handling, and compliance with industry security standards.",
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Your AI assistant is always available to analyze documents and answer questions anytime, anywhere.",
    color: "from-indigo-600 to-blue-600",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Analyze documents in multiple languages with accurate translation and contextual understanding.",
    color: "from-red-500 to-rose-500",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "50ms", label: "Response Time" },
  { value: "256-bit", label: "Encryption" },
  { value: "50+", label: "Languages" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Modern Document Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the cutting-edge capabilities that make PDFSense the most
              advanced AI document analysis platform available.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience These Features?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of users who are already transforming their
                document workflow with PDFSense.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/sign-up">
                  Get Started Free
                  <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
