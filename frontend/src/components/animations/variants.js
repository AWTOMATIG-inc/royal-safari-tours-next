import { MOTION_DURATIONS, MOTION_EASINGS, STAGGER_DEFAULTS } from "./motionConfig";

/**
 * Reusable Motion Variants
 * Shared Framer Motion variant definitions optimized for 60fps GPU acceleration
 */

export const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const fadeDownVariant = {
  hidden: {
    opacity: 0,
    y: -28,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const fadeLeftVariant = {
  hidden: {
    opacity: 0,
    x: 36,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const fadeRightVariant = {
  hidden: {
    opacity: 0,
    x: -36,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const scaleUpVariant = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.normal,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const blurRevealVariant = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 16,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: custom.duration || MOTION_DURATIONS.slow,
      delay: custom.delay || 0,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  }),
};

export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay || STAGGER_DEFAULTS.containerStagger,
      delayChildren: custom.delay || 0,
    },
  }),
};

export const staggerItemVariant = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.easeOutLuxury,
    },
  },
};

export const VARIANTS_MAP = {
  fadeUp: fadeUpVariant,
  fadeDown: fadeDownVariant,
  fadeLeft: fadeLeftVariant,
  fadeRight: fadeRightVariant,
  scaleUp: scaleUpVariant,
  blurReveal: blurRevealVariant,
  staggerContainer: staggerContainerVariant,
  staggerItem: staggerItemVariant,
};
