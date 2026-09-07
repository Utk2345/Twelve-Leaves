import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gardenState, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getTheme } from "@/lib/theme";
import { getPlantStage, pointsToNextStage, STAGE_THRESHOLDS } from "@/lib/growth";
import { getGardenGrid } from "@/lib/unlocks";
import { AppNav } from "@/components/nav/AppNav";
import { PlantStageTransition } from "@/components/garden/PlantStageTransition";
import { GardenGrid } from "@/components/garden/GardenGrid";
import { PAGE_BG, INK, INK_MUTED, INK_FAINT, CARD, LINK } from "@/lib/ui-classes";

const STAGE_LABEL: Record<ReturnType<typeof getPlantStage>, string> = {
  seed: "Seed",
  sprout: "Sprout",
  bloom: "Bloom",
};

export default async function GardenPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [[state], userHabits, theme] = await Promise.all([
    db.select().from(gardenState).where(eq(gardenState.userId, session.user.id)).limit(1),
    db.select({ id: habits.id }).from(habits).where(eq(habits.userId, session.user.id)),
    getTheme(),
  ]);

  // A brand-new user with zero habits gets a dedicated empty state instead
  // of a full seed/points UI that has nothing behind it yet.
  const hasHabits = userHabits.length > 0;

  const growthPoints = state?.growthPoints ?? 0;
  const stage = getPlantStage(growthPoints);
  const remaining = pointsToNextStage(growthPoints);
  const grid = await getGardenGrid(session.user.id);
  const unlockedCount = grid.filter((e) => e.unlockedAt !== null).length;

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <AppNav theme={theme} userName={session.user.name ?? session.user.email} userImage={session.user.image} />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 flex flex-col items-center gap-7 text-center">
        <div className="flex flex-col gap-1">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-3xl ${INK}`}>Your garden</h1>
          <p className={`text-sm ${INK_MUTED}`}>
            {growthPoints} growth point{growthPoints === 1 ? "" : "s"}
            {remaining !== null && ` · ${remaining} to go until it ${stage === "seed" ? "sprouts" : "blooms"}`}
          </p>
        </div>

        {!hasHabits ? (
          <div className={`${CARD} px-6 py-8 max-w-sm`}>
            <p className={`text-sm ${INK_MUTED} m-0`}>
              Your garden is waiting. Add a habit and check it off once — that&apos;s the first growth point.
            </p>
            <a href="/dashboard/habits" className={`inline-block mt-3 text-sm font-medium ${LINK}`}>
              Add your first habit →
            </a>
          </div>
        ) : (
          <>
            <div
              className="relative rounded-[32px] px-10 py-10 flex flex-col items-center gap-4"
              style={{
                backgroundImage:
                  "radial-gradient(90% 110% at 20% 110%, color-mix(in srgb, #D9A544 25%, transparent), transparent 65%), radial-gradient(90% 110% at 80% -10%, color-mix(in srgb, #86A971 35%, transparent), transparent 60%)",
              }}
            >
              <PlantStageTransition stage={stage} />

              <div className="flex flex-col gap-2 items-center">
                <span className="font-[family-name:var(--font-fraunces)] italic text-lg text-[#33502F] dark:text-[#82B27C]">
                  {STAGE_LABEL[stage]}
                </span>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {(["seed", "sprout", "bloom"] as const).map((s) => {
                    const reached = growthPoints >= STAGE_THRESHOLDS[s];
                    return (
                      <span
                        key={s}
                        className={`h-1.5 w-8 rounded-full ${
                          reached ? "bg-[#86A971] dark:bg-[#9AC286]" : "bg-[#E7E2D2] dark:bg-[#2B3A22]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <p className={`text-sm ${INK_FAINT} max-w-sm`}>
              Marking habits done in your{" "}
              <a href="/dashboard/habits" className="underline hover:text-[#5C6150] dark:hover:text-[#AFAB92]">
                habit list
              </a>{" "}
              adds points here — the longer your streaks, the faster it grows.
            </p>

            <section className="w-full flex flex-col items-center gap-4 pt-2">
              <div className="flex flex-col gap-1">
                <h2 className={`font-[family-name:var(--font-fraunces)] text-xl ${INK}`}>Collection</h2>
                <p className={`text-sm ${INK_MUTED}`}>
                  {unlockedCount} of {grid.length} unlocked
                </p>
              </div>
              <GardenGrid entries={grid} growthPoints={growthPoints} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
