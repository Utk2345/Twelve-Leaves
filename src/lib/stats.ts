import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { completions, habits } from "@/db/schema";
import { computeStreaks } from "@/lib/streak";
import { localDateStringIn } from "@/lib/timezone";

const WEEKS_BACK = 8;

export type HabitStat = {
  habitId: string;
  name: string;
  archived: boolean;
  targetPerWeek: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  /** 0..1, actual completions vs. (targetPerWeek * weeks since the habit was created), capped at 1. */
  completionRate: number;
};

export type WeeklyBucket = {
  /** Monday of the bucket's week, YYYY-MM-DD. */
  weekStart: string;
  /** Short display label, e.g. "Sep 1". */
  label: string;
  count: number;
};

export type OverallStats = {
  totalCompletions: number;
  longestStreakOverall: number;
  habitStats: HabitStat[];
  weeklyBuckets: WeeklyBucket[];
};

// Same UTC-anchored date math as lib/streak.ts, kept local here since
// streak.ts doesn't export its helpers and these are stats-specific
// (week bucketing, not streak runs).
function toUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `d`, treating weeks as Mon–Sun. */
function mondayOf(d: Date): Date {
  const day = d.getUTCDay(); // 0 (Sun) .. 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diffToMonday);
  return monday;
}

function formatWeekLabel(weekStartStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(toUTCDate(weekStartStr));
}

function buildWeekStarts(today: string, weeksBack: number): string[] {
  const thisWeekMonday = mondayOf(toUTCDate(today));
  const starts: string[] = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const d = new Date(thisWeekMonday);
    d.setUTCDate(d.getUTCDate() - i * 7);
    starts.push(toDateString(d));
  }
  return starts;
}

/**
 * Full stats payload for a user's /stats page: overall totals, per-habit
 * completion rate against their weekly target, and a rolling window of
 * weekly completion counts (across all habits) for the bar chart.
 */
export async function getOverallStats(
  userId: string,
  timeZone: string,
  weeksBack: number = WEEKS_BACK
): Promise<OverallStats> {
  const today = localDateStringIn(timeZone);
  const weekStarts = buildWeekStarts(today, weeksBack);

  const allHabits = await db.select().from(habits).where(eq(habits.userId, userId));

  if (allHabits.length === 0) {
    return {
      totalCompletions: 0,
      longestStreakOverall: 0,
      habitStats: [],
      weeklyBuckets: weekStarts.map((w) => ({ weekStart: w, label: formatWeekLabel(w), count: 0 })),
    };
  }

  const habitIds = allHabits.map((h) => h.id);
  const rows = await db
    .select({ habitId: completions.habitId, completedOn: completions.completedOn })
    .from(completions)
    .where(inArray(completions.habitId, habitIds));

  const datesByHabit = new Map<string, string[]>();
  for (const row of rows) {
    const list = datesByHabit.get(row.habitId) ?? [];
    list.push(String(row.completedOn));
    datesByHabit.set(row.habitId, list);
  }

  let totalCompletions = 0;
  let longestStreakOverall = 0;

  const habitStats: HabitStat[] = allHabits.map((habit) => {
    const dates = datesByHabit.get(habit.id) ?? [];
    totalCompletions += dates.length;

    const streaks = computeStreaks(dates, today);
    longestStreakOverall = Math.max(longestStreakOverall, streaks.longest);

    const createdOn = localDateStringIn(timeZone, habit.createdAt);
    const daysSinceCreated = Math.max(0, daysBetween(toUTCDate(createdOn), toUTCDate(today))) + 1;
    const weeksSinceCreated = Math.max(1, daysSinceCreated / 7);
    const expected = habit.targetPerWeek * weeksSinceCreated;
    const completionRate = expected > 0 ? Math.min(1, dates.length / expected) : 0;

    return {
      habitId: habit.id,
      name: habit.name,
      archived: habit.archived,
      targetPerWeek: habit.targetPerWeek,
      totalCompletions: dates.length,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      completionRate,
    };
  });

  const counts = new Map(weekStarts.map((w) => [w, 0]));
  for (const row of rows) {
    const weekStart = toDateString(mondayOf(toUTCDate(String(row.completedOn))));
    if (counts.has(weekStart)) {
      counts.set(weekStart, (counts.get(weekStart) ?? 0) + 1);
    }
  }
  const weeklyBuckets: WeeklyBucket[] = weekStarts.map((w) => ({
    weekStart: w,
    label: formatWeekLabel(w),
    count: counts.get(w) ?? 0,
  }));

  return { totalCompletions, longestStreakOverall, habitStats, weeklyBuckets };
}
