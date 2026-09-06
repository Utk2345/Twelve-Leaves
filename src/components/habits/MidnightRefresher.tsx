"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { localDateString } from "@/lib/date";

function msUntilNextLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  return next.getTime() - now.getTime();
}

// Renders nothing — just watches the clock and refreshes server data
// (habit completions, streaks) the moment the local day rolls over, so
// "done today" and streaks don't sit stale on a tab left open past midnight.
export function MidnightRefresher() {
  const router = useRouter();
  const dateRef = useRef(localDateString());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        dateRef.current = localDateString();
        router.refresh();
        scheduleNext();
      }, msUntilNextLocalMidnight());
    }
    scheduleNext();

    // setTimeout can fire late (or not at all) if the tab was backgrounded
    // or the machine slept — catch up as soon as it's visible again.
    function handleVisibility() {
      if (document.visibilityState !== "visible") return;
      const today = localDateString();
      if (today !== dateRef.current) {
        dateRef.current = today;
        router.refresh();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router]);

  return null;
}
