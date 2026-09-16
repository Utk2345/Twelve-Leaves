import Image from "next/image";
import type { PlantStage as Stage } from "@/lib/plant-stage";

// Real watercolor illustrations (see /public/plants). `sprout.png` already
// has its own soil mound baked into the artwork, so we skip drawing a second
// one underneath it — seed and bloom get the shared soil ellipse instead.
const STAGE_IMAGE: Record<Stage, { src: string; width: number; height: number; hasOwnGround?: boolean }> = {
  seed: { src: "/plants/seed.png", width: 150, height: 120 },
  sprout: { src: "/plants/sprout.png", width: 180, height: 180, hasOwnGround: true },
  bloom: { src: "/plants/bloom.png", width: 160, height: 220 },
};

export function PlantStage({
  stage,
  overrideImageSrc,
}: {
  stage: Stage;
  /** Swap in a specific unlocked plant's art at the bloom stage (see the
   * tap-to-choose picker in the garden grid). Ignored at seed/sprout. */
  overrideImageSrc?: string;
}) {
  const img = STAGE_IMAGE[stage];
  const src = stage === "bloom" && overrideImageSrc ? overrideImageSrc : img.src;

  return (
    <div className="relative w-48 h-52 sm:w-56 sm:h-60 flex items-end justify-center" aria-hidden="true">
      {!img.hasOwnGround && (
        <svg viewBox="0 0 200 220" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <ellipse cx="100" cy="196" rx="70" ry="14" className="fill-[#A98B68]" opacity={0.9} />
        </svg>
      )}
      <Image
        src={src}
        alt=""
        width={img.width}
        height={img.height}
        priority={stage === "bloom"}
        className="relative z-10 object-contain drop-shadow-[0_10px_14px_rgba(40,36,20,0.18)]"
        style={{ maxHeight: "88%", maxWidth: "80%", width: "auto", height: "auto" }}
      />
    </div>
  );
}
