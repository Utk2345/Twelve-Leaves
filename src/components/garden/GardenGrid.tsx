"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Plant } from "@/lib/unlocks";

type GridEntry = { plant: Plant; unlockedAt: Date | null };

// Unlocks from the last day get a "New" badge + gold border — the toast on
// /dashboard/habits is gone the moment you dismiss it or navigate away, but
// this makes the celebration visible whenever you actually look at the grid.
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function GardenGrid({
  entries,
  growthPoints,
}: {
  entries: GridEntry[];
  growthPoints: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
      {entries.map(({ plant, unlockedAt }) => {
        const unlocked = unlockedAt !== null;
        const remaining = plant.unlockThreshold - growthPoints;
        const isRecent =
          unlocked && Date.now() - new Date(unlockedAt).getTime() < RECENT_WINDOW_MS;

        return (
          <motion.div
            key={plant.id}
            initial={isRecent && !prefersReducedMotion ? { opacity: 0, scale: 0.85 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex flex-col items-center gap-1.5 border px-3 py-4 text-center ${
              unlocked ? "bg-white/50" : "bg-[#F2EEE1]"
            } ${isRecent ? "border-[#B98A2E]" : "border-[#EAE5D6]"}`}
          >
            <span
              className={`text-3xl leading-none ${unlocked ? "" : "grayscale opacity-30"}`}
              aria-hidden="true"
            >
              {plant.emoji}
            </span>
            <span
              className={`font-[family-name:var(--font-fraunces)] text-sm ${
                unlocked ? "text-[#24261F]" : "text-[#B7AF98]"
              }`}
            >
              {unlocked ? plant.name : "???"}
            </span>
            {isRecent && (
              <span className="font-[family-name:var(--font-public-sans)] text-[10px] uppercase tracking-wide text-[#B98A2E]">
                New
              </span>
            )}
            {!unlocked && (
              <span className="font-[family-name:var(--font-public-sans)] text-[11px] text-[#8A8672]">
                {remaining > 0 ? `${remaining} pts to unlock` : "unlocks now"}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
