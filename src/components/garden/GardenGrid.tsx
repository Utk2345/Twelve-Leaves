"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { Plant } from "@/lib/unlocks";
import { plantImageFor } from "@/lib/plant-art";
import { INK, INK_FAINT } from "@/lib/ui-classes";

type GridEntry = { plant: Plant; unlockedAt: Date | null };

// Unlocks from the last day get a "New" badge + gold ring — the toast on
// /dashboard/habits is gone the moment you dismiss it or navigate away, but
// this makes the celebration visible whenever you actually look at the grid.
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function GardenGrid({
  entries,
  growthPoints,
  selectable = false,
  selectedPlantId = null,
  pendingId = null,
  onSelect,
}: {
  entries: GridEntry[];
  growthPoints: number;
  /** Whether tapping an unlocked plant should pick it as the active bloom plant (only true once bloomed). */
  selectable?: boolean;
  selectedPlantId?: string | null;
  /** Plant id currently mid-save, so its tile can show a subtle busy state. */
  pendingId?: string | null;
  onSelect?: (plantId: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
      {entries.map(({ plant, unlockedAt }) => {
        const unlocked = unlockedAt !== null;
        const remaining = plant.unlockThreshold - growthPoints;
        const isRecent = unlocked && Date.now() - new Date(unlockedAt).getTime() < RECENT_WINDOW_MS;
        const isSelected = selectedPlantId === plant.id;
        const canTap = selectable && unlocked && !!onSelect;

        return (
          <motion.button
            key={plant.id}
            type="button"
            disabled={!canTap || pendingId === plant.id}
            onClick={canTap ? () => onSelect!(plant.id) : undefined}
            initial={isRecent && !prefersReducedMotion ? { opacity: 0, scale: 0.85 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center ${
              unlocked
                ? "bg-[#FFFEFB] dark:bg-[#1C2717] shadow-[0_10px_24px_-14px_rgba(40,36,20,0.2)] dark:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)]"
                : "bg-[#EEE8D6] dark:bg-[#1A2216]"
            } ${
              isSelected
                ? "ring-2 ring-[#33502F] dark:ring-[#82B27C]"
                : isRecent
                  ? "ring-2 ring-[#D9A544] dark:ring-[#E6BD6C]"
                  : ""
            } ${canTap ? "cursor-pointer hover:-translate-y-0.5 transition-transform disabled:opacity-60" : ""}`}
          >
            {plantImageFor(plant.id) ? (
              <Image
                src={plantImageFor(plant.id)!}
                alt=""
                width={44}
                height={44}
                className={`object-contain ${unlocked ? "" : "grayscale opacity-30"}`}
                aria-hidden="true"
              />
            ) : (
              <span className={`text-3xl leading-none ${unlocked ? "" : "grayscale opacity-30"}`} aria-hidden="true">
                {plant.emoji}
              </span>
            )}
            <span
              className={`font-[family-name:var(--font-fraunces)] text-sm ${
                unlocked ? INK : "text-[#B7AF98] dark:text-[#5C6150]"
              }`}
            >
              {unlocked ? plant.name : "???"}
            </span>
            {isSelected && (
              <span className="text-[10px] uppercase tracking-wide text-[#33502F] dark:text-[#82B27C]">Active</span>
            )}
            {isRecent && !isSelected && (
              <span className="text-[10px] uppercase tracking-wide text-[#B9862E] dark:text-[#E6BD6C]">New</span>
            )}
            {!unlocked && (
              <span className={`text-[11px] ${INK_FAINT}`}>
                {remaining > 0 ? `${remaining} pts to unlock` : "unlocks now"}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
