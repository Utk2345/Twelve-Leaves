import type { WeeklyBucket } from "@/lib/stats";
import { CARD, INK_FAINT } from "@/lib/ui-classes";

// A basic bar chart built from flex/CSS bars rather than SVG or a charting
// library — matches the other hand-built indicators already in the app.
export function CompletionsChart({ buckets }: { buckets: WeeklyBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className={`${CARD} px-5 py-5`}>
      <div className="flex items-end gap-1.5 sm:gap-3 h-28">
        {buckets.map((bucket) => {
          const heightPct = Math.max(Math.round((bucket.count / max) * 100), bucket.count > 0 ? 8 : 0);
          return (
            <div key={bucket.weekStart} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
              <span className={`text-[11px] ${INK_FAINT} tabular-nums`}>{bucket.count > 0 ? bucket.count : ""}</span>
              <div
                className={`w-full rounded-t-full ${
                  bucket.count > 0
                    ? "bg-gradient-to-t from-[#DCE8CB] to-[#86A971] dark:from-[#2B3A22] dark:to-[#9AC286]"
                    : "bg-[#DCE8CB] dark:bg-[#2B3A22]"
                }`}
                style={{ height: bucket.count > 0 ? `${heightPct}%` : "3px" }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-start gap-1.5 sm:gap-3 mt-2">
        {buckets.map((bucket) => (
          <span key={bucket.weekStart} className={`flex-1 text-center text-[10px] ${INK_FAINT} truncate`}>
            {bucket.label}
          </span>
        ))}
      </div>
      <p className="sr-only">
        Completions per week: {buckets.map((b) => `${b.label}: ${b.count}`).join(", ")}
      </p>
    </div>
  );
}
