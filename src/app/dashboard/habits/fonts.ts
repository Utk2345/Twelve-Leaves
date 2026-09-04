import { Fraunces, Public_Sans } from "next/font/google";

// Fraunces: warm, slightly rustic serif with visible optical-size character —
// carries the "field guide / seed catalog" feel for habit names and headings.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  weight: "variable",
});

// Public Sans: plain, legible humanist sans for UI chrome, labels, buttons.
export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600"],
});
