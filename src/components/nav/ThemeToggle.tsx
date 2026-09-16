"use client";

import { useState } from "react";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";
import { setBrowserCookie } from "@/lib/browser-cookie";

export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [isDark, setIsDark] = useState(initialTheme === "dark");

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setBrowserCookie(THEME_COOKIE, next, 31536000);
    setIsDark(next === "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0
                 text-[#5B5744] dark:text-[#AFAB92]
                 hover:bg-[#EEE8D6] dark:hover:bg-[#24311C] transition-colors"
    >
      {isDark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
        </svg>
      )}
    </button>
  );
}
