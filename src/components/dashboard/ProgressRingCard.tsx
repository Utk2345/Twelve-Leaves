"use client";

import { useEffect, useRef } from "react";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRingCard({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? completed / total : 0;
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const timeout = setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct));
        }
      }, 150);
      return () => clearTimeout(timeout);
    });
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <div
      className="flex flex-col items-center gap-2 text-center rounded-[24px] p-5
                 bg-[#FFFEFB] dark:bg-[#1C2717]
                 shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                 dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
    >
      <span className="text-xs font-medium text-[#5C6150] dark:text-[#AFAB92]">Today&apos;s progress</span>
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            className="stroke-[#DCE8CB] dark:stroke-[#2B3A22]"
          />
          <circle
            ref={circleRef}
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            className="stroke-[#86A971] dark:stroke-[#9AC286]
                       transition-[stroke-dashoffset] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                       motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-(family-name:--font-fraunces) text-xl text-[#21251A] dark:text-[#ECE8D8]">
            {total > 0 ? `${Math.round(pct * 100)}%` : "—"}
          </span>
          <span className="text-[10px] text-[#8B8A72] dark:text-[#757058]">
            {total > 0 ? `${completed} of ${total}` : "No habits yet"}
          </span>
        </div>
      </div>
    </div>
  );
}
