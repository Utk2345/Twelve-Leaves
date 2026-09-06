import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gardenState, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getPlantStage, pointsToNextStage, STAGE_THRESHOLDS } from "@/lib/growth";
import { getGardenGrid } from "@/lib/unlocks";
import { PlantStageTransition } from "@/components/garden/PlantStageTransition";
import { GardenGrid } from "@/components/garden/GardenGrid";
import { fraunces, publicSans } from "@/app/fonts";

const STAGE_LABEL: Record<ReturnType<typeof getPlantStage>, string> = {
  seed: "Seed",
  sprout: "Sprout",
  bloom: "Bloom",
};

export default async function GardenPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [state] = await db
    .select()
    .from(gardenState)
    .where(eq(gardenState.userId, session.user.id))
    .limit(1);

  // A brand-new user with zero habits gets a dedicated empty state instead
  // of a full seed/points UI that has nothing behind it yet.
  const userHabits = await db
    .select({ id: habits.id })
    .from(habits)
    .where(eq(habits.userId, session.user.id));
  const hasHabits = userHabits.length > 0;

  const growthPoints = state?.growthPoints ?? 0;
  const stage = getPlantStage(growthPoints);
  const remaining = pointsToNextStage(growthPoints);
  const grid = await getGardenGrid(session.user.id);
  const unlockedCount = grid.filter((e) => e.unlockedAt !== null).length;

  return (
    <main
      className={`${fraunces.variable} ${publicSans.variable} min-h-screen bg-[#FAF7F0] px-6 py-12 sm:px-10`}
    >
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-8 text-center">
        <header className="w-full flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#24261F]">
              Your garden
            </h1>
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              {growthPoints} growth point{growthPoints === 1 ? "" : "s"}
              {remaining !== null && ` · ${remaining} to go until it ${stage === "seed" ? "sprouts" : "blooms"}`}
            </p>
          </div>
          <a
            href="/stats"
            className="shrink-0 self-center sm:self-auto font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                       border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E] transition-colors"
          >
            View stats →
          </a>
        </header>

        {!hasHabits ? (
          <div className="border-l-[3px] border-[#D8D2C2] px-5 py-6 max-w-sm">
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              Your garden is waiting. Add a habit and check it off once —
              that&apos;s the first growth point.
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
            <PlantStageTransition stage={stage} />

            <div className="flex flex-col gap-2 items-center">
              <span className="font-[family-name:var(--font-fraunces)] italic text-lg text-[#2B4635]">
                {STAGE_LABEL[stage]}
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {(["seed", "sprout", "bloom"] as const).map((s) => {
                  const reached = growthPoints >= STAGE_THRESHOLDS[s];
                  return (
                    <span
                      key={s}
                      className={`h-1.5 w-8 ${reached ? "bg-[#7C9473]" : "bg-[#E7E2D2]"}`}
                    />
                  );
                })}
              </div>
            </div>

            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#8A8672] max-w-sm">
              Marking habits done in your{" "}
              <a href="/dashboard/habits" className="underline hover:text-[#5B5744]">
                habit list
              </a>{" "}
              adds points here — the longer your streaks, the faster it grows.
            </p>

            <section className="w-full flex flex-col items-center gap-4 pt-6 border-t border-[#EAE5D6]">
              <div className="flex flex-col gap-1">
                <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#24261F]">
                  Collection
                </h2>
                <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
                  {unlockedCount} of {grid.length} unlocked
                </p>
              </div>
              <GardenGrid entries={grid} growthPoints={growthPoints} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
