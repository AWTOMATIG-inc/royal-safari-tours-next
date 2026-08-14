"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT_DEFAULTS } from "./motionConfig";
import { VARIANTS_MAP } from "./variants";

/**
 * Reveal Component
 * Declarative scroll-reveal wrapper component for animating UI elements
 * as they enter the viewport using GPU-accelerated motion presets.
 * 
 * @param {string} variant - Animation preset ('fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'blurReveal')
 * @param {number} delay - Animation delay in seconds
 * @param {number} duration - Animation duration in seconds
 * @param {number} threshold - Viewport visibility threshold (0.0 - 1.0)
 * @param {boolean} once - Whether to animate only once (default: true)
 * @param {string} className - Optional Tailwind CSS class names
 * @param {string} as - Tag element name ('div', 'section', 'article', 'span', etc.)
 */
export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration,
  threshold = VIEWPORT_DEFAULTS.amount,
  once = VIEWPORT_DEFAULTS.once,
  margin = VIEWPORT_DEFAULTS.margin,
  className = "",
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariant = VARIANTS_MAP[variant] || VARIANTS_MAP.fadeUp;

  // Render static accessible markup if reduced motion is requested by OS
  if (shouldReduceMotion) {
    const Component = as;
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold, margin }}
      variants={selectedVariant}
      custom={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
