/**
 * Pure growth/stage math — no DB import, safe to import from Client
 * Components. Anything that touches the database lives in `@/lib/growth`
 * instead, which is marked `server-only` on purpose so a client import of
 * it fails loudly at build time rather than crashing in the browser.
 */

export const BASE_POINTS = 10;
export const STREAK_BONUS_PER_DAY = 1;
export const STREAK_BONUS_CAP = 20; // bonus stops growing past a 20-day streak

export function computeGrowthPoints(currentStreak: number): number {
  const bonus = Math.min(Math.max(currentStreak - 1, 0), STREAK_BONUS_CAP) * STREAK_BONUS_PER_DAY;
  return BASE_POINTS + bonus;
}

/**
 * Plant stages for the single "active" plant on /garden. This is separate
 * from the `plants` unlock catalog (Session 6) — it's just three visual
 * stages driven directly by growthPoints.
 */
export const STAGE_THRESHOLDS = {
  seed: 0,
  sprout: 15,
  bloom: 50,
} as const;

export type PlantStage = "seed" | "sprout" | "bloom";

export function getPlantStage(growthPoints: number): PlantStage {
  if (growthPoints >= STAGE_THRESHOLDS.bloom) return "bloom";
  if (growthPoints >= STAGE_THRESHOLDS.sprout) return "sprout";
  return "seed";
}

/** Points needed to reach the next stage, or null if already at the last one. */
export function pointsToNextStage(growthPoints: number): number | null {
  if (growthPoints < STAGE_THRESHOLDS.sprout) return STAGE_THRESHOLDS.sprout - growthPoints;
  if (growthPoints < STAGE_THRESHOLDS.bloom) return STAGE_THRESHOLDS.bloom - growthPoints;
  return null;
}
