// app/use-cases/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Heart,
  Scale,
  BookOpen,
  Building,
  Sparkles,
  Users,
  FileCheck,
  Target,
} from "lucide-react";
import Link from "next/link";

const useCases = [
  {
    icon: GraduationCap,
    title: "Education & Research",
    description:
      "Students and researchers can quickly analyze academic papers, textbooks, and research materials.",
    benefits: [
      "Quick literature reviews",
      "Study material analysis",
      "Research paper summarization",
    ],
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Briefcase,
    title: "Business & Finance",
    description:
      "Professionals can analyze reports, contracts, financial statements, and business documents.",
    benefits: [
      "Contract analysis",
      "Financial report review",
      "Market research",
    ],
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: Scale,
    title: "Legal & Compliance",
    description:
      "Legal professionals can review contracts, case files, and legal documents efficiently.",
    benefits: [
      "Contract review",
      "Legal document analysis",
      "Compliance checking",
    ],
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: Heart,
    title: "Healthcare & Medicine",
    description:
      "Medical professionals can analyze research papers, patient records, and medical literature.",
    benefits: [
      "Medical research analysis",
      "Patient record review",
      "Clinical study summarization",
    ],
    color: "from-red-500 to-rose-500",
  },
  {
    icon: BookOpen,
    title: "Publishing & Media",
    description:
      "Publishers and content creators can analyze manuscripts, articles, and content materials.",
    benefits: ["Manuscript analysis", "Content research", "Editorial review"],
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Building,
    title: "Government & NGOs",
    description:
      "Government agencies and non-profits can analyze reports, proposals, and policy documents.",
    benefits: [
      "Policy analysis",
      "Grant proposal review",
      "Report summarization",
    ],
    color: "from-indigo-600 to-blue-600",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Research Scientist",
    content:
      "PDFSense has revolutionized how I analyze research papers. I can now review dozens of papers in the time it used to take me to read one.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Legal Counsel",
    content:
      "The contract analysis feature has saved our firm countless hours. The AI understands legal terminology perfectly.",
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Content Director",
    content:
      "As a publisher, we handle hundreds of manuscripts monthly. PDFSense helps us quickly identify promising content.",
    avatar: "ER",
  },
];

export default function UseCasesPage() {
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
              <Target className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transform Your Workflow Across
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Every Industry
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how professionals in various industries are using
              PDFSense to revolutionize their document workflows.
            </p>
          </motion.div>

          {/* Use Cases Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${useCase.color} rounded-xl mb-4`}
                >
                  <useCase.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <FileCheck className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from professionals who are already transforming their
                workflows with PDFSense.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Transform Your Workflow?
              </h2>
              <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                Join thousands of professionals who are already using PDFSense
                to revolutionize their document analysis.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="/sign-up">
                  Start Your Journey
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
