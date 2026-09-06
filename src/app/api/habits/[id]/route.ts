import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateHabitSchema } from "@/lib/validations/habit";

async function getOwnedHabit(userId: string, habitId: string) {
  const [row] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);
  return row ?? null;
}

// PATCH /api/habits/:id — edit name/target, or archive/unarchive
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await getOwnedHabit(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateHabitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ habit: existing });
  }

  const [updated] = await db
    .update(habits)
    .set(parsed.data)
    .where(eq(habits.id, id))
    .returning();

  return NextResponse.json({ habit: updated });
}

// DELETE /api/habits/:id — permanently remove a habit (and its completions, via cascade)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await getOwnedHabit(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  await db.delete(habits).where(eq(habits.id, id));

  return NextResponse.json({ ok: true });
}
