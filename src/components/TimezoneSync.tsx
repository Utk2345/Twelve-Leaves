"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TIMEZONE_COOKIE = "tz";

// Writes the browser's IANA timezone into a cookie so server components can
// compute "today" the way the user's calendar does, instead of defaulting
// to UTC. Refreshes once if the cookie was missing or stale (new visitor,
// or someone who traveled) so the next render uses the right date.
//
// Mount this once in the root layout — not per-page.
export function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const existing = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${TIMEZONE_COOKIE}=`))
      ?.split("=")[1];

    if (existing !== detected) {
      document.cookie = `${TIMEZONE_COOKIE}=${detected}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    }
  }, [router]);

  return null;
}
