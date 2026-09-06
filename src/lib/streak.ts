/**
 * Streak math for a single habit, given its completion dates.
 *
 * Streaks are calendar-day based (consecutive days with a completion),
 * independent of the habit's weekly target. A streak is "current" if the
 * most recent completion was today or yesterday — one missed day breaks it.
 *
 * `today` should be passed in as the user's *local* date (see
 * lib/timezone.ts) — it defaults to the server's UTC date only as a
 * fallback for callers (tests, scripts) that don't have a timezone handy.
 */

export type Streaks = {
  current: number;
  longest: number;
  completedToday: boolean;
};

function toUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function computeStreaks(
  completedDates: string[],
  today: string = todayUTC()
): Streaks {
  const uniqueSorted = Array.from(new Set(completedDates)).sort();

  if (uniqueSorted.length === 0) {
    return { current: 0, longest: 0, completedToday: false };
  }

  const dates = uniqueSorted.map(toUTCDate);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    run = daysBetween(dates[i - 1], dates[i]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const todayDate = toUTCDate(today);
  const last = dates[dates.length - 1];
  const gapFromToday = daysBetween(last, todayDate);

  let current = 0;
  if (gapFromToday <= 1) {
    current = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      if (daysBetween(dates[i - 1], dates[i]) === 1) current += 1;
      else break;
    }
  }

  return {
    current,
    longest,
    completedToday: uniqueSorted.includes(today),
  };
}
