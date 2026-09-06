export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-l-[3px] border-[#7C9473] px-4 py-3">
      <span className="font-(family-name:--font-fraunces) text-2xl sm:text-3xl text-[#24261F]">
        {value}
      </span>
      <span className="font-(family-name:--font-public-sans) text-xs text-[#5B5744]">
        {label}
        {sublabel ? ` (${sublabel})` : ""}
      </span>
    </div>
  );
}
