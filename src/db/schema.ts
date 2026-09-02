// Drizzle schema for Habit Garden.
// Session 0: stub file so drizzle-kit has something to point at.
// Session 1 will fill this in with the real tables:
//   users, habits, completions, gardenState, plants, unlockedPlants

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Placeholder table so `drizzle-kit push` has at least one table to work with.
// Safe to replace entirely in Session 1.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
