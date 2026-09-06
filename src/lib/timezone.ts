import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const TIMEZONE_COOKIE = "tz";

function validateOrFallback(tz: string | undefined): string {
  if (!tz) return "UTC";
  try {
    // Throws on an invalid IANA zone name.
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

/** The visitor's IANA timezone from their cookie (Server Components). Falls back to UTC. */
export async function getUserTimeZone(): Promise<string> {
  const store = await cookies();
  return validateOrFallback(store.get(TIMEZONE_COOKIE)?.value);
}

/** Same as getUserTimeZone, but for Route Handlers reading off a NextRequest. */
export function getUserTimeZoneFromRequest(req: NextRequest): string {
  return validateOrFallback(req.cookies.get(TIMEZONE_COOKIE)?.value);
}

/** "Today" as YYYY-MM-DD in the given IANA timezone — matches the date columns' format. */
export function localDateStringIn(timeZone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
}
