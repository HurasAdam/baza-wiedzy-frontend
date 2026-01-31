import type { Variants } from "framer-motion";

// constants/animations.ts
const easePremium: [number, number, number, number] = [0.42, 0, 0.2, 1]; // premium cubic-bezier

// delikatne slide + fade dla stron
export const pageSlideRightPremium = {
  init: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.28, ease: easePremium } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.28, ease: easePremium } },
};

export const pageSlideLeftPremium = {
  init: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.28, ease: easePremium } },
  exit: { x: 20, opacity: 0, transition: { duration: 0.28, ease: easePremium } },
};

export const pageSlideUpPremium = {
  init: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.28, ease: easePremium } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.28, ease: easePremium } },
};

export const pageScaleFadePremium = {
  init: { scale: 0.97, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.32, ease: easePremium } },
  exit: { scale: 0.97, opacity: 0, transition: { duration: 0.32, ease: easePremium } },
};

export const pageFadePremium = {
  init: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.28, ease: easePremium } },
};

export const sidebarVariants: Variants = {
  init: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: "easeInOut", // <- używamy string
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.28,
      ease: "easeInOut", // <- string
    },
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};
