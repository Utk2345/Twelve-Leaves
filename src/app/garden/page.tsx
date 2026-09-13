import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gardenState, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getPlantStage, pointsToNextStage } from "@/lib/growth";
import { getGardenGrid } from "@/lib/unlocks";
import { AppNav } from "@/components/nav/AppNav";
import { GardenInteractive } from "@/components/garden/GardenInteractive";
import { PAGE_BG, INK, INK_MUTED, CARD, LINK } from "@/lib/ui-classes";

export default async function GardenPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [[state], userHabits] = await Promise.all([
    db.select().from(gardenState).where(eq(gardenState.userId, session.user.id)).limit(1),
    db.select({ id: habits.id }).from(habits).where(eq(habits.userId, session.user.id)),
  ]);

  // A brand-new user with zero habits gets a dedicated empty state instead
  // of a full seed/points UI that has nothing behind it yet.
  const hasHabits = userHabits.length > 0;

  const growthPoints = state?.growthPoints ?? 0;
  const stage = getPlantStage(growthPoints);
  const remaining = pointsToNextStage(growthPoints);
  const grid = await getGardenGrid(session.user.id);

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <AppNav userName={session.user.name ?? session.user.email} userImage={session.user.image} />

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
          <GardenInteractive
            stage={stage}
            growthPoints={growthPoints}
            entries={grid}
            initialSelectedPlantId={state?.selectedPlantId ?? null}
          />
        )}
      </main>
    </div>
  );
}
