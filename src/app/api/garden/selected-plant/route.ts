import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { gardenState, unlockedPlants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getPlantStage } from "@/lib/growth";
import { selectPlantSchema } from "@/lib/validations/garden";

// PATCH /api/garden/selected-plant — choose which unlocked catalog plant
// is shown as the "active" plant once the garden has reached bloom, or
// pass plantId: null to clear the pick and go back to the default bloom art.
// Picking a plant is gated on both bloom stage and actually having unlocked
// it, so a stale/tampered client request can't jump the gun or fake an
// unlock. Clearing has no such gate — you can always go back to default.
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = selectPlantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { plantId } = parsed.data;

  if (plantId === null) {
    await db
      .update(gardenState)
      .set({ selectedPlantId: null, updatedAt: new Date() })
      .where(eq(gardenState.userId, session.user.id));

    return NextResponse.json({ selectedPlantId: null });
  }

  const [state] = await db
    .select({ growthPoints: gardenState.growthPoints })
    .from(gardenState)
    .where(eq(gardenState.userId, session.user.id))
    .limit(1);

  if (getPlantStage(state?.growthPoints ?? 0) !== "bloom") {
    return NextResponse.json(
      { error: "Reach the bloom stage before choosing which plant to display." },
      { status: 403 }
    );
  }

  const [unlocked] = await db
    .select({ plantId: unlockedPlants.plantId })
    .from(unlockedPlants)
    .where(and(eq(unlockedPlants.userId, session.user.id), eq(unlockedPlants.plantId, plantId)))
    .limit(1);

  if (!unlocked) {
    return NextResponse.json({ error: "That plant isn't unlocked yet." }, { status: 403 });
  }

  await db
    .update(gardenState)
    .set({ selectedPlantId: plantId, updatedAt: new Date() })
    .where(eq(gardenState.userId, session.user.id));

  return NextResponse.json({ selectedPlantId: plantId });
}
