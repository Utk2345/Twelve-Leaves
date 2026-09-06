"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { habits } from "@/db/schema";
import type { Streaks } from "@/lib/streak";
import { localDateString } from "@/lib/date";
import { UnlockToast, type UnlockedPlantInfo } from "@/components/garden/UnlockToast";

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
        className="border-l-[3px] border-[#B98A2E] bg-white/60 px-5 py-4 flex flex-col gap-3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-(family-name:--font-fraunces) text-lg text-[#24261F]
                     bg-transparent border-b border-[#D8D2C2] focus:border-[#2B4635]
                     outline-none py-1"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <label className="font-(family-name:--font-public-sans) text-xs text-[#5B5744]">
            Times per week
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            className="w-14 font-(family-name:--font-public-sans) text-sm bg-transparent
                       border-b border-[#D8D2C2] focus:border-[#2B4635] outline-none text-center"
          />
        </div>
        {error && (
          <p className="font-(family-name:--font-public-sans) text-sm text-[#A3492E]">
            {error}
          </p>
        )}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending || name.trim().length === 0}
            className="font-(family-name:--font-public-sans) text-sm font-medium
                       bg-[#2B4635] text-[#FAF7F0] px-4 py-1.5 disabled:opacity-40
                       hover:bg-[#1F3427] transition-colors"
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
            className="font-(family-name:--font-public-sans) text-sm text-[#5B5744] hover:text-[#24261F]"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`group border-l-[3px] ${
        habit.archived ? "border-[#D8D2C2]" : "border-[#7C9473]"
      } px-5 py-4 flex flex-col gap-3`}
    >
      {/* UnlockToast animates itself (it's position: fixed — animating a
          wrapper around it instead would make the wrapper the toast's new
          containing block and break the fixed positioning). */}
      <AnimatePresence>
        {newlyUnlocked.length > 0 && (
          <UnlockToast
            key="unlock-toast"
            plants={newlyUnlocked}
            onDismiss={() => setNewlyUnlocked([])}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3
              className={`font-(family-name:--font-fraunces) text-lg truncate ${
                habit.archived ? "text-[#8A8672] line-through" : "text-[#24261F]"
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
                  className="font-(family-name:--font-fraunces) italic text-sm text-[#B98A2E]"
                >
                  {streaks.current}-day streak
                  {streaks.longest > streaks.current ? ` (best ${streaks.longest})` : ""}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div
            className="flex items-center gap-1"
            aria-label={`Target ${habit.targetPerWeek} times a week`}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i < habit.targetPerWeek ? "bg-[#7C9473]" : "bg-[#E7E2D2]"
                }`}
              />
            ))}
            <span className="font-(family-name:--font-public-sans) text-xs text-[#5B5744] ml-1.5">
              {habit.targetPerWeek}x / week
            </span>
          </div>
          {error && (
            <p className="font-(family-name:--font-public-sans) text-xs text-[#A3492E]">
              {error}
            </p>
          )}
        </div>

        {!habit.archived && (
          <button
            onClick={handleMarkDone}
            disabled={isMarking || isPending || streaks.completedToday}
            className={`shrink-0 self-start sm:self-auto font-(family-name:--font-public-sans) text-sm font-medium px-3 py-1.5
                        transition-colors disabled:cursor-default ${
                          streaks.completedToday
                            ? "bg-[#EAE5D6] text-[#5B5744]"
                            : "bg-[#2B4635] text-[#FAF7F0] hover:bg-[#1F3427] disabled:opacity-40"
                        }`}
          >
            {streaks.completedToday ? "Done today ✓" : isMarking ? "Marking…" : "Mark done today"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 self-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="font-(family-name:--font-public-sans) text-xs text-[#5B5744] hover:text-[#24261F]"
        >
          Edit
        </button>
        <button
          onClick={handleArchiveToggle}
          disabled={isPending}
          className="font-(family-name:--font-public-sans) text-xs text-[#5B5744] hover:text-[#24261F]"
        >
          {habit.archived ? "Restore" : "Archive"}
        </button>
        {confirmingDelete ? (
          <span className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="font-(family-name:--font-public-sans) text-xs font-medium text-[#A3492E]"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="font-(family-name:--font-public-sans) text-xs text-[#5B5744]"
            >
              Never mind
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="font-(family-name:--font-public-sans) text-xs text-[#5B5744] hover:text-[#A3492E]"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
