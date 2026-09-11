function greetingWord(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHero({
  name,
  today,
  completedToday,
  totalActive,
}: {
  name: string;
  today: string; // YYYY-MM-DD, visitor's local date
  completedToday: number;
  totalActive: number;
}) {
  const [y, m, d] = today.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(dateObj);
  const greeting = greetingWord(new Date().getHours());

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6 sm:p-7 flex items-center justify-between gap-5
                 shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                 dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]
                 bg-[#EEE8D6] dark:bg-[#24311C]"
      style={{
        backgroundImage:
          "radial-gradient(120% 140% at 85% -10%, color-mix(in srgb, #D9A544 35%, transparent), transparent 60%), radial-gradient(100% 120% at 10% 110%, color-mix(in srgb, #86A971 45%, transparent), transparent 65%)",
      }}
    >
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] sm:text-[30px] text-[#21251A] dark:text-[#ECE8D8] m-0">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-[#5C6150] dark:text-[#AFAB92] mt-1.5 mb-0">
          {dateLabel}
          {totalActive > 0 &&
            ` · ${completedToday} of ${totalActive} habit${totalActive === 1 ? "" : "s"} done today`}
        </p>
      </div>

      <div className="relative shrink-0">
        <svg className="grow-in" width="64" height="72" viewBox="0 0 200 220" aria-hidden="true">
          <path
            d="M100 190 C100 150 100 140 100 120"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="stroke-[#33502F] dark:stroke-[#82B27C]"
          />
          <path
            d="M100 140 C80 132 70 118 74 104 C90 108 100 122 100 140 Z"
            className="fill-[#86A971] dark:fill-[#9AC286]"
          />
          <path
            d="M100 150 C120 142 130 128 126 114 C110 118 100 132 100 150 Z"
            className="fill-[#86A971] dark:fill-[#9AC286]"
          />
        </svg>
        <div
          className="absolute -left-2 -bottom-2 w-8 h-8 rounded-full flex items-center justify-center
                     bg-[#33502F] dark:bg-[#82B27C] text-[#F5F0E2] dark:text-[#0D140A]
                     shadow-[0_10px_20px_-10px_rgba(40,36,20,0.4)]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12l5 5L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
