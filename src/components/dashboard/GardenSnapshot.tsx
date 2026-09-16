import Image from "next/image";
import type { PlantStage } from "@/lib/plant-stage";
import { plantImageFor } from "@/lib/plant-art";

const STAGES: PlantStage[] = ["seed", "sprout", "bloom"];

const STAGE_IMAGE: Record<PlantStage, { src: string; width: number; height: number }> = {
  seed: { src: "/plants/seed.png", width: 60, height: 48 },
  sprout: { src: "/plants/sprout.png", width: 64, height: 64 },
  bloom: { src: "/plants/bloom.png", width: 52, height: 72 },
};

export function GardenSnapshot({
  growthPoints,
  stage,
  pointsToNext,
  selectedPlantId,
}: {
  growthPoints: number;
  stage: PlantStage;
  pointsToNext: number | null;
  selectedPlantId?: string | null;
}) {
  const stageIndex = STAGES.indexOf(stage);
  const image = STAGE_IMAGE[stage];
  const src = stage === "bloom" && selectedPlantId ? (plantImageFor(selectedPlantId) ?? image.src) : image.src;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-(family-name:--font-fraunces) text-lg text-[#21251A] dark:text-[#ECE8D8]">
          Your garden
        </h2>
        <a href="/garden" className="text-[13px] font-medium text-[#33502F] dark:text-[#82B27C]">
          View garden →
        </a>
      </div>

      <div
        className="relative overflow-hidden rounded-[24px] p-6 flex items-center gap-6
                   bg-[#EEE8D6] dark:bg-[#24311C]
                   shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                   dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
        style={{
          backgroundImage: "url(/card-gradient.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          key={src}
          src={src}
          alt=""
          width={image.width}
          height={image.height}
          className="grow-in shrink-0 object-contain"
          aria-hidden="true"
        />

        <div>
          <p className="font-(family-name:--font-fraunces) text-xl text-[#21251A] dark:text-[#ECE8D8] m-0">
            {growthPoints} growth point{growthPoints === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-[#5C6150] dark:text-[#AFAB92] mt-1 mb-0 capitalize">
            {stage}
            {pointsToNext !== null &&
              ` · ${pointsToNext} to go until it ${stage === "seed" ? "sprouts" : "blooms"}`}
          </p>
          <div className="flex gap-1.5 mt-2.5" aria-hidden="true">
            {STAGES.map((s, i) => (
              <span
                key={s}
                className={`w-6 h-1.5 rounded-full ${
                  i <= stageIndex ? "bg-[#86A971] dark:bg-[#9AC286]" : "bg-white/40 dark:bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
