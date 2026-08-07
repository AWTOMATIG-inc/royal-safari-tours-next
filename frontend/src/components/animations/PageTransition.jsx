"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MOTION_DURATIONS, MOTION_EASINGS } from "./motionConfig";

/**
 * PageTransition Component
 * Lightweight page route transition wrapper for Next.js App Router
 */
export default function PageTransition({ children, className = "" }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: MOTION_DURATIONS.fast,
        ease: MOTION_EASINGS.easeOutLuxury,
      }}
      className={`w-full flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
