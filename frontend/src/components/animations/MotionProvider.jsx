"use client";

import { MotionConfig } from "framer-motion";

/**
 * MotionProvider Component
 * Root Framer Motion configuration provider for setting global motion rules,
 * hardware acceleration settings, and accessibility fallbacks.
 */
export default function MotionProvider({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
