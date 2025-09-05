// app/privacy-policy/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Database,
  Eye,
  FileText,
  Lock,
  Server,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

const policySections = [
  {
    icon: User,
    title: "Information We Collect",
    content: `We collect information that you provide directly to us, including:
- Account information (name, email, password)
- Payment information for premium plans
- Documents you upload for processing
- Communications with our support team
- Usage data and analytics`,
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: `We use your information to:
- Provide and maintain our services
- Process your document analysis requests
- Improve our AI algorithms and services
- Communicate with you about updates and support
- Ensure security and prevent fraud
- Comply with legal obligations`,
  },
  {
    icon: Shield,
    title: "Data Protection & Security",
    content: `We implement robust security measures:
- End-to-end encryption for all documents
- Regular security audits and penetration testing
- SOC 2 Type II compliance
- Data anonymization for AI training
- Secure data centers with 24/7 monitoring
- Regular employee security training`,
  },
  {
    icon: Server,
    title: "Data Retention",
    content: `We retain your information only as long as necessary:
- Account data: Until you request deletion
- Processed documents: 30 days unless you save them
- Analytics data: 24 months maximum
- Payment information: As required by financial regulations
- You can request data deletion at any time`,
  },
  {
    icon: Eye,
    title: "Your Rights",
    content: `You have the right to:
- Access your personal information
- Correct inaccurate data
- Request data deletion
- Export your data
- Opt-out of marketing communications
- Withdraw consent for data processing
- Lodge complaints with regulatory authorities`,
  },
  {
    icon: Lock,
    title: "Third-Party Services",
    content: `We work with trusted third parties:
- Payment processors (Stripe, PayPal)
- Cloud infrastructure providers (AWS, Google Cloud)
- Analytics services (Google Analytics)
- Customer support platforms
- All third parties are vetted for compliance with privacy regulations`,
  },
];

export default function PrivacyPolicyPage() {
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
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 mt-2">
                  Last updated: June 15, 2024
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl">
              At PDFSense, we take your privacy seriously. This policy explains
              how we collect, use, and protect your personal information when
              you use our services.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-12 mb-16"
          >
            {policySections.map((section, index) => (
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

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Additional Information
            </h2>
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                International Data Transfers
              </h3>
              <p className="text-gray-600 mb-6">
                Your information may be transferred to and processed in
                countries other than your own. We ensure all international
                transfers comply with applicable data protection laws through
                Standard Contractual Clauses and other approved mechanisms.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Children&apos;s Privacy
              </h3>
              <p className="text-gray-600 mb-6">
                Our services are not intended for children under 16. We do not
                knowingly collect personal information from children under 16.
                If we become aware of such collection, we will take steps to
                delete it.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Policy Updates
              </h3>
              <p className="text-gray-600">
                We may update this policy from time to time. We will notify you
                of significant changes by email or through our services.
                Continued use of our services after changes constitutes
                acceptance of the updated policy.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Questions About Privacy?
              </h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                If you have any questions about our privacy practices or would
                like to exercise your rights, please contact our Data Protection
                Officer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/contact">
                    Contact Us
                    <FileText className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-gray-900 hover:text-white hover:bg-white/10"
                >
                  <Link href="/data-request">
                    Data Request Form
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
