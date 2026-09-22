import type { DailyBucket } from "@/lib/dashboard";

export function WeeklyChartCard({ buckets }: { buckets: DailyBucket[] }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <section className="flex flex-col gap-3 h-full">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-(family-name:--font-fraunces) text-lg text-[#21251A] dark:text-[#ECE8D8]">This week</h2>
        <a href="/stats" className="text-[13px] font-medium text-[#33502F] dark:text-[#82B27C]">
          Full stats →
        </a>
      </div>
      <div
        className="flex-1 rounded-[22px] p-5
                   bg-[#FFFEFB] dark:bg-[#1C2717]
                   shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                   dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-end gap-2.5 h-24">
          {buckets.map((b) => {
            const heightPct = Math.max(Math.round((b.count / max) * 100), b.count > 0 ? 8 : 0);
            return (
              <div key={b.date} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                <span className="text-[11px] text-[#696856] dark:text-[#757058] tabular-nums">
                  {b.count > 0 ? b.count : ""}
                </span>
                <div
                  className={`w-full rounded-t-full ${
                    b.count > 0
                      ? "bg-gradient-to-t from-[#DCE8CB] to-[#86A971] dark:from-[#2B3A22] dark:to-[#9AC286]"
                      : "bg-[#DCE8CB] dark:bg-[#2B3A22]"
                  }`}
                  style={{ height: b.count > 0 ? `${heightPct}%` : "3px" }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2.5 mt-2">
          {buckets.map((b) => (
            <span key={b.date} className="flex-1 text-center text-[10px] text-[#696856] dark:text-[#757058]">
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
