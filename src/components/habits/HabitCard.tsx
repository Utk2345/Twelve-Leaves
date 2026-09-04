"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Habit } from "@/db/schema";

export function HabitCard({ habit }: { habit: Habit }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [targetPerWeek, setTargetPerWeek] = useState(habit.targetPerWeek);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (isEditing) {
    return (
      <form
        onSubmit={handleSaveEdit}
        className="border-l-[3px] border-[#B98A2E] bg-white/60 px-5 py-4 flex flex-col gap-3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-[family-name:var(--font-fraunces)] text-lg text-[#24261F]
                     bg-transparent border-b border-[#D8D2C2] focus:border-[#2B4635]
                     outline-none py-1"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <label className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744]">
            Times per week
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            className="w-14 font-[family-name:var(--font-public-sans)] text-sm bg-transparent
                       border-b border-[#D8D2C2] focus:border-[#2B4635] outline-none text-center"
          />
        </div>
        {error && (
          <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#A3492E]">
            {error}
          </p>
        )}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending || name.trim().length === 0}
            className="font-[family-name:var(--font-public-sans)] text-sm font-medium
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
            className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744] hover:text-[#24261F]"
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
      } px-5 py-4 flex items-center justify-between gap-4`}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3
          className={`font-[family-name:var(--font-fraunces)] text-lg truncate ${
            habit.archived ? "text-[#8A8672] line-through" : "text-[#24261F]"
          }`}
        >
          {habit.name}
        </h3>
        <div className="flex items-center gap-1" aria-label={`Target ${habit.targetPerWeek} times a week`}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < habit.targetPerWeek ? "bg-[#7C9473]" : "bg-[#E7E2D2]"
              }`}
            />
          ))}
          <span className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744] ml-1.5">
            {habit.targetPerWeek}x / week
          </span>
        </div>
        {error && (
          <p className="font-[family-name:var(--font-public-sans)] text-xs text-[#A3492E]">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744] hover:text-[#24261F]"
        >
          Edit
        </button>
        <button
          onClick={handleArchiveToggle}
          disabled={isPending}
          className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744] hover:text-[#24261F]"
        >
          {habit.archived ? "Restore" : "Archive"}
        </button>
        {confirmingDelete ? (
          <span className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="font-[family-name:var(--font-public-sans)] text-xs font-medium text-[#A3492E]"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744]"
            >
              Never mind
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744] hover:text-[#A3492E]"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
