import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTimeZone } from "@/lib/timezone";
import { getOverallStats } from "@/lib/stats";
import { getGardenGrid } from "@/lib/unlocks";
import { AppNav } from "@/components/nav/AppNav";
import { StatCard } from "@/components/stats/StatCard";
import { CompletionsChart } from "@/components/stats/CompletionsChart";
import { HabitStatRow } from "@/components/stats/HabitStatRow";
import { PAGE_BG, INK, INK_MUTED, CARD, LINK } from "@/lib/ui-classes";

export default async function StatsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const timeZone = await getUserTimeZone();

  const [{ totalCompletions, longestStreakOverall, habitStats, weeklyBuckets }, grid] = await Promise.all([
    getOverallStats(session.user.id, timeZone),
    getGardenGrid(session.user.id),
  ]);

  const unlockedCount = grid.filter((entry) => entry.unlockedAt !== null).length;
  const hasHabits = habitStats.length > 0;

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <AppNav userName={session.user.name ?? session.user.email} userImage={session.user.image} />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 flex flex-col gap-7">
        <div className="flex flex-col gap-1 px-1">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-3xl ${INK}`}>Your stats</h1>
          <p className={`text-sm ${INK_MUTED}`}>{hasHabits ? "How your garden's growing." : "Nothing to show yet."}</p>
        </div>

        {!hasHabits ? (
          <div className={`${CARD} px-6 py-8 max-w-sm`}>
            <p className={`text-sm ${INK_MUTED} m-0`}>
              Once you&apos;ve added a habit and checked it off a few times, your progress will show up here.
            </p>
            <a href="/dashboard/habits" className={`inline-block mt-3 text-sm font-medium ${LINK}`}>
              Add your first habit →
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                label="Longest streak"
                value={longestStreakOverall}
                sublabel={longestStreakOverall === 1 ? "day" : "days"}
              />
              <StatCard label="Total completions" value={totalCompletions} />
              <StatCard label="Plants unlocked" value={`${unlockedCount}/${grid.length}`} />
            </div>

            <section className="flex flex-col gap-3">
              <h2 className={`font-[family-name:var(--font-fraunces)] text-xl ${INK} px-1`}>
                Completions per week
              </h2>
              <CompletionsChart buckets={weeklyBuckets} />
            </section>

            <section className="flex flex-col gap-2">
              <div className="flex flex-col gap-1 px-1 mb-1">
                <h2 className={`font-[family-name:var(--font-fraunces)] text-xl ${INK}`}>Per habit</h2>
                <p className={`text-sm ${INK_MUTED}`}>
                  Completion rate against each habit&apos;s weekly target since it was created.
                </p>
              </div>
              <div className={`${CARD} px-4 sm:px-5 divide-y divide-[#EEE8D6] dark:divide-[#24311C]`}>
                {habitStats.map((stat) => (
                  <HabitStatRow key={stat.habitId} stat={stat} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
