// app/api/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Code,
  Cpu,
  Zap,
  Shield,
  BookOpen,
  Terminal,
  Sparkles,
  GitBranch,
  Server,
  Database,
  Network,
  Key,
} from "lucide-react";
import Link from "next/link";

const apiFeatures = [
  {
    icon: Cpu,
    title: "Powerful Processing",
    description:
      "Access our advanced AI processing capabilities through a simple REST API.",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Low-latency API responses with optimized processing pipelines.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with end-to-end encryption and compliance.",
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: GitBranch,
    title: "Webhooks Support",
    description: "Real-time notifications and event-driven architecture.",
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: Database,
    title: "Data Persistence",
    description:
      "Store and retrieve processed documents with our secure cloud storage.",
    color: "from-indigo-600 to-blue-600",
  },
  {
    icon: Network,
    title: "Scalable Infrastructure",
    description:
      "Handle any volume of requests with our auto-scaling infrastructure.",
    color: "from-red-500 to-rose-500",
  },
];

const endpoints = [
  {
    method: "POST",
    path: "/v1/documents/upload",
    description: "Upload a document for processing",
    color: "bg-green-100 text-green-800",
  },
  {
    method: "GET",
    path: "/v1/documents/{id}",
    description: "Retrieve a processed document",
    color: "bg-blue-100 text-blue-800",
  },
  {
    method: "POST",
    path: "/v1/chat/{document_id}",
    description: "Send a message to document AI",
    color: "bg-purple-100 text-purple-800",
  },
  {
    method: "GET",
    path: "/v1/usage",
    description: "Check API usage statistics",
    color: "bg-amber-100 text-amber-800",
  },
];

const codeExample = `// Example: Upload and process a document
const response = await fetch('https://api.pdfsense.com/v1/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    file: 'base64_encoded_file',
    options: {
      language: 'en',
      analysis: 'full'
    }
  })
});

const data = await response.json();
console.log(data); // { id: 'doc_123', status: 'processing' }`;

export default function APIPage() {
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
              <Code className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful API for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Developers
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrate PDFSense&apos;s advanced AI document analysis
              capabilities directly into your applications with our robust API.
            </p>
          </motion.div>

          {/* API Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {apiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
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

          {/* API Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                API Endpoints
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple, RESTful endpoints to integrate PDFSense into your
                applications.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-6 p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div
                    className={`px-3 py-1 rounded-md text-sm font-mono font-semibold ${endpoint.color}`}
                  >
                    {endpoint.method}
                  </div>
                  <code className="flex-1 font-mono text-gray-800">
                    {endpoint.path}
                  </code>
                  <div className="text-gray-600">{endpoint.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Start
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get started with our API in minutes with this simple example.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">
                  JavaScript Example
                </span>
              </div>
              <pre className="text-gray-100 font-mono text-sm overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </motion.div>

          {/* Documentation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Comprehensive Documentation
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Explore our detailed API documentation with examples, best
                practices, and integration guides.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/docs">
                  View Documentation
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Get Started Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-xl mb-4">
                <Key className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Get Your API Key</h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Start building with PDFSense API. Get instant access to your API
                key and start integrating today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/sign-up">
                    Sign Up for Free
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                >
                  <Link href="/contact">
                    Contact Sales
                    <Server className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
