import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { completions, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createCompletionSchema } from "@/lib/validations/completion";
import { computeStreaks } from "@/lib/streak";
import { addGrowthPoints, computeGrowthPoints } from "@/lib/growth";
import { unlockEligiblePlants } from "@/lib/unlocks";
import { getUserTimeZoneFromRequest, localDateStringIn } from "@/lib/timezone";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

// POST /api/completions — mark a habit complete for a given day (defaults
// to the caller's local today). Idempotent: calling it twice for the same
// habit + day never creates a duplicate row, it just returns the existing one.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Per-user, not per-IP — this is an authenticated endpoint, and the risk
  // is a signed-in user (or a compromised session) scripting rapid calls to
  // farm growth points, not anonymous abuse. 30/min is generous for genuine
  // use (PRD scopes habit counts to roughly 3–10 concurrent) while still
  // capping a scripted loop.
  const rateLimit = await checkRateLimit(`completions:${session.user.id}`, {
    windowSeconds: 60,
    max: 30,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const body = await req.json().catch(() => null);
  const parsed = createCompletionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { habitId } = parsed.data;
  // HabitCard always sends its own local date, so this fallback rarely
  // fires — but if it ever does (other callers, tests, a future mobile
  // client), fall back to the visitor's local day via their tz cookie
  // rather than UTC, for the same reason streaks do.
  const completedOn =
    parsed.data.completedOn ?? localDateStringIn(getUserTimeZoneFromRequest(req));

  // Confirm the habit belongs to the caller before writing anything.
  const [habit] = await db
    .select({ id: habits.id })
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)))
    .limit(1);

  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Already marked for that day — return it as-is rather than erroring.
  const [existing] = await db
    .select()
    .from(completions)
    .where(
      and(eq(completions.habitId, habitId), eq(completions.completedOn, completedOn))
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ completion: existing, alreadyDone: true });
  }

  try {
    const [created] = await db
      .insert(completions)
      .values({
        id: crypto.randomUUID(),
        habitId,
        completedOn,
      })
      .returning();

    // Streak *as of this completion* decides how many points it's worth —
    // a fresh streak's first day is worth the base amount, day 10+ is worth
    // more. Re-reading all dates (rather than reasoning about the delta) is
    // one extra query but stays correct even for out-of-order backfills.
    const dateRows = await db
      .select({ completedOn: completions.completedOn })
      .from(completions)
      .where(eq(completions.habitId, habitId));

    const streaks = computeStreaks(
      dateRows.map((r) => String(r.completedOn)),
      completedOn
    );
    const pointsAwarded = computeGrowthPoints(streaks.current);
    const growthPoints = await addGrowthPoints(session.user.id, pointsAwarded);
    const newlyUnlocked = await unlockEligiblePlants(session.user.id, growthPoints);

    return NextResponse.json(
      { completion: created, alreadyDone: false, pointsAwarded, growthPoints, newlyUnlocked },
      { status: 201 }
    );
  } catch (err: unknown) {
    // Race condition: two requests for the same habit+day landed at once
    // and the unique index rejected the second insert. Treat it the same
    // as "already done" rather than surfacing a 500.
    const [raceExisting] = await db
      .select()
      .from(completions)
      .where(
        and(eq(completions.habitId, habitId), eq(completions.completedOn, completedOn))
      )
      .limit(1);

    if (raceExisting) {
      return NextResponse.json({ completion: raceExisting, alreadyDone: true });
    }

    throw err;
  }
}
