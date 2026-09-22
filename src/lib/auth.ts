import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { nameSchema } from "@/lib/validations/profile";

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
    // Also Better Auth's own default (128) — written explicitly for the
    // same reason as useSecureCookies above. Keep in sync with
    // src/lib/validations/profile.ts's passwordSchema if you change it.
    maxPasswordLength: 128,
  },
  // Built-in abuse protection for every /api/auth/* route (sign-up,
  // sign-in, social OAuth start, change-password, etc). `/sign-in/email`
  // already gets a stricter built-in default (3 requests/10s) from Better
  // Auth itself; sign-up doesn't, so it's added explicitly below.
  //
  // storage: "database" matters here — the default ("memory") keeps counts
  // in the Node process's own RAM, which doesn't work on Vercel: each
  // invocation can land on a different serverless instance (or a fresh
  // cold start) with no shared memory, so an in-memory counter would
  // silently reset per-request and never actually limit anything. Reuses
  // the existing Neon Postgres connection — see the `rateLimit` table in
  // src/db/schema.ts — rather than adding a new Redis/Upstash dependency.
  //
  // enabled mirrors useSecureCookies' pattern above: this is Better Auth's
  // own default (on in production, off in dev so local testing isn't
  // throttled), just made explicit.
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60,
    max: 100,
    storage: "database",
    customRules: {
      "/sign-up/email": { window: 600, max: 5 },
    },
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
  databaseHooks: {
    user: {
      create: {
        // Better Auth has no built-in length cap on `name`, and this runs
        // for every account-creation path — email/password sign-up *and*
        // OAuth (where `name` comes from the provider's profile, not from
        // anything our own client-side form validates). Normalize rather
        // than reject: a signup should never fail because of the name
        // field. An empty/whitespace name (blank email-signup field, or an
        // OAuth provider that didn't send one) falls back to the email's
        // local part, mirroring the sign-in form's own default.
        before: async (user) => {
          const raw = typeof user.name === "string" ? user.name.trim() : "";
          const fallback = typeof user.email === "string" && user.email.includes("@")
            ? user.email.split("@")[0]
            : "New user";
          const name = (raw.length > 0 ? raw : fallback).slice(0, 100);
          return { data: { ...user, name } };
        },
        // Runs once, right after a brand new user record is created —
        // this is where we give every new user a starting GardenState row.
        after: async (user) => {
          const { gardenState } = await import("@/db/schema");
          await db.insert(gardenState).values({ userId: user.id }).onConflictDoNothing();
        },
      },
      update: {
        // Covers authClient.updateUser({ name }) from the profile page.
        // Unlike sign-up, this is a deliberate user edit with its own
        // client-side validation already shown in the UI, so an invalid
        // value here is rejected outright rather than silently patched —
        // this only fires if that client check is bypassed. Updates that
        // don't touch `name` (e.g. an avatar-only change) pass through.
        before: async (user) => {
          if (typeof user.name !== "string") return;
          const parsed = nameSchema.safeParse(user.name);
          if (!parsed.success) {
            throw new APIError("BAD_REQUEST", {
              message: parsed.error.issues[0]?.message ?? "That name isn't valid.",
            });
          }
          return { data: { ...user, name: parsed.data } };
        },
      },
    },
  },
});