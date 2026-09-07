"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type UnlockedPlantInfo = { id: string; name: string; emoji: string };

export function UnlockToast({
  plants,
  onDismiss,
}: {
  plants: UnlockedPlantInfo[];
  onDismiss: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (plants.length === 0) return null;

  return (
    <motion.div
      role="status"
      // The transform animates this element directly, not a wrapper around
      // it — a transformed *ancestor* would become this fixed element's new
      // containing block and break the fixed positioning.
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-full pl-4 pr-3 py-2.5 max-w-md
                   text-[#ECE8D8] bg-[#16210F] dark:bg-[#0D140A]
                   shadow-[0_18px_40px_-18px_rgba(20,30,15,0.55)]"
        style={{
          backgroundImage:
            "radial-gradient(80% 140% at 15% 0%, color-mix(in srgb, #D9A544 25%, transparent), transparent 70%)",
        }}
      >
        <span className="text-2xl leading-none">{plants[0].emoji}</span>
        <div className="flex flex-col">
          <span className="font-[family-name:var(--font-fraunces)] text-base">
            New plant unlocked: {plants[0].name}
            {plants.length > 1 ? ` (+${plants.length - 1} more)` : ""}
          </span>
          <span className="font-[family-name:var(--font-public-sans)] text-xs text-[#C7C4AE]">
            See it in your garden
          </span>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="ml-2 flex items-center justify-center w-7 h-7 rounded-full font-[family-name:var(--font-public-sans)] text-[#C7C4AE] hover:text-[#ECE8D8] hover:bg-white/10 text-sm transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
