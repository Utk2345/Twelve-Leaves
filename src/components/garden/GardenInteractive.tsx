"use client";

import { useState } from "react";
import { STAGE_THRESHOLDS, type PlantStage } from "@/lib/plant-stage";
import type { Plant } from "@/lib/unlocks";
import { plantImageFor } from "@/lib/plant-art";
import { PlantStageTransition } from "./PlantStageTransition";
import { GardenGrid } from "./GardenGrid";
import { INK, INK_MUTED, INK_FAINT, DANGER } from "@/lib/ui-classes";

const STAGE_LABEL: Record<PlantStage, string> = { seed: "Seed", sprout: "Sprout", bloom: "Bloom" };

type GridEntry = { plant: Plant; unlockedAt: Date | null };

export function GardenInteractive({
  stage,
  growthPoints,
  entries,
  initialSelectedPlantId,
}: {
  stage: PlantStage;
  growthPoints: number;
  entries: GridEntry[];
  initialSelectedPlantId: string | null;
}) {
  const [selectedPlantId, setSelectedPlantId] = useState(initialSelectedPlantId);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canPick = stage === "bloom";
  const unlockedCount = entries.filter((e) => e.unlockedAt !== null).length;

  async function persist(plantId: string | null) {
    const previous = selectedPlantId;
    setSelectedPlantId(plantId);
    setPendingId(plantId ?? "__clear__");
    setError(null);

    try {
      const res = await fetch("/api/garden/selected-plant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setSelectedPlantId(previous);
      setError("Couldn't save that — try again.");
    } finally {
      setPendingId(null);
    }
  }

  // Tapping the plant that's already active clears it back to the default
  // bloom art, same as the explicit "Use default" link below.
  function handleTap(plantId: string) {
    persist(plantId === selectedPlantId ? null : plantId);
  }

  const overrideImageSrc =
    stage === "bloom" && selectedPlantId ? plantImageFor(selectedPlantId) : undefined;

  return (
    <>
      <div
        className="relative rounded-[32px] px-10 py-10 flex flex-col items-center gap-4"
        style={{
          backgroundImage: "url(/card-gradient.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <PlantStageTransition stage={stage} overrideImageSrc={overrideImageSrc} />

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
        <div className="flex flex-col gap-1 text-center">
          <h2 className={`font-[family-name:var(--font-fraunces)] text-xl ${INK}`}>Collection</h2>
          <p className={`text-sm ${INK_MUTED}`}>
            {unlockedCount} of {entries.length} unlocked
          </p>
          <p className={`text-xs ${INK_FAINT}`}>
            {canPick
              ? "Tap an unlocked plant to show it up top — tap it again, or use the link below, to clear it."
              : "Reach Bloom to choose which unlocked plant shows up top."}
          </p>
          {canPick && selectedPlantId && (
            <button
              type="button"
              onClick={() => persist(null)}
              disabled={pendingId === "__clear__"}
              className="text-xs font-medium underline text-[#33502F] dark:text-[#82B27C] disabled:opacity-50"
            >
              {pendingId === "__clear__" ? "Clearing…" : "Use default bloom instead"}
            </button>
          )}
          {error && <p className={`text-xs ${DANGER}`}>{error}</p>}
        </div>
        <GardenGrid
          entries={entries}
          growthPoints={growthPoints}
          selectable={canPick}
          selectedPlantId={selectedPlantId}
          pendingId={pendingId}
          onSelect={handleTap}
        />
      </section>
    </>
  );
}
