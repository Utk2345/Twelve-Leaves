import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Runs once, right after a brand new user record is created —
  // this is where we give every new user a starting GardenState row.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const { gardenState } = await import("@/db/schema");
          await db.insert(gardenState).values({ userId: user.id }).onConflictDoNothing();
        },
      },
    },
  },
});