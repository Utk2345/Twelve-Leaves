import type { HabitStat } from "@/lib/stats";
import { INK, INK_MUTED, INK_FAINT, TRACK, TRACK_FILL } from "@/lib/ui-classes";

export function HabitStatRow({ stat }: { stat: HabitStat }) {
  const pct = Math.round(stat.completionRate * 100);

  return (
    <div className="flex flex-col gap-2 py-4 px-1">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-(family-name:--font-fraunces) text-base truncate ${
            stat.archived ? "text-[#8B8A72] line-through" : INK
          }`}
        >
          {stat.name}
        </span>
        <span className={`text-xs ${INK_MUTED} shrink-0`}>{pct}% of target</span>
      </div>

      <div className={`h-1.5 w-full rounded-full overflow-hidden ${TRACK}`} aria-hidden="true">
        <div className={`h-full rounded-full ${TRACK_FILL}`} style={{ width: `${pct}%` }} />
      </div>

      <div className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] ${INK_FAINT}`}>
        <span>
          {stat.totalCompletions} completion{stat.totalCompletions === 1 ? "" : "s"}
        </span>
        <span aria-hidden="true">·</span>
        <span>Best streak {stat.longestStreak}</span>
        {stat.currentStreak > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-[#B9862E] dark:text-[#E6BD6C]">{stat.currentStreak}-day streak now</span>
          </>
        )}
      </div>
    </div>
  );
}
