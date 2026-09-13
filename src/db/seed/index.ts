// Run with: npm run db:seed
// Inserts the starting catalog of unlockable plants.
// Safe to re-run — uses onConflictDoNothing so it won't duplicate rows.

import { db } from "../index";
import { plants } from "../schema";

const STARTER_PLANTS = [
  { id: "sprout", name: "Sprout", unlockThreshold: 0, emoji: "🌱" },
  { id: "clover", name: "Clover", unlockThreshold: 10, emoji: "🍀" },
  { id: "cactus", name: "Cactus", unlockThreshold: 20, emoji: "🌵" },
  { id: "sunflower", name: "Sunflower", unlockThreshold: 30, emoji: "🌻" },
  { id: "bamboo", name: "Bamboo", unlockThreshold: 50, emoji: "🎍" },
  { id: "tulip", name: "Tulip", unlockThreshold: 75, emoji: "🌷" },
  { id: "water-lily", name: "Water Lily", unlockThreshold: 120, emoji: "🪷" },
  { id: "cherry-blossom", name: "Cherry Blossom", unlockThreshold: 150, emoji: "🌸" },
  { id: "tree", name: "Ancient Tree", unlockThreshold: 300, emoji: "🌳" },
];

async function main() {
  console.log(`Seeding ${STARTER_PLANTS.length} plants...`);

  for (const plant of STARTER_PLANTS) {
    await db.insert(plants).values(plant).onConflictDoNothing();
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
