// app/cookies-policy/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Cookie,
  Settings,
  Shield,
  Eye,
  Database,
  Sparkles,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const cookieTypes = [
  {
    name: "Essential Cookies",
    purpose: "Required for basic website functionality",
    duration: "Session",
    examples: "Authentication, security, load balancing",
  },
  {
    name: "Analytics Cookies",
    purpose: "Help us understand how visitors interact with our website",
    duration: "2 years",
    examples: "Google Analytics, performance metrics",
  },
  {
    name: "Functional Cookies",
    purpose: "Enable enhanced functionality and personalization",
    duration: "1 year",
    examples: "Language preferences, region settings",
  },
  {
    name: "Advertising Cookies",
    purpose: "Used to deliver relevant advertisements",
    duration: "90 days",
    examples: "Retargeting, conversion tracking",
  },
];

const cookieDetails = [
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distinguishes unique users",
    duration: "2 years",
    type: "Analytics",
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    purpose: "Distinguishes unique users",
    duration: "24 hours",
    type: "Analytics",
  },
  {
    name: "_gat",
    provider: "Google Analytics",
    purpose: "Throttles request rate",
    duration: "1 minute",
    type: "Analytics",
  },
  {
    name: "auth_token",
    provider: "PDFSense",
    purpose: "User authentication",
    duration: "Session",
    type: "Essential",
  },
  {
    name: "user_preferences",
    provider: "PDFSense",
    purpose: "Stores user settings",
    duration: "1 year",
    type: "Functional",
  },
];

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative overflow-hidden py-20">
        <MaxWidthWrapper>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
              >
                <Cookie className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Cookies Policy
                </h1>
                <p className="text-gray-600 mt-2">
                  Last updated: June 15, 2024
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl">
              This Cookies Policy explains how PDFSense uses cookies and similar
              technologies to recognize you when you visit our website.
            </p>
          </motion.div>

          {/* Cookie Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Types of Cookies We Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cookie.name}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Purpose:</strong> {cookie.purpose}
                    </p>
                    <p>
                      <strong>Duration:</strong> {cookie.duration}
                    </p>
                    <p>
                      <strong>Examples:</strong> {cookie.examples}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cookie Details Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Detailed Cookie Information
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cookie Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cookieDetails.map((cookie, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cookie.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {cookie.provider}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {cookie.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {cookie.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              cookie.type === "Essential"
                                ? "bg-green-100 text-green-800"
                                : cookie.type === "Analytics"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {cookie.type}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Cookie Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Managing Cookies
                </h3>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">
                  You can control and manage cookies in various ways. Please
                  note that removing or blocking cookies can negatively impact
                  your user experience and parts of our website may no longer be
                  fully accessible.
                </p>
                <ul className="text-gray-600 mt-4 space-y-2">
                  <li>• Most browsers allow you to refuse cookies</li>
                  <li>• You can delete existing cookies from your browser</li>
                  <li>
                    • Browser settings typically allow you to block cookies
                  </li>
                  <li>
                    • You can use our cookie consent manager to adjust
                    preferences
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Choices
                </h3>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">
                  We respect your privacy choices. You can adjust your cookie
                  preferences at any time through:
                </p>
                <ul className="text-gray-600 mt-4 space-y-2">
                  <li>• Our cookie consent banner</li>
                  <li>• Browser settings</li>
                  <li>• Third-party opt-out tools</li>
                  <li>• Privacy preference platforms</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Essential cookies cannot be disabled as they are necessary for
                  basic functionality.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Updates & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Cookie Preferences</h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                You can update your cookie preferences at any time through our
                cookie settings manager.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/cookie-settings">
                    Manage Cookies
                    <Settings className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/contact">
                    Contact Us
                    <Shield className="ml-2 h-5 w-5" />
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
