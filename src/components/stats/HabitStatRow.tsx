import type { HabitStat } from "@/lib/stats";

export function HabitStatRow({ stat }: { stat: HabitStat }) {
  const pct = Math.round(stat.completionRate * 100);

  return (
    <div className="flex flex-col gap-1.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-(family-name:--font-fraunces) text-base truncate ${
            stat.archived ? "text-[#8A8672] line-through" : "text-[#24261F]"
          }`}
        >
          {stat.name}
        </span>
        <span className="font-(family-name:--font-public-sans) text-xs text-[#5B5744] shrink-0">
          {pct}% of target
        </span>
      </div>

      <div className="h-1.5 w-full bg-[#E7E2D2] overflow-hidden" aria-hidden="true">
        <div className="h-full bg-[#7C9473]" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-(family-name:--font-public-sans) text-[11px] text-[#8A8672]">
        <span>
          {stat.totalCompletions} completion{stat.totalCompletions === 1 ? "" : "s"}
        </span>
        <span aria-hidden="true">·</span>
        <span>Best streak {stat.longestStreak}</span>
        {stat.currentStreak > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-[#B98A2E]">{stat.currentStreak}-day streak now</span>
          </>
        )}
      </div>
    </div>
  );
}
