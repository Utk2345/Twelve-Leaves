"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CARD, INK, INK_MUTED, DANGER, BTN_PRIMARY } from "@/lib/ui-classes";
import { createHabitSchema } from "@/lib/validations/habit";

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

    const parsed = createHabitSchema.safeParse({ name, targetPerWeek });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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
        className={`self-start text-sm font-medium rounded-full px-4 py-2 ${BTN_PRIMARY}`}
      >
        + Plant a new habit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${CARD} px-5 py-5 flex flex-col gap-4 max-w-md`}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="habit-name" className={`text-xs font-medium ${INK_MUTED}`}>
          What habit are you growing?
        </label>
        <input
          id="habit-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning walk"
          maxLength={80}
          className={`font-[family-name:var(--font-fraunces)] text-lg ${INK}
                      bg-transparent border-b border-[#D8D2C2] dark:border-[#333B27]
                      focus:border-[#33502F] dark:focus:border-[#82B27C]
                      outline-none py-1 placeholder:text-[#6F674E] dark:placeholder:text-[#5C6150]`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="habit-target" className={`text-xs font-medium ${INK_MUTED}`}>
          Times per week: {targetPerWeek}
        </label>
        <input
          id="habit-target"
          type="range"
          min={1}
          max={7}
          value={targetPerWeek}
          onChange={(e) => setTargetPerWeek(Number(e.target.value))}
          className="accent-[#33502F] dark:accent-[#82B27C]"
        />
      </div>

      {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || name.trim().length === 0}
          className={`text-sm font-medium rounded-full px-4 py-2 disabled:opacity-40 ${BTN_PRIMARY}`}
        >
          {isPending ? "Planting…" : "Plant it"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
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
