// Shared visual language for the "dreamy garden" theme, introduced on the
// dashboard and reused here so habits/garden/stats read as the same app.
// Plain strings (not a CSS-in-JS system) to match the rest of the codebase's
// arbitrary-Tailwind-value convention.
//
// INK_FAINT and GOLD (light-mode values only) were darkened from the
// original design-spec hex codes (#8B8A72 / #B9862E) to meet WCAG AA's
// 4.5:1 text-contrast minimum against every background they're actually
// used on (Paper #F5F0E2, Card #FFFEFB, and the secondary surface #EEE8D6
// used for archived-habit chips and locked-plant tiles) — the originals
// ranged 2.8:1–3.5:1 there. Dark-mode values are untouched since dark mode
// is currently dead code (see globals.css) with no live background to
// check contrast against.

// The page background now lives on <body> (see src/app/layout.tsx, tl-background.webp),
// so this is intentionally empty. Kept as an export so existing
// `min-h-screen ${PAGE_BG}` call sites don't need to change.
export const PAGE_BG = "";

export const CARD =
  "rounded-[22px] bg-[#FFFEFB] dark:bg-[#1C2717] " +
  "shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)] " +
  "dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]";

export const INK = "text-[#21251A] dark:text-[#ECE8D8]";
export const INK_MUTED = "text-[#5C6150] dark:text-[#AFAB92]";
export const INK_FAINT = "text-[#696856] dark:text-[#757058]";

export const LINK = "text-[#33502F] dark:text-[#82B27C]";
export const DANGER = "text-[#A3492E] dark:text-[#E0715A]";
export const GOLD = "text-[#8C6523] dark:text-[#E6BD6C]";

export const BTN_PRIMARY =
  "bg-[#33502F] dark:bg-[#82B27C] text-[#F5F0E2] dark:text-[#0D140A] hover:-translate-y-px transition-transform";

export const DIVIDER = "border-[#EEE8D6] dark:border-[#24311C]";

export const TRACK = "bg-[#DCE8CB] dark:bg-[#2B3A22]";
export const TRACK_FILL = "bg-[#86A971] dark:bg-[#9AC286]";
