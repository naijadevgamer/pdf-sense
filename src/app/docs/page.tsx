// app/docs/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  AppWindowIcon,
  ArrowRight,
  BookOpen,
  Code,
  GitBranch,
  MessageCircle,
  Search,
  Server,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const docSections = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Begin your journey with PDFSense API",
    color: "from-blue-600 to-cyan-600",
    topics: [
      "Quick Start Guide",
      "Authentication",
      "First API Call",
      "Rate Limits",
    ],
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API endpoint documentation",
    color: "from-purple-600 to-pink-600",
    topics: ["Documents API", "Chat Endpoints", "Webhooks", "Error Handling"],
  },
  {
    icon: GitBranch,
    title: "SDKs & Libraries",
    description: "Client libraries for popular languages",
    color: "from-green-600 to-emerald-600",
    topics: [
      "JavaScript SDK",
      "Python Library",
      "React Components",
      "REST API",
    ],
  },
  {
    icon: Server,
    title: "Deployment",
    description: "Deploy and scale your integration",
    color: "from-amber-500 to-orange-500",
    topics: [
      "Production Setup",
      "Performance Optimization",
      "Monitoring",
      "Best Practices",
    ],
  },
];

const quickStartGuide = `
# Quick Start Guide

## 1. Get Your API Key
First, sign up for an account and get your API key from the dashboard.

## 2. Install the SDK
\`\`\`bash
npm install @pdfsense/sdk
# or
pip install pdfsense
\`\`\`

## 3. Make Your First Call
\`\`\`javascript
import { PDFSense } from '@pdfsense/sdk';

const client = new PDFSense({
  apiKey: 'your_api_key_here'
});

// Upload a document
const document = await client.documents.upload({
  file: './document.pdf',
  options: { analysis: 'full' }
});
\`\`\`
`;

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative overflow-hidden py-20">
        <MaxWidthWrapper>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Documentation
                </h2>
                <nav className="space-y-2">
                  {docSections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveSection(
                          section.title.toLowerCase().replace(" ", "-")
                        )
                      }
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection ===
                        section.title.toLowerCase().replace(" ", "-")
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    API Resources
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/api"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <AppWindowIcon className="h-4 w-4" />
                      API Reference
                    </Link>
                    <Link
                      href="/community"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <GitBranch className="h-4 w-4" />
                      Developer Community
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Server className="h-4 w-4" />
                      Support
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-3/4"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6"
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  PDFSense
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Documentation
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Comprehensive guides and references to help you build with
                  PDFSense API.
                </p>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative max-w-2xl mx-auto"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
                  />
                </motion.div>
              </div>

              {/* Documentation Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-12"
              >
                {docSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`p-3 bg-gradient-to-r ${section.color} rounded-xl`}
                      >
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                        <p className="text-gray-600">{section.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {section.topics.map((topic, topicIndex) => (
                        <Link
                          key={topicIndex}
                          href={`/docs/${section.title
                            .toLowerCase()
                            .replace(" ", "-")}/${topic
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <span className="text-gray-900">{topic}</span>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      ))}
                    </div>

                    {section.title === "Getting Started" && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Quick Example
                        </h3>
                        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                          <code className="text-gray-100 text-sm">
                            {quickStartGuide.trim()}
                          </code>
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Need more help?</h2>
                  <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                    Join our developer community or contact our support team for
                    assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Link href="/community">
                        Developer Community
                        <Users className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                    >
                      <Link href="/contact">
                        Contact Support
                        <MessageCircle className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
