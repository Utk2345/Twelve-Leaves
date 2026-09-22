import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Fixed-window rate limit, backed by the api_rate_limit table (see
 * src/db/schema.ts). Safe under concurrent requests: the increment-or-reset
 * decision happens inside a single INSERT ... ON CONFLICT statement, so two
 * simultaneous requests for the same key can't both read a stale count and
 * both squeak through — Postgres serializes the row-level upsert.
 *
 * @param key         Unique bucket to limit, e.g. `completions:${userId}`.
 *                     Include the identity you're limiting by (user id,
 *                     IP, etc) directly in the key.
 * @param windowSeconds  Length of the fixed window.
 * @param max         Max requests allowed within the window.
 */
export async function checkRateLimit(
  key: string,
  { windowSeconds, max }: { windowSeconds: number; max: number }
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const result = await db.execute<{ count: number; window_start: Date }>(sql`
    INSERT INTO api_rate_limit (key, count, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN api_rate_limit.window_start < now() - make_interval(secs => ${windowSeconds})
        THEN 1
        ELSE api_rate_limit.count + 1
      END,
      window_start = CASE
        WHEN api_rate_limit.window_start < now() - make_interval(secs => ${windowSeconds})
        THEN now()
        ELSE api_rate_limit.window_start
      END
    RETURNING count, window_start;
  `);

  const row = result.rows[0] as unknown as { count: number; window_start: string | Date };
  const count = Number(row.count);
  const windowStart = new Date(row.window_start);

  if (count <= max) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const elapsedSeconds = (Date.now() - windowStart.getTime()) / 1000;
  const retryAfterSeconds = Math.max(1, Math.ceil(windowSeconds - elapsedSeconds));
  return { allowed: false, retryAfterSeconds };
}

/** Standard 429 response, with a Retry-After header matching Better Auth's own convention. */
export function rateLimitResponse(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}
