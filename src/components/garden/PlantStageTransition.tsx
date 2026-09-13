"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { PlantStage } from "./PlantStage";

export function PlantStageTransition({
  stage,
  overrideImageSrc,
}: {
  stage: ComponentProps<typeof PlantStage>["stage"];
  overrideImageSrc?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // Re-keying on the chosen plant (not just the stage) means picking a
        // different unlocked plant at bloom gets the same pop-in transition
        // as growing into a new stage.
        key={`${stage}-${overrideImageSrc ?? "default"}`}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <PlantStage stage={stage} overrideImageSrc={overrideImageSrc} />
      </motion.div>
    </AnimatePresence>
  );
}
