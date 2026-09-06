import { sql } from "drizzle-orm";
import { db } from "@/db";
import { gardenState } from "@/db/schema";

/**
 * Growth points: awarded once per completion (not per streak-check), using
 * the habit's *current streak as of that completion* to scale a bonus on
 * top of a flat base. A single completion is worth more the longer the
 * streak behind it — small early, meaningfully more by day 10+.
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

/**
 * Add points to a user's garden, creating the row if the Session 2
 * post-signup hook somehow didn't (defensive, shouldn't normally be needed).
 * Returns the new total.
 */
export async function addGrowthPoints(userId: string, points: number): Promise<number> {
  const [row] = await db
    .insert(gardenState)
    .values({ userId, growthPoints: points, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: gardenState.userId,
      set: {
        growthPoints: sql`${gardenState.growthPoints} + ${points}`,
        updatedAt: new Date(),
      },
    })
    .returning({ growthPoints: gardenState.growthPoints });

  return row.growthPoints;
}
