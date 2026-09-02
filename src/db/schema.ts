import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- users ----------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- habits ----------
export const habits = pgTable("habits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetPerWeek: integer("target_per_week").notNull().default(7),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  archived: boolean("archived").notNull().default(false),
});

// ---------- completions ----------
// One row per habit per day it was completed. `completedOn` + `habitId`
// unique together so a habit can't be double-counted on the same day.
export const completions = pgTable(
  "completions",
  {
    id: text("id").primaryKey(),
    habitId: text("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    completedOn: date("completed_on").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("completions_habit_day_unique").on(
      table.habitId,
      table.completedOn
    ),
  ]
);

// ---------- garden state ----------
// One row per user tracking their running growth score.
export const gardenState = pgTable("garden_state", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  growthPoints: integer("growth_points").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- plants ----------
// Static catalog of unlockable plants, seeded once.
export const plants = pgTable("plants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  unlockThreshold: integer("unlock_threshold").notNull(),
  emoji: text("emoji").notNull(),
});

// ---------- unlocked plants ----------
export const unlockedPlants = pgTable(
  "unlocked_plants",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plantId: text("plant_id")
      .notNull()
      .references(() => plants.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.plantId] })]
);

// ---------- relations (for convenient Drizzle query API joins) ----------
export const usersRelations = relations(users, ({ many, one }) => ({
  habits: many(habits),
  gardenState: one(gardenState, {
    fields: [users.id],
    references: [gardenState.userId],
  }),
  unlockedPlants: many(unlockedPlants),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.id] }),
  completions: many(completions),
}));

export const completionsRelations = relations(completions, ({ one }) => ({
  habit: one(habits, {
    fields: [completions.habitId],
    references: [habits.id],
  }),
}));

export const plantsRelations = relations(plants, ({ many }) => ({
  unlockedBy: many(unlockedPlants),
}));

export const unlockedPlantsRelations = relations(
  unlockedPlants,
  ({ one }) => ({
    user: one(users, {
      fields: [unlockedPlants.userId],
      references: [users.id],
    }),
    plant: one(plants, {
      fields: [unlockedPlants.plantId],
      references: [plants.id],
    }),
  })
);
