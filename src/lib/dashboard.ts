import "server-only";

import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { completions, gardenState as gardenStateTable, habits } from "@/db/schema";
import { computeStreaks } from "@/lib/streak";
import { getPlantStage, pointsToNextStage, type PlantStage } from "@/lib/growth";
import { getGardenGrid } from "@/lib/unlocks";

export type TodayHabit = {
  id: string;
  name: string;
  targetPerWeek: number;
  completedToday: boolean;
  currentStreak: number;
};

export type DailyBucket = {
  date: string; // YYYY-MM-DD
  label: string; // "Mon".."Sun"
  count: number;
};

export type DashboardData = {
  todayHabits: TodayHabit[];
  todayCompletedCount: number;
  totalActiveHabits: number;
  maxCurrentStreak: number;
  totalCompletions: number;
  growthPoints: number;
  plantStage: PlantStage;
  selectedPlantId: string | null;
  pointsToNext: number | null;
  unlockedCount: number;
  totalPlants: number;
  dailyBuckets: DailyBucket[];
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `d`, treating weeks as Mon–Sun. */
function mondayOf(d: Date): Date {
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diffToMonday);
  return monday;
}

/**
 * Everything the dashboard needs, in one pass: today's habit checklist,
 * the longest currently-active streak (not longest-ever — this is a "keep
 * it going" indicator, not a stats-page record), all-time completions,
 * the garden snapshot, and a Mon–Sun daily chart for the current week.
 */
export async function getDashboardData(userId: string, today: string): Promise<DashboardData> {
  const [allHabits, gardenRows, grid] = await Promise.all([
    db.select().from(habits).where(eq(habits.userId, userId)),
    db.select().from(gardenStateTable).where(eq(gardenStateTable.userId, userId)),
    getGardenGrid(userId),
  ]);

  const activeHabits = allHabits.filter((h) => !h.archived);
  const habitIds = allHabits.map((h) => h.id);

  const rows = habitIds.length
    ? await db
        .select({ habitId: completions.habitId, completedOn: completions.completedOn })
        .from(completions)
        .where(inArray(completions.habitId, habitIds))
    : [];

  const datesByHabit = new Map<string, string[]>();
  for (const row of rows) {
    const list = datesByHabit.get(row.habitId) ?? [];
    list.push(String(row.completedOn));
    datesByHabit.set(row.habitId, list);
  }

  let totalCompletions = 0;
  for (const habit of allHabits) {
    totalCompletions += (datesByHabit.get(habit.id) ?? []).length;
  }

  let maxCurrentStreak = 0;
  let todayCompletedCount = 0;
  const todayHabits: TodayHabit[] = activeHabits.map((habit) => {
    const dates = datesByHabit.get(habit.id) ?? [];
    const streaks = computeStreaks(dates, today);
    maxCurrentStreak = Math.max(maxCurrentStreak, streaks.current);
    if (streaks.completedToday) todayCompletedCount += 1;
    return {
      id: habit.id,
      name: habit.name,
      targetPerWeek: habit.targetPerWeek,
      completedToday: streaks.completedToday,
      currentStreak: streaks.current,
    };
  });

  const monday = mondayOf(toUTCDate(today));
  const dayDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    dayDates.push(toDateString(d));
  }
  const countsByDate = new Map(dayDates.map((d) => [d, 0]));
  for (const row of rows) {
    const dateStr = String(row.completedOn);
    if (countsByDate.has(dateStr)) {
      countsByDate.set(dateStr, (countsByDate.get(dateStr) ?? 0) + 1);
    }
  }
  const dailyBuckets: DailyBucket[] = dayDates.map((d, i) => ({
    date: d,
    label: DAY_LABELS[i],
    count: countsByDate.get(d) ?? 0,
  }));

  const growthPoints = gardenRows[0]?.growthPoints ?? 0;

  return {
    todayHabits,
    todayCompletedCount,
    totalActiveHabits: activeHabits.length,
    maxCurrentStreak,
    totalCompletions,
    growthPoints,
    plantStage: getPlantStage(growthPoints),
    selectedPlantId: gardenRows[0]?.selectedPlantId ?? null,
    pointsToNext: pointsToNextStage(growthPoints),
    unlockedCount: grid.filter((entry) => entry.unlockedAt !== null).length,
    totalPlants: grid.length,
    dailyBuckets,
  };
}
