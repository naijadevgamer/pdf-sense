"use client";

import Link from "next/link";
import {
  ArrowUp,
  MessageSquare,
  Github,
  X,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ClientOnlyParticles } from "./ClientOnlyParticles";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-white border-t border-gray-200 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text relative">
                  PDFSense.
                </h3>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
              </motion.div>
            </Link>
            <p className="text-gray-600 max-w-md mb-6">
              Transforming document interaction through AI-powered
              conversations. Experience the future of PDF analysis today.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Github className="h-5 w-5 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Linkedin className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </motion.div>

          {/* Product links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Use Cases
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 mb-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to transform your document workflow?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who are already having conversations with
              their documents.
            </p>
            <Button asChild className="relative overflow-hidden group">
              <Link href="/sign-up">
                <MessageSquare className="mr-2 h-5 w-5" />
                Get Started Free
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PDFSense. All rights reserved.
          </p>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Cookie Policy
            </Link>

            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-100 hover:bg-gray-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ClientOnlyParticles />
      </div>
    </footer>
  );
};

export default Footer;
