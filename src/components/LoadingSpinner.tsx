// components/LoadingSpinner.tsx
"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" },
          }}
          className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Loading</h3>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-500">Preparing your experience...</span>
        </div>
      </motion.div>
    </div>
  );
};
