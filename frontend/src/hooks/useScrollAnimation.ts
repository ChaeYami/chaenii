"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const transition = {
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export function useScrollAnimation(once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  return { ref, isInView };
}
