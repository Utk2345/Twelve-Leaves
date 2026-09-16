import Image from "next/image";
import type { DailyBucket } from "@/lib/dashboard";

export function StreakHeroCard({
  streak,
  dailyBuckets,
  today,
}: {
  streak: number;
  dailyBuckets: DailyBucket[];
  today: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] p-5 flex flex-col items-center gap-2 text-center
                 text-[#ECE8D8] bg-[#16210F] dark:bg-[#0D140A]
                 shadow-[0_18px_40px_-18px_rgba(20,30,15,0.55)]"
      style={{
        backgroundImage: "url(/card-gradient.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="text-xs font-medium text-[#C7C4AE]">Current streak</span>

      <div className="relative w-14 h-14 flex items-center justify-center">
        <Image src="/streak-flame.webp" alt="" width={40} height={40} className="relative object-contain" />
      </div>

      <span className="font-(family-name:--font-fraunces) text-4xl leading-none">{streak}</span>
      <span className="text-xs text-[#C7C4AE] -mt-1">{streak === 1 ? "day" : "days"}</span>
      <span className="font-(family-name:--font-fraunces) italic text-sm text-[#D9A544]">
        {streak > 0 ? "Keep going!" : "Mark a habit done to start one"}
      </span>

      <div className="flex gap-1 mt-1">
        {dailyBuckets.map((bucket) => (
          <span
            key={bucket.date}
            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] border ${
              bucket.count > 0
                ? "bg-[#86A971] border-[#86A971] text-[#16210F]"
                : bucket.date === today
                  ? "border-[#D9A544] text-[#D9A544]"
                  : "border-white/15 text-[#C7C4AE]"
            }`}
          >
            {bucket.label[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
