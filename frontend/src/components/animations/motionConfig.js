/**
 * Global Motion System Configuration
 * Royal Safari Tours Design System
 * 
 * Centralized motion tokens, duration scales, luxury easing curves,
 * and default viewport thresholds for consistent scroll animations.
 */

export const MOTION_DURATIONS = {
  instant: 0.15,
  fast: 0.35,
  normal: 0.55,
  slow: 0.8,
  hero: 1.0,
};

export const MOTION_EASINGS = {
  // Ultra-smooth luxury cubic-bezier curves
  easeOutLuxury: [0.22, 1, 0.36, 1],
  easeInOutLuxury: [0.65, 0, 0.35, 1],
  easeOutGentle: [0.16, 1, 0.3, 1],
  springGentle: { type: "spring", stiffness: 100, damping: 18 },
};

export const VIEWPORT_DEFAULTS = {
  once: true,            // Trigger animation only once upon scrolling into view
  amount: 0.2,          // Require 20% of element to be visible before triggering
  margin: "0px 0px -40px 0px", // Trigger slightly before scrolling past element
};

export const STAGGER_DEFAULTS = {
  containerStagger: 0.12, // Stagger delay between child elements
  fastStagger: 0.07,
  heroStagger: 0.15,
};
