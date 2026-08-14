"use client";

import { motion, useReducedMotion } from "framer-motion";
import { VIEWPORT_DEFAULTS, STAGGER_DEFAULTS } from "./motionConfig";
import { staggerContainerVariant, staggerItemVariant } from "./variants";

/**
 * RevealGroup Component
 * Container component that automatically applies staggered entrance animations
 * to any direct or indirect child items wrapped in RevealGroup.Item or motion.div.
 * 
 * @param {number} staggerDelay - Delay between child animations in seconds
 * @param {number} delay - Initial container delay in seconds
 * @param {number} threshold - Viewport visibility threshold
 * @param {boolean} once - Whether to animate only once
 * @param {string} className - Optional Tailwind CSS classes
 * @param {string} as - Container DOM element tag
 */
export default function RevealGroup({
  children,
  staggerDelay = STAGGER_DEFAULTS.containerStagger,
  delay = 0,
  threshold = VIEWPORT_DEFAULTS.amount,
  once = VIEWPORT_DEFAULTS.once,
  margin = VIEWPORT_DEFAULTS.margin,
  className = "",
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

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
      variants={staggerContainerVariant}
      custom={{ staggerDelay, delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * RevealGroup.Item Component
 * Individual item inside a RevealGroup container
 */
RevealGroup.Item = function RevealGroupItem({
  children,
  className = "",
  as = "div",
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

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
      variants={staggerItemVariant}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
