import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createHabitSchema } from "@/lib/validations/habit";

// GET /api/habits — list the current user's habits (active by default)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const includeArchived = req.nextUrl.searchParams.get("archived") === "true";

  const rows = await db
    .select()
    .from(habits)
    .where(
      includeArchived
        ? eq(habits.userId, session.user.id)
        : and(eq(habits.userId, session.user.id), eq(habits.archived, false))
    )
    .orderBy(asc(habits.createdAt));

  return NextResponse.json({ habits: rows });
}

// POST /api/habits — create a new habit for the current user
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createHabitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(habits)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      name: parsed.data.name,
      targetPerWeek: parsed.data.targetPerWeek,
    })
    .returning();

  return NextResponse.json({ habit: created }, { status: 201 });
}
