import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { completions, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getUserTimeZone, localDateStringIn } from "@/lib/timezone";
import { computeStreaks } from "@/lib/streak";
import { AppNav } from "@/components/nav/AppNav";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitCard } from "@/components/habits/HabitCard";
import { MidnightRefresher } from "@/components/habits/MidnightRefresher";
import { PAGE_BG, INK, INK_MUTED, CARD } from "@/lib/ui-classes";

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [allHabits, timeZone] = await Promise.all([
    db.select().from(habits).where(eq(habits.userId, session.user.id)).orderBy(asc(habits.createdAt)),
    getUserTimeZone(),
  ]);

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
    list.push(String(row.completedOn));
    completedDatesByHabit.set(row.habitId, list);
  }

  // Streaks are computed against the user's *local* calendar day (set via
  // the tz cookie in TimezoneSync), not the server's UTC day.
  const today = localDateStringIn(timeZone);

  const streaksByHabit = new Map(
    allHabits.map((h) => [h.id, computeStreaks(completedDatesByHabit.get(h.id) ?? [], today)])
  );

  const active = allHabits.filter((h) => !h.archived);
  const archived = allHabits.filter((h) => h.archived);

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <AppNav userName={session.user.name ?? session.user.email} userImage={session.user.image} />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 flex flex-col gap-6">
        <MidnightRefresher />

        <div className="flex flex-col gap-1 px-1">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-3xl ${INK}`}>Your habits</h1>
          <p className={`text-sm ${INK_MUTED}`}>
            {active.length === 0
              ? "Nothing planted yet."
              : `${active.length} growing${archived.length ? `, ${archived.length} archived` : ""}.`}
          </p>
        </div>

        <AddHabitForm />

        {active.length === 0 ? (
          <div className={`${CARD} px-6 py-8 text-center`}>
            <p className={`text-sm ${INK_MUTED} m-0`}>
              Add a habit above to start your garden. Each one you keep up with will grow something in{" "}
              <span className="font-[family-name:var(--font-fraunces)] italic">/garden</span> later on.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((habit) => (
              <HabitCard key={habit.id} habit={habit} streaks={streaksByHabit.get(habit.id)!} />
            ))}
          </div>
        )}

        {archived.length > 0 && (
          <details className="group">
            <summary
              className={`text-sm ${INK_MUTED} cursor-pointer hover:text-[#21251A] dark:hover:text-[#ECE8D8] select-none px-1`}
            >
              Archived ({archived.length})
            </summary>
            <div className="flex flex-col gap-3 mt-3">
              {archived.map((habit) => (
                <HabitCard key={habit.id} habit={habit} streaks={streaksByHabit.get(habit.id)!} />
              ))}
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
