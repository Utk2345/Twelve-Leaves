import { and, eq, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import { plants, unlockedPlants } from "@/db/schema";

export type Plant = typeof plants.$inferSelect;

/**
 * Given a user's current growthPoints, unlock every catalog plant whose
 * unlockThreshold has been reached and that isn't already unlocked for
 * them. Handles crossing multiple thresholds in one jump (e.g. a big
 * streak-bonus completion vaulting past two thresholds at once).
 *
 * Returns only the plants newly unlocked by *this* call — empty array if
 * nothing crossed. Safe to call after every point award, including
 * idempotent ones (it's a no-op if nothing new qualifies).
 */
export async function unlockEligiblePlants(
  userId: string,
  growthPoints: number
): Promise<Plant[]> {
  const eligible = await db
    .select()
    .from(plants)
    .where(lte(plants.unlockThreshold, growthPoints));

  if (eligible.length === 0) return [];

  const already = await db
    .select({ plantId: unlockedPlants.plantId })
    .from(unlockedPlants)
    .where(
      and(
        eq(unlockedPlants.userId, userId),
        inArray(
          unlockedPlants.plantId,
          eligible.map((p) => p.id)
        )
      )
    );
  const alreadyIds = new Set(already.map((r) => r.plantId));

  const newlyEligible = eligible.filter((p) => !alreadyIds.has(p.id));
  if (newlyEligible.length === 0) return [];

  await db
    .insert(unlockedPlants)
    .values(newlyEligible.map((p) => ({ userId, plantId: p.id })))
    // Defensive: if a concurrent request already inserted one of these
    // (two completions landing at once), don't error, just skip it.
    .onConflictDoNothing();

  return newlyEligible;
}

/** All catalog plants plus each one's unlocked state for this user, ordered by threshold. */
export async function getGardenGrid(userId: string) {
  const [allPlants, unlocked] = await Promise.all([
    db.select().from(plants).orderBy(plants.unlockThreshold),
    db
      .select({ plantId: unlockedPlants.plantId, unlockedAt: unlockedPlants.unlockedAt })
      .from(unlockedPlants)
      .where(eq(unlockedPlants.userId, userId)),
  ]);

  const unlockedMap = new Map(unlocked.map((u) => [u.plantId, u.unlockedAt]));

  return allPlants.map((plant) => ({
    plant,
    unlockedAt: unlockedMap.get(plant.id) ?? null,
  }));
}
