"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Plant } from "@/lib/unlocks";
import { INK, INK_FAINT } from "@/lib/ui-classes";

type GridEntry = { plant: Plant; unlockedAt: Date | null };

// Unlocks from the last day get a "New" badge + gold ring — the toast on
// /dashboard/habits is gone the moment you dismiss it or navigate away, but
// this makes the celebration visible whenever you actually look at the grid.
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function GardenGrid({ entries, growthPoints }: { entries: GridEntry[]; growthPoints: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
      {entries.map(({ plant, unlockedAt }) => {
        const unlocked = unlockedAt !== null;
        const remaining = plant.unlockThreshold - growthPoints;
        const isRecent = unlocked && Date.now() - new Date(unlockedAt).getTime() < RECENT_WINDOW_MS;

        return (
          <motion.div
            key={plant.id}
            initial={isRecent && !prefersReducedMotion ? { opacity: 0, scale: 0.85 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center ${
              unlocked
                ? "bg-[#FFFEFB] dark:bg-[#1C2717] shadow-[0_10px_24px_-14px_rgba(40,36,20,0.2)] dark:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)]"
                : "bg-[#EEE8D6] dark:bg-[#1A2216]"
            } ${isRecent ? "ring-2 ring-[#D9A544] dark:ring-[#E6BD6C]" : ""}`}
          >
            <span className={`text-3xl leading-none ${unlocked ? "" : "grayscale opacity-30"}`} aria-hidden="true">
              {plant.emoji}
            </span>
            <span
              className={`font-[family-name:var(--font-fraunces)] text-sm ${
                unlocked ? INK : "text-[#B7AF98] dark:text-[#5C6150]"
              }`}
            >
              {unlocked ? plant.name : "???"}
            </span>
            {isRecent && (
              <span className="text-[10px] uppercase tracking-wide text-[#B9862E] dark:text-[#E6BD6C]">New</span>
            )}
            {!unlocked && (
              <span className={`text-[11px] ${INK_FAINT}`}>
                {remaining > 0 ? `${remaining} pts to unlock` : "unlocks now"}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
