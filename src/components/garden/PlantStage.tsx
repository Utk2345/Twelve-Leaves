import type { PlantStage as Stage } from "@/lib/growth";

const PINE = "#2B4635";
const MOSS = "#7C9473";
const GOLD = "#B98A2E";
const SOIL = "#8A6A4B";

// Deliberately simple, hand-drawn-ish placeholder shapes — swap for real
// illustration later without touching the logic that picks the stage.
export function PlantStage({ stage }: { stage: Stage }) {
  return (
    <svg viewBox="0 0 200 220" className="w-48 h-52 sm:w-56 sm:h-60" aria-hidden="true">
      {/* soil mound, present at every stage */}
      <ellipse cx="100" cy="196" rx="70" ry="14" fill={SOIL} opacity={0.9} />

      {stage === "seed" && (
        <ellipse cx="100" cy="186" rx="10" ry="7" fill={SOIL} stroke={PINE} strokeWidth="1.5" />
      )}

      {stage === "sprout" && (
        <g>
          <path d="M100 190 C100 150 100 140 100 120" stroke={PINE} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M100 140 C80 132 70 118 74 104 C90 108 100 122 100 140 Z" fill={MOSS} />
          <path d="M100 150 C120 142 130 128 126 114 C110 118 100 132 100 150 Z" fill={MOSS} />
        </g>
      )}

      {stage === "bloom" && (
        <g>
          <path d="M100 190 C100 130 100 110 100 78" stroke={PINE} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M100 150 C76 142 64 124 70 106 C90 110 100 128 100 150 Z" fill={MOSS} />
          <path d="M100 160 C124 152 136 134 130 116 C110 120 100 138 100 160 Z" fill={MOSS} />
          {/* flower head: five simple petals around a gold center */}
          <g transform="translate(100 66)">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={0}
                cy={-18}
                rx="12"
                ry="20"
                fill="#E7C77A"
                stroke={GOLD}
                strokeWidth="1"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle r="9" fill={GOLD} />
          </g>
        </g>
      )}
    </svg>
  );
}
