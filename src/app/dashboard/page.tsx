import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserTimeZone, localDateStringIn } from "@/lib/timezone";
import { getDashboardData } from "@/lib/dashboard";
import { AppNav } from "@/components/nav/AppNav";
import { GreetingHero } from "@/components/dashboard/GreetingHero";
import { ProgressRingCard } from "@/components/dashboard/ProgressRingCard";
import { StreakHeroCard } from "@/components/dashboard/StreakHeroCard";
import { PlantsCard } from "@/components/dashboard/PlantsCard";
import { TodayHabitsCard } from "@/components/dashboard/TodayHabitsCard";
import { GardenSnapshot } from "@/components/dashboard/GardenSnapshot";
import { WeeklyChartCard } from "@/components/dashboard/WeeklyChartCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const timeZone = await getUserTimeZone();
  const today = localDateStringIn(timeZone);
  const data = await getDashboardData(session.user.id, today);

  const firstName = (session.user.name ?? session.user.email).split(" ")[0];
  const quoteSeed = Number(today.slice(-2)); // day-of-month — simple, deterministic, no storage needed

  return (
    <div className="min-h-screen">
      <AppNav userName={session.user.name ?? session.user.email} userImage={session.user.image} />

      <main className="mx-auto max-w-[800px] px-4 sm:px-5 pb-24 sm:pb-8 pt-8 flex flex-col gap-7">
        <GreetingHero
          name={firstName}
          today={today}
          completedToday={data.todayCompletedCount}
          totalActive={data.totalActiveHabits}
        />

        <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1.1fr_0.9fr] gap-3.5">
          <ProgressRingCard completed={data.todayCompletedCount} total={data.totalActiveHabits} />
          <StreakHeroCard streak={data.maxCurrentStreak} dailyBuckets={data.dailyBuckets} today={today} />
          <PlantsCard unlocked={data.unlockedCount} total={data.totalPlants} />
        </div>

        <TodayHabitsCard habits={data.todayHabits} />

        <GardenSnapshot
          growthPoints={data.growthPoints}
          stage={data.plantStage}
          pointsToNext={data.pointsToNext}
          selectedPlantId={data.selectedPlantId}
        />

        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3.5 items-stretch">
          <WeeklyChartCard buckets={data.dailyBuckets} />
          <QuoteCard seed={quoteSeed} />
        </div>
      </main>
    </div>
  );
}
