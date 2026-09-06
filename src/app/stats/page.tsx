import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTimeZone } from "@/lib/timezone";
import { getOverallStats } from "@/lib/stats";
import { getGardenGrid } from "@/lib/unlocks";
import { StatCard } from "@/components/stats/StatCard";
import { CompletionsChart } from "@/components/stats/CompletionsChart";
import { HabitStatRow } from "@/components/stats/HabitStatRow";
import { fraunces, publicSans } from "@/app/fonts";

export default async function StatsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const timeZone = await getUserTimeZone();

  const [{ totalCompletions, longestStreakOverall, habitStats, weeklyBuckets }, grid] =
    await Promise.all([
      getOverallStats(session.user.id, timeZone),
      getGardenGrid(session.user.id),
    ]);

  const unlockedCount = grid.filter((entry) => entry.unlockedAt !== null).length;
  const hasHabits = habitStats.length > 0;

  return (
    <main
      className={`${fraunces.variable} ${publicSans.variable} min-h-screen bg-[#FAF7F0] px-6 py-12 sm:px-10`}
    >
      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#24261F]">
              Your stats
            </h1>
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              {hasHabits ? "How your garden's growing." : "Nothing to show yet."}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/dashboard/habits"
              className="font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                         border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
            >
              Habits →
            </a>
            <a
              href="/garden"
              className="font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                         border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
            >
              Garden →
            </a>
          </div>
        </header>

        {!hasHabits ? (
          <div className="border-l-[3px] border-[#D8D2C2] px-5 py-6 max-w-sm">
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              Once you&apos;ve added a habit and checked it off a few times,
              your progress will show up here.
            </p>
            <a
              href="/dashboard/habits"
              className="inline-block mt-3 font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                         border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
            >
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

            <section className="flex flex-col gap-3 pt-6 border-t border-[#EAE5D6]">
              <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#24261F]">
                Completions per week
              </h2>
              <CompletionsChart buckets={weeklyBuckets} />
            </section>

            <section className="flex flex-col pt-6 border-t border-[#EAE5D6]">
              <div className="flex flex-col gap-1 mb-2">
                <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#24261F]">
                  Per habit
                </h2>
                <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
                  Completion rate against each habit&apos;s weekly target since it was created.
                </p>
              </div>
              <div className="flex flex-col divide-y divide-[#EAE5D6]">
                {habitStats.map((stat) => (
                  <HabitStatRow key={stat.habitId} stat={stat} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
