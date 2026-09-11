const STEM = "stroke-[#33502F] dark:stroke-[#82B27C]";
const LEAF = "fill-[#86A971] dark:fill-[#9AC286]";
const GOLD = "fill-[#B9862E] dark:fill-[#E6BD6C]";
const GOLD_STROKE = "stroke-[#B9862E] dark:stroke-[#E6BD6C]";
const PETAL = "fill-[#F5E3BD] dark:fill-[#37301B] stroke-[#B9862E] dark:stroke-[#E6BD6C]";

function SeedIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 60 60" aria-hidden="true" overflow="visible">
      <circle className={`gs-seed-glow ${LEAF}`} cx="30" cy="34" r="15" />
      <ellipse
        className={`gs-seed-body ${GOLD_STROKE}`}
        cx="30"
        cy="34"
        rx="9"
        ry="6.5"
        fill="none"
        strokeWidth="1.6"
      />
      <circle className={`gs-sparkle gs-s1 ${GOLD}`} cx="20" cy="24" r="1.8" />
      <circle className={`gs-sparkle gs-s2 ${GOLD}`} cx="40" cy="27" r="1.4" />
      <circle className={`gs-sparkle gs-s3 ${GOLD}`} cx="30" cy="16" r="1.6" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg width="30" height="34" viewBox="0 0 60 68" aria-hidden="true" overflow="visible">
      <path
        className={`gs-stem ${STEM}`}
        d="M30 60C30 45 30 40 30 30"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
      />
      <path
        className={`gs-leaf gs-leaf-1 ${LEAF}`}
        d="M30 36C22 33 18 27 19.5 21C26 22.5 30 28 30 36Z"
      />
      <path
        className={`gs-leaf gs-leaf-2 ${LEAF}`}
        d="M30 40C39 37 43 31 41.5 25C35 26.5 30 32 30 40Z"
      />
    </svg>
  );
}

function BloomIcon() {
  const petalPath = "M0,-3 C-6,-8 -6.5,-16 0,-21 C6.5,-16 6,-8 0,-3 Z";
  const petalAngles = [0, 72, 144, 216, 288];
  return (
    <svg width="32" height="36" viewBox="0 0 64 72" aria-hidden="true" overflow="visible">
      <g className="gs-bloom-stem">
        <path
          d="M32 66C32 42 32 34 32 24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={STEM}
        />
        <path className={LEAF} d="M32 48C24 45 20 39 21.5 33C28 34.5 32 40 32 48Z" />
        <path className={LEAF} d="M32 52C41 49 45 43 43.5 37C37 38.5 32 44 32 52Z" />
      </g>
      <g transform="translate(32 21)">
        {petalAngles.map((angle, i) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              className={`gs-petal ${PETAL}`}
              style={{ animationDelay: `${i * 80}ms` }}
              d={petalPath}
              strokeWidth="0.75"
            />
          </g>
        ))}
        <circle className={`gs-flower-center ${GOLD}`} r="4" />
      </g>
    </svg>
  );
}

const STAGES = [
  { label: "Day 1", note: "seed", Icon: SeedIcon },
  { label: "Day 9", note: "sprout", Icon: SproutIcon },
  { label: "Day 23", note: "bloom", Icon: BloomIcon },
];

export function GrowthStrip() {
  return (
    <div className="flex items-end gap-0">
      {STAGES.map((stage, i) => {
        const { Icon } = stage;
        const last = i === STAGES.length - 1;
        return (
          <div key={stage.label} className="flex items-end">
            <div className="flex flex-col items-center gap-2.5 w-[76px]">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full shrink-0
                           ${last ? "bg-[#EEE8D6] dark:bg-[#24311C]" : "bg-[#FFFEFB] dark:bg-[#1C2717]"}
                           shadow-[0_10px_22px_-14px_rgba(40,36,20,0.3)]`}
              >
                <Icon />
              </div>
              <div className="text-center">
                <div className="font-[family-name:var(--font-fraunces)] italic text-[13px] text-[#21251A] dark:text-[#ECE8D8]">
                  {stage.note}
                </div>
                <div className="text-[11px] text-[#8B8A72] dark:text-[#757058] mt-0.5">{stage.label}</div>
              </div>
            </div>
            {!last && (
              <div className="w-8 sm:w-12 h-px mb-[38px] border-t border-dashed border-[#D8D2C2] dark:border-[#3A4530]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
