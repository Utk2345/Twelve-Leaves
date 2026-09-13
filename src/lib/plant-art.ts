// Maps catalog plant ids (see src/db/seed/index.ts) to the watercolor art in
// /public/plants. Plants without dedicated art yet fall back to their emoji.
// Every entry here must point at a distinct file — no two plants share art.
export const PLANT_IMAGE: Record<string, string> = {
  sprout: "/plants/sprout.png",
  clover: "/plants/clover.png",
  cactus: "/plants/cactus.png",
  sunflower: "/plants/sunflower.png",
  bamboo: "/plants/bamboo.png",
  tulip: "/plants/tulip.png",
  "water-lily": "/plants/water-lily.png",
  "cherry-blossom": "/plants/bloom.png",
  tree: "/plants/tree.png",
};

export function plantImageFor(plantId: string): string | undefined {
  return PLANT_IMAGE[plantId];
}

if (process.env.NODE_ENV !== "production") {
  const seen = new Map<string, string>();
  for (const [plantId, src] of Object.entries(PLANT_IMAGE)) {
    const clashingPlantId = seen.get(src);
    if (clashingPlantId) {
      throw new Error(
        `plant-art.ts: "${plantId}" and "${clashingPlantId}" both point at ${src} — every plant needs distinct art.`
      );
    }
    seen.set(src, plantId);
  }
}
