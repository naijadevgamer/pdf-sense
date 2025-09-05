// app/help-center/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Clock,
  Users,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description:
      "Learn how to set up your account and upload your first documents",
    color: "from-blue-600 to-cyan-600",
    articles: [
      "Creating your account",
      "Uploading your first PDF",
      "Understanding your dashboard",
      "Basic navigation guide",
    ],
  },
  {
    icon: MessageCircle,
    title: "Using PDFSense",
    description: "Master the art of conversing with your documents",
    color: "from-purple-600 to-pink-600",
    articles: [
      "Asking effective questions",
      "Understanding AI responses",
      "Advanced query techniques",
      "Managing conversation history",
    ],
  },
  {
    icon: FileText,
    title: "Account & Billing",
    description: "Manage your subscription and account settings",
    color: "from-green-600 to-emerald-600",
    articles: [
      "Upgrading your plan",
      "Managing billing information",
      "Canceling your subscription",
      "Account security settings",
    ],
  },
  {
    icon: Users,
    title: "Troubleshooting",
    description: "Solve common issues and get back on track",
    color: "from-amber-500 to-orange-500",
    articles: [
      "File upload issues",
      "AI response problems",
      "Account access help",
      "Performance optimization",
    ],
  },
];

const popularArticles = [
  {
    title: "How to ask better questions to get precise answers",
    category: "Using PDFSense",
  },
  {
    title: "Understanding your monthly usage limits",
    category: "Account & Billing",
  },
  {
    title: "Troubleshooting slow response times",
    category: "Troubleshooting",
  },
  {
    title: "Maximizing your free plan benefits",
    category: "Getting Started",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative overflow-hidden py-20">
        <MaxWidthWrapper>
          {/* Hero Section */}
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
              <HelpCircle className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                help you?
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to your questions, troubleshoot issues, and master
              PDFSense with our comprehensive help resources.
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
                placeholder="Search for help articles, guides, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:ring-0"
              />
            </motion.div>
          </motion.div>

          {/* Popular Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {article.category}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${category.color} rounded-xl mb-4`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li
                        key={articleIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <FileText className="h-4 w-4 text-blue-500" />
                        {article}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chat Support
              </h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Start Chat</Link>
              </Button>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-xl mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community Forum
              </h3>
              <p className="text-gray-600 mb-4">
                Connect with other PDFSense users
              </p>
              <Button asChild variant="outline">
                <Link href="/community">Join Community</Link>
              </Button>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-xl mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Video Tutorials
              </h3>
              <p className="text-gray-600 mb-4">Watch step-by-step guides</p>
              <Button asChild variant="outline">
                <Link href="/tutorials">Watch Now</Link>
              </Button>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Our support team is here to help you get the most out of
                PDFSense.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="/contact">
                  Contact Support
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
