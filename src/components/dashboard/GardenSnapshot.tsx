import type { PlantStage } from "@/lib/growth";

const STAGES: PlantStage[] = ["seed", "sprout", "bloom"];

export function GardenSnapshot({
  growthPoints,
  stage,
  pointsToNext,
}: {
  growthPoints: number;
  stage: PlantStage;
  pointsToNext: number | null;
}) {
  const stageIndex = STAGES.indexOf(stage);

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
          backgroundImage:
            "radial-gradient(90% 140% at 15% 120%, color-mix(in srgb, #D9A544 30%, transparent), transparent 65%), radial-gradient(90% 140% at 85% -20%, color-mix(in srgb, #86A971 40%, transparent), transparent 60%)",
        }}
      >
        <svg className="grow-in shrink-0" width="64" height="72" viewBox="0 0 200 220" aria-hidden="true">
          <ellipse cx="100" cy="196" rx="70" ry="14" className="fill-[#33502F] dark:fill-[#82B27C]" opacity="0.2" />
          <path
            d="M100 190 C100 150 100 140 100 120"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="stroke-[#33502F] dark:stroke-[#82B27C]"
          />
          {stageIndex >= 1 && (
            <>
              <path
                d="M100 140 C80 132 70 118 74 104 C90 108 100 122 100 140 Z"
                className="fill-[#86A971] dark:fill-[#9AC286]"
              />
              <path
                d="M100 150 C120 142 130 128 126 114 C110 118 100 132 100 150 Z"
                className="fill-[#86A971] dark:fill-[#9AC286]"
              />
            </>
          )}
          {stageIndex >= 2 && <circle cx="100" cy="108" r="14" className="fill-[#D9A544] dark:fill-[#E6BD6C]" />}
        </svg>

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
