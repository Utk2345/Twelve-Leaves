"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { PlantStage } from "./PlantStage";

export function PlantStageTransition({
  stage,
}: {
  stage: ComponentProps<typeof PlantStage>["stage"];
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <PlantStage stage={stage} />
      </motion.div>
    </AnimatePresence>
  );
}
