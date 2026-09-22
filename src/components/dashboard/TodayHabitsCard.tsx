"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { localDateString } from "@/lib/date";
import type { TodayHabit } from "@/lib/dashboard";

const CHIP_STYLES = [
  "bg-[#DCE8CB] text-[#33502F] dark:bg-[#2B3A22] dark:text-[#9AC286]",
  "bg-[#F1D7DC] text-[#8A4A57] dark:bg-[#3A2429] dark:text-[#E3B6BE]",
  "bg-[#F5E3BD] text-[#8A6A22] dark:bg-[#37301B] dark:text-[#E6BD6C]",
  "bg-[#E3DCF3] text-[#5E5088] dark:bg-[#2A2540] dark:text-[#CFC3E8]",
];

const CARD =
  "rounded-[22px] bg-[#FFFEFB] dark:bg-[#1C2717] " +
  "shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)] " +
  "dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]";

export function TodayHabitsCard({ habits }: { habits: TodayHabit[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMarkDone(habitId: string) {
    setError(null);
    setMarkingId(habitId);
    const res = await fetch("/api/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, completedOn: localDateString() }),
    });
    setMarkingId(null);
    if (!res.ok) {
      setError("Couldn't mark that done — try again.");
      return;
    }
    startTransition(() => router.refresh());
  }

  if (habits.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-(family-name:--font-fraunces) text-lg text-[#21251A] dark:text-[#ECE8D8] px-1">
          Today
        </h2>
        <div className={`${CARD} px-6 py-8 text-center`}>
          <p className="text-sm text-[#5C6150] dark:text-[#AFAB92] m-0">
            No habits yet.{" "}
            <a
              href="/dashboard/habits"
              className="font-medium text-[#33502F] dark:text-[#82B27C] underline underline-offset-2"
            >
              Add your first one →
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-(family-name:--font-fraunces) text-lg text-[#21251A] dark:text-[#ECE8D8]">Today</h2>
        <a href="/dashboard/habits" className="text-[13px] font-medium text-[#33502F] dark:text-[#82B27C]">
          All habits →
        </a>
      </div>

      {error && (
        <p className="text-sm text-[#A3492E] dark:text-[#E0715A] px-1">{error}</p>
      )}

      <div className={`${CARD} px-4 sm:px-5`}>
        {habits.map((habit, i) => (
          <div
            key={habit.id}
            className="flex items-center gap-3.5 py-3.5 border-b border-[#EEE8D6] dark:border-[#24311C] last:border-b-0"
          >
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${CHIP_STYLES[i % CHIP_STYLES.length]}`}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z" />
                <path d="M12 21c0-6-4-10-8-11 1 6 4 10 8 11Z" />
              </svg>
            </span>

            <div className="flex-1 min-w-0">
              <span className="font-(family-name:--font-fraunces) text-base text-[#21251A] dark:text-[#ECE8D8]">
                {habit.name}
              </span>
              {habit.currentStreak > 0 && (
                <span className="font-(family-name:--font-fraunces) italic text-xs text-[#8C6523] ml-1.5">
                  {habit.currentStreak}-day streak
                </span>
              )}
              <div className="text-xs text-[#696856] dark:text-[#757058] mt-0.5">{habit.targetPerWeek}x / week</div>
            </div>

            {habit.completedToday ? (
              <span className="shrink-0 flex items-center gap-1.5 text-[13px] font-medium rounded-full px-4 py-2 bg-[#DCE8CB] text-[#33502F] dark:bg-[#2B3A22] dark:text-[#9AC286]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L19 7" />
                </svg>
                Done
              </span>
            ) : (
              <button
                onClick={() => handleMarkDone(habit.id)}
                disabled={markingId === habit.id || isPending}
                className="shrink-0 text-[13px] font-medium rounded-full px-4 py-2 transition-transform
                           bg-[#33502F] text-[#F5F0E2] dark:bg-[#82B27C] dark:text-[#0D140A]
                           hover:-translate-y-px disabled:opacity-50"
              >
                {markingId === habit.id ? "Marking…" : "Mark done"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
