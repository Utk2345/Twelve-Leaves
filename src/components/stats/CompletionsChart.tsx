import type { WeeklyBucket } from "@/lib/stats";

// A basic bar chart built from flex/CSS bars rather than SVG or a charting
// library — matches the other hand-built indicators already in the app
// (streak dots, stage progress dashes) and needs no new dependency.
export function CompletionsChart({ buckets }: { buckets: WeeklyBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5 sm:gap-3 h-28">
        {buckets.map((bucket) => {
          const heightPct = Math.max(Math.round((bucket.count / max) * 100), bucket.count > 0 ? 8 : 0);
          return (
            <div
              key={bucket.weekStart}
              className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
            >
              <span className="font-(family-name:--font-public-sans) text-[11px] text-[#8A8672] tabular-nums">
                {bucket.count > 0 ? bucket.count : ""}
              </span>
              <div
                className={`w-full rounded-t-sm ${bucket.count > 0 ? "bg-[#7C9473]" : "bg-[#E7E2D2]"}`}
                style={{ height: bucket.count > 0 ? `${heightPct}%` : "2px" }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-start gap-1.5 sm:gap-3 mt-2">
        {buckets.map((bucket) => (
          <span
            key={bucket.weekStart}
            className="flex-1 text-center font-(family-name:--font-public-sans) text-[10px] text-[#8A8672] truncate"
          >
            {bucket.label}
          </span>
        ))}
      </div>
      <p className="sr-only">
        Completions per week:{" "}
        {buckets.map((b) => `${b.label}: ${b.count}`).join(", ")}
      </p>
    </div>
  );
}
