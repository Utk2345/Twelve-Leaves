import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { completions, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getUserTimeZone, localDateStringIn } from "@/lib/timezone";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitCard } from "@/components/habits/HabitCard";
import { MidnightRefresher } from "@/components/habits/MidnightRefresher";
import { computeStreaks } from "@/lib/streak";
import { fraunces, publicSans } from "@/app/fonts";

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, session.user.id))
    .orderBy(asc(habits.createdAt));

  // One query for every completion across this user's habits, grouped
  // client-side by habitId — cheaper than N queries, one per habit.
  const completionRows = await db
    .select({ habitId: completions.habitId, completedOn: completions.completedOn })
    .from(completions)
    .innerJoin(habits, eq(completions.habitId, habits.id))
    .where(eq(habits.userId, session.user.id));

  const completedDatesByHabit = new Map<string, string[]>();
  for (const row of completionRows) {
    const list = completedDatesByHabit.get(row.habitId) ?? [];
    // `date` columns come back as "YYYY-MM-DD" strings from Drizzle.
    list.push(String(row.completedOn));
    completedDatesByHabit.set(row.habitId, list);
  }

  // Streaks are computed against the user's *local* calendar day (set via
  // the tz cookie in TimezoneSync), not the server's UTC day — otherwise
  // "completed today" and streak continuity go wrong near midnight for
  // anyone outside UTC.
  const timeZone = await getUserTimeZone();
  const today = localDateStringIn(timeZone);

  const streaksByHabit = new Map(
    allHabits.map((h) => [h.id, computeStreaks(completedDatesByHabit.get(h.id) ?? [], today)])
  );

  const active = allHabits.filter((h) => !h.archived);
  const archived = allHabits.filter((h) => h.archived);

  return (
    <main
      className={`${fraunces.variable} ${publicSans.variable} min-h-screen bg-[#FAF7F0] px-6 py-12 sm:px-10`}
    >
      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <MidnightRefresher />
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#24261F]">
              Your habits
            </h1>
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              {active.length === 0
                ? "Nothing planted yet."
                : `${active.length} growing${archived.length ? `, ${archived.length} archived` : ""}.`}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/stats"
              className="font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                         border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
            >
              Stats →
            </a>
            <a
              href="/garden"
              className="font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                         border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
            >
              View garden →
            </a>
          </div>
        </header>

        <AddHabitForm />

        {active.length === 0 ? (
          <div className="border-l-[3px] border-[#D8D2C2] px-5 py-6">
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              Add a habit above to start your garden. Each one you keep up
              with will grow something in{" "}
              <span className="font-[family-name:var(--font-fraunces)] italic">
                /garden
              </span>{" "}
              later on.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#EAE5D6]">
            {active.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                streaks={streaksByHabit.get(habit.id)!}
              />
            ))}
          </div>
        )}

        {archived.length > 0 && (
          <details className="group">
            <summary className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744] cursor-pointer hover:text-[#24261F] select-none">
              Archived ({archived.length})
            </summary>
            <div className="flex flex-col divide-y divide-[#EAE5D6] mt-3">
              {archived.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  streaks={streaksByHabit.get(habit.id)!}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
