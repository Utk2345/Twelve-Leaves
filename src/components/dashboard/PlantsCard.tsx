export function PlantsCard({ unlocked, total }: { unlocked: number; total: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 text-center rounded-[24px] p-5
                 bg-[#FFFEFB] dark:bg-[#1C2717]
                 shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                 dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
    >
      <span className="font-(family-name:--font-fraunces) text-[28px] text-[#21251A] dark:text-[#ECE8D8]">
        {unlocked}/{total}
      </span>
      <span className="text-xs font-medium text-[#5C6150] dark:text-[#AFAB92]">Plants unlocked</span>
    </div>
  );
}
