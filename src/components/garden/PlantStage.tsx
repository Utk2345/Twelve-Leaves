"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PlantStage as Stage } from "@/lib/growth";

const PETAL_ANGLES = [0, 72, 144, 216, 288];
const PETAL_PATH = "M0,-6 C-11,-15 -12,-30 0,-40 C12,-30 11,-15 0,-6 Z";
const POP_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/**
 * Seed: breathing glow + gentle bob + rising sparkles, all looping.
 * Sprout: stem draws upward, leaves pop in staggered, then settle into a
 * slow idle sway.
 * Bloom: petals pop in around a glowing center, whole stem sways slowly.
 * All animation is skipped (final state rendered immediately) under
 * prefers-reduced-motion.
 */
export function PlantStage({
  stage,
  className = "w-48 h-52 sm:w-56 sm:h-60",
}: {
  stage: Stage;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <ellipse cx="100" cy="196" rx="70" ry="14" className="fill-[#A98B68] dark:fill-[#8A6A4B]" opacity={0.9} />

      {stage === "seed" && (
        <>
          <motion.circle
            cx="100"
            cy="186"
            r="16"
            className="fill-[#86A971] dark:fill-[#9AC286]"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="100"
            cy="186"
            rx="10"
            ry="7"
            className="fill-[#A98B68] dark:fill-[#8A6A4B] stroke-[#33502F] dark:stroke-[#82B27C]"
            strokeWidth="1.5"
            animate={reduced ? undefined : { y: [0, -2.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {!reduced &&
            [
              { cx: 82, cy: 178, r: 2, delay: 0 },
              { cx: 118, cy: 182, r: 1.6, delay: 0.9 },
              { cx: 100, cy: 170, r: 1.8, delay: 1.8 },
            ].map((s, i) => (
              <motion.circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                className="fill-[#D9A544] dark:fill-[#E6BD6C]"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.9, 0.15, 0], y: [0, 0, -20, -26], scale: [0.6, 0.9, 0.9, 0.9] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: s.delay, ease: "easeIn" }}
              />
            ))}
        </>
      )}

      {stage === "sprout" && (
        <>
          <motion.path
            d="M100 190 C100 150 100 140 100 120"
            className="stroke-[#33502F] dark:stroke-[#82B27C]"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Each leaf: outer group plays the one-time pop-in entrance;
              inner group (nested, same pivot) handles the infinite idle
              sway, independent of the entrance so they don't fight. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
            initial={reduced ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.2, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: reduced ? 0 : 0.35, duration: 0.65, ease: POP_EASE }}
          >
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
              animate={reduced ? undefined : { rotate: [-3, 3] }}
              transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }}
            >
              <path
                d="M100 140 C80 132 70 118 74 104 C90 108 100 122 100 140 Z"
                className="fill-[#86A971] dark:fill-[#9AC286]"
              />
            </motion.g>
          </motion.g>

          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
            initial={reduced ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.2, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: reduced ? 0 : 0.5, duration: 0.65, ease: POP_EASE }}
          >
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
              animate={reduced ? undefined : { rotate: [3, -3] }}
              transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1 }}
            >
              <path
                d="M100 150 C120 142 130 128 126 114 C110 118 100 132 100 150 Z"
                className="fill-[#86A971] dark:fill-[#9AC286]"
              />
            </motion.g>
          </motion.g>
        </>
      )}

      {stage === "bloom" && (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          animate={reduced ? undefined : { rotate: [-1.5, 1.5] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <path
            d="M100 190 C100 130 100 110 100 78"
            className="stroke-[#33502F] dark:stroke-[#82B27C]"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M100 150 C76 142 64 124 70 106 C90 110 100 128 100 150 Z"
            className="fill-[#86A971] dark:fill-[#9AC286]"
          />
          <path
            d="M100 160 C124 152 136 134 130 116 C110 120 100 138 100 160 Z"
            className="fill-[#86A971] dark:fill-[#9AC286]"
          />

          {/* Rotation is a plain SVG attribute on a static <g> — deliberately
              NOT animated, because a CSS/Framer `transform` on the same
              element replaces rather than composes with an SVG `transform`
              attribute. Only the inner path (no rotation of its own)
              animates scale/opacity. */}
          <g transform="translate(100 66)">
            {PETAL_ANGLES.map((angle, i) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <motion.path
                  d={PETAL_PATH}
                  className="fill-[#F5E3BD] dark:fill-[#37301B] stroke-[#D9A544] dark:stroke-[#E6BD6C]"
                  strokeWidth="1"
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                  initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.25 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.55, ease: POP_EASE }}
                />
              </g>
            ))}
            <motion.circle
              r="8"
              className="fill-[#D9A544] dark:fill-[#E6BD6C]"
              animate={reduced ? undefined : { filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </motion.g>
      )}
    </svg>
  );
}
