import { CARD, INK, INK_MUTED } from "@/lib/ui-classes";

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
    <div className={`${CARD} flex flex-col items-center text-center gap-1 px-4 py-5`}>
      <span className={`font-(family-name:--font-fraunces) text-2xl sm:text-3xl ${INK}`}>{value}</span>
      <span className={`text-xs font-medium ${INK_MUTED}`}>
        {label}
        {sublabel ? ` (${sublabel})` : ""}
      </span>
    </div>
  );
}
