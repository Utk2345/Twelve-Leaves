import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { gardenState } from "@/db/schema";

// Re-exported so existing server-side imports of `@/lib/growth` keep
// working unchanged. Client Components must import these from
// `@/lib/plant-stage` directly — importing them from here (even just the
// constants) would pull this file's `db` import into the browser bundle.
export {
  BASE_POINTS,
  STREAK_BONUS_PER_DAY,
  STREAK_BONUS_CAP,
  computeGrowthPoints,
  STAGE_THRESHOLDS,
  getPlantStage,
  pointsToNextStage,
  type PlantStage,
} from "./plant-stage";

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
