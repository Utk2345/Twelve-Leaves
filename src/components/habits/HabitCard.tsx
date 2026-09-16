"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { habits } from "@/db/schema";
import type { Streaks } from "@/lib/streak";
import { localDateString } from "@/lib/date";
import { UnlockToast, type UnlockedPlantInfo } from "@/components/garden/UnlockToast";
import { CARD, INK, INK_MUTED, INK_FAINT, DANGER, GOLD, BTN_PRIMARY } from "@/lib/ui-classes";

type Habit = typeof habits.$inferSelect;

export function HabitCard({ habit, streaks }: { habit: Habit; streaks: Streaks }) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [isMarking, setIsMarking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [targetPerWeek, setTargetPerWeek] = useState(habit.targetPerWeek);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedPlantInfo[]>([]);

  async function patch(body: Record<string, unknown>) {
    setError(null);
    const res = await fetch(`/api/habits/${habit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't save that change.");
      return false;
    }
    startTransition(() => router.refresh());
    return true;
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await patch({ name, targetPerWeek });
    if (ok) setIsEditing(false);
  }

  async function handleArchiveToggle() {
    await patch({ archived: !habit.archived });
  }

  async function handleDelete() {
    setError(null);
    const res = await fetch(`/api/habits/${habit.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't remove that habit.");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function handleMarkDone() {
    setError(null);
    setIsMarking(true);
    const res = await fetch("/api/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: habit.id, completedOn: localDateString() }),
    });
    setIsMarking(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't mark that done.");
      return;
    }
    const data = await res.json().catch(() => null);
    if (data?.newlyUnlocked?.length) {
      setNewlyUnlocked(data.newlyUnlocked);
    }
    startTransition(() => router.refresh());
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="rounded-[22px] bg-[#FFFEFB] dark:bg-[#1C2717] border border-[#F5E3BD] dark:border-[#37301B]
                   px-5 py-4 flex flex-col gap-3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`font-(family-name:--font-fraunces) text-lg ${INK}
                      bg-transparent border-b border-[#D8D2C2] dark:border-[#333B27]
                      focus:border-[#33502F] dark:focus:border-[#82B27C] outline-none py-1`}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <label className={`text-xs ${INK_MUTED}`}>Times per week</label>
          <input
            type="number"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            className={`w-14 text-sm bg-transparent ${INK}
                        border-b border-[#D8D2C2] dark:border-[#333B27]
                        focus:border-[#33502F] dark:focus:border-[#82B27C] outline-none text-center`}
          />
        </div>
        {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending || name.trim().length === 0}
            className={`text-sm font-medium rounded-full px-4 py-2 disabled:opacity-40 ${BTN_PRIMARY}`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setName(habit.name);
              setTargetPerWeek(habit.targetPerWeek);
              setError(null);
            }}
            className={`text-sm ${INK_MUTED} hover:text-[#21251A] dark:hover:text-[#ECE8D8]`}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`group relative ${CARD} px-5 py-4 flex flex-col gap-3 ${habit.archived ? "opacity-70" : ""}`}>
      {/* UnlockToast animates itself (it's position: fixed — animating a
          wrapper around it instead would make the wrapper the toast's new
          containing block and break the fixed positioning). */}
      <AnimatePresence>
        {newlyUnlocked.length > 0 && (
          <UnlockToast key="unlock-toast" plants={newlyUnlocked} onDismiss={() => setNewlyUnlocked([])} />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <span
            className={`mt-0.5 w-9 h-9 shrink-0 rounded-full flex items-center justify-center
                        ${habit.archived ? "bg-[#EEE8D6] dark:bg-[#24311C] text-[#8B8A72]" : "bg-[#DCE8CB] text-[#33502F] dark:bg-[#2B3A22] dark:text-[#9AC286]"}`}
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z" />
              <path d="M12 21c0-6-4-10-8-11 1 6 4 10 8 11Z" />
            </svg>
          </span>

          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3
                className={`font-(family-name:--font-fraunces) text-lg truncate ${
                  habit.archived ? "text-[#8B8A72] line-through" : INK
                }`}
              >
                {habit.name}
              </h3>
              <AnimatePresence mode="wait">
                {!habit.archived && streaks.current > 0 && (
                  <motion.span
                    key={streaks.current}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`font-(family-name:--font-fraunces) italic text-sm ${GOLD}`}
                  >
                    {streaks.current}-day streak
                    {streaks.longest > streaks.current ? ` (best ${streaks.longest})` : ""}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1" aria-label={`Target ${habit.targetPerWeek} times a week`}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i < habit.targetPerWeek ? "bg-[#86A971] dark:bg-[#9AC286]" : "bg-[#E7E2D2] dark:bg-[#2B3A22]"
                  }`}
                />
              ))}
              <span className={`text-xs ${INK_MUTED} ml-1.5`}>{habit.targetPerWeek}x / week</span>
            </div>
            {error && <p className={`text-xs ${DANGER} m-0`}>{error}</p>}
          </div>
        </div>

        {!habit.archived && (
          <button
            onClick={handleMarkDone}
            disabled={isMarking || isPending || streaks.completedToday}
            className={`shrink-0 self-start sm:self-auto text-sm font-medium rounded-full px-4 py-2
                        transition-colors disabled:cursor-default ${
                          streaks.completedToday
                            ? "bg-[#DCE8CB] text-[#33502F] dark:bg-[#2B3A22] dark:text-[#9AC286]"
                            : `${BTN_PRIMARY} disabled:opacity-40`
                        }`}
          >
            {streaks.completedToday ? "Done today ✓" : isMarking ? "Marking…" : "Mark done today"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 self-end pl-[52px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className={`text-xs ${INK_MUTED} hover:text-[#21251A] dark:hover:text-[#ECE8D8]`}
        >
          Edit
        </button>
        <button
          onClick={handleArchiveToggle}
          disabled={isPending}
          className={`text-xs ${INK_MUTED} hover:text-[#21251A] dark:hover:text-[#ECE8D8]`}
        >
          {habit.archived ? "Restore" : "Archive"}
        </button>
        {confirmingDelete ? (
          <span className="flex items-center gap-2">
            <button onClick={handleDelete} disabled={isPending} className={`text-xs font-medium ${DANGER}`}>
              Confirm
            </button>
            <button onClick={() => setConfirmingDelete(false)} className={`text-xs ${INK_MUTED}`}>
              Never mind
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className={`text-xs ${INK_MUTED} hover:text-[#A3492E] dark:hover:text-[#E0715A]`}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
