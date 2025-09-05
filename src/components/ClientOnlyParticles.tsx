"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Add this component for client-only rendering
export const ClientOnlyParticles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything during SSR
  }

  return (
    <>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-purple-700/50 rounded-full"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          animate={{
            x: [null, Math.random() * 100 + "vw"],
            y: [null, Math.random() * 100 + "vh"],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
};

// Add this component for client-only rendering
export const ClientOnlyParticlesNotFound = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render anything during SSR
  }

  return (
    <>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
          }}
          animate={{
            x: [null, Math.random() * 100 + "vw"],
            y: [null, Math.random() * 100 + "vh"],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
};
