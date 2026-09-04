"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AddHabitForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [targetPerWeek, setTargetPerWeek] = useState(7);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, targetPerWeek }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.issues?.name?.[0] ?? data?.error ?? "Couldn't save that habit.");
      return;
    }

    setName("");
    setTargetPerWeek(7);
    setOpen(false);
    startTransition(() => router.refresh());
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-[family-name:var(--font-public-sans)] text-sm font-medium text-[#2B4635]
                   border-b border-[#2B4635] pb-0.5 hover:text-[#B98A2E] hover:border-[#B98A2E]
                   transition-colors"
      >
        + Plant a new habit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-l-[3px] border-[#7C9473] bg-white/60 px-5 py-4
                 flex flex-col gap-3 max-w-md"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-name"
          className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744]"
        >
          What habit are you growing?
        </label>
        <input
          id="habit-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning walk"
          className="font-[family-name:var(--font-fraunces)] text-lg text-[#24261F]
                     bg-transparent border-b border-[#D8D2C2] focus:border-[#2B4635]
                     outline-none py-1 placeholder:text-[#B7AF98]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-target"
          className="font-[family-name:var(--font-public-sans)] text-xs text-[#5B5744]"
        >
          Times per week: {targetPerWeek}
        </label>
        <input
          id="habit-target"
          type="range"
          min={1}
          max={7}
          value={targetPerWeek}
          onChange={(e) => setTargetPerWeek(Number(e.target.value))}
          className="accent-[#2B4635]"
        />
      </div>

      {error && (
        <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#A3492E]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={isPending || name.trim().length === 0}
          className="font-[family-name:var(--font-public-sans)] text-sm font-medium
                     bg-[#2B4635] text-[#FAF7F0] px-4 py-1.5 disabled:opacity-40
                     hover:bg-[#1F3427] transition-colors"
        >
          {isPending ? "Planting…" : "Plant it"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
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
