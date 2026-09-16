import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  // Explicit, but not a behavior change: this is Better Auth's own default
  // (secure + httpOnly cookies whenever NODE_ENV === "production", which
  // Vercel sets on every deployment including previews). Written out here
  // so "session cookies are Secure in production" is a checked-in fact,
  // not an inferred one. Local `next dev` (NODE_ENV=development, http)
  // is unaffected — cookies there remain non-Secure as before.
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
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