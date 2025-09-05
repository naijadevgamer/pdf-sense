// app/terms-of-service/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  AlertTriangle,
  BookOpen,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";

const termsSections = [
  {
    icon: UserCheck,
    title: "Account Terms",
    content: `1. Eligibility
You must be at least 16 years old to use our services. By creating an account, you represent that you meet this requirement.

2. Account Security
You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

3. Account Information
You must provide accurate and complete information when creating your account and keep it updated.

4. Account Termination
We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.`,
  },
  {
    icon: FileText,
    title: "Service Usage",
    content: `1. Acceptable Use
You may use our services only for lawful purposes and in accordance with these terms. You agree not to:
- Upload illegal or harmful content
- Attempt to reverse engineer our services
- Use our services to create competing products
- Engage in any activity that disrupts our services

2. Document Ownership
You retain all rights to the documents you upload. We only process them to provide our services.

3. AI Processing
Our AI analyzes your documents to provide insights. We don't guarantee specific results or accuracy.

4. Fair Usage
We may limit usage to ensure quality service for all users. Excessive usage may require enterprise plans.`,
  },
  {
    icon: Scale,
    title: "Intellectual Property",
    content: `1. Our Intellectual Property
All rights, title, and interest in our services, including all intellectual property rights, remain with PDFSense.

2. Your Content
You retain ownership of any content you upload. By using our services, you grant us a license to process your content to provide the services.

3. Feedback
Any feedback you provide becomes our property, and we may use it to improve our services.

4. Brand Usage
You may not use our trademarks or branding without prior written permission.`,
  },
  {
    icon: AlertTriangle,
    title: "Limitations of Liability",
    content: `1. Service Availability
We strive to maintain 99.9% uptime but don't guarantee uninterrupted service. We're not liable for occasional downtime.

2. Content Accuracy
While our AI is advanced, we don't guarantee the accuracy of analysis results. You should verify critical information.

3. Maximum Liability
Our total liability to you for any claims shall not exceed the amount you paid us in the last 6 months.

4. Indirect Damages
We're not liable for any indirect, incidental, or consequential damages arising from your use of our services.`,
  },
  {
    icon: Shield,
    title: "Indemnification",
    content: `You agree to indemnify and hold harmless PDFSense and its affiliates from any claims, damages, or expenses (including legal fees) arising from:
- Your use of our services
- Your violation of these terms
- Your infringement of any third-party rights
- Any content you upload to our services

We reserve the right to assume exclusive defense and control of any matter subject to indemnification, and you agree to cooperate with our defense.`,
  },
  {
    icon: BookOpen,
    title: "Governing Law",
    content: `1. Applicable Law
These terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.

2. Dispute Resolution
Any disputes shall be resolved through binding arbitration in Delaware, rather than in court.

3. Class Action Waiver
You agree to resolve disputes on an individual basis and waive any right to participate in class actions.

4. Changes to Terms
We may modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.`,
  },
];

export default function TermsOfServicePage() {
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
                <Scale className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Terms of Service
                </h1>
                <p className="text-gray-600 mt-2">
                  Last updated: June 15, 2024
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl">
              These Terms of Service govern your use of PDFSense. Please read
              them carefully before using our services.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-12 mb-16"
          >
            {termsSections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <section.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              </motion.section>
            ))}
          </motion.div>

          {/* Additional Clauses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Additional Terms
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Subscription Terms
              </h3>
              <p className="text-gray-600 mb-6">
                Paid subscriptions automatically renew until canceled. You may
                cancel at any time through your account settings. Refunds are
                available within 14 days of purchase for annual plans, subject
                to our refund policy.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Beta Features
              </h3>
              <p className="text-gray-600 mb-6">
                We may offer beta features that are still in development. These
                features are provided "as is" and may be discontinued at any
                time without notice.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Force Majeure
              </h3>
              <p className="text-gray-600">
                We're not liable for any failure to perform due to circumstances
                beyond our reasonable control, including natural disasters, war,
                terrorism, or internet outages.
              </p>
            </div>
          </motion.div>

          {/* Acceptance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                By using PDFSense, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/contact">
                    Questions?
                    <FileText className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                >
                  <Link href="/privacy-policy">
                    View Privacy Policy
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
