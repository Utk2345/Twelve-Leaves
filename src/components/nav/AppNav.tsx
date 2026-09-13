"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/habits", label: "Habits" },
  { href: "/garden", label: "Garden" },
  { href: "/stats", label: "Stats" },
];

export function AppNav({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-3.5 z-20 px-4 sm:px-5">
      <nav
        className="max-w-[800px] mx-auto flex items-center justify-between gap-3
                   rounded-full pl-4 pr-2 py-2
                   bg-[#FFFEFB] dark:bg-[#1C2717]
                   shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                   dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <a href="/dashboard" className="flex items-center gap-2 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="stroke-[#86A971] dark:stroke-[#9AC286]">
            <path d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z" />
            <path d="M12 21c0-6-4-10-8-11 1 6 4 10 8 11Z" />
            <path d="M12 21V9" />
          </svg>
          <span className="font-[family-name:var(--font-fraunces)] italic text-[15px] text-[#21251A] dark:text-[#ECE8D8]">
            Twelve Leaves
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors ${
                  active
                    ? "bg-[#33502F] text-[#F5F0E2] dark:bg-[#82B27C] dark:text-[#0D140A]"
                    : "text-[#5B5744] dark:text-[#AFAB92] hover:bg-[#EEE8D6] dark:hover:bg-[#24311C] hover:text-[#21251A] dark:hover:text-[#ECE8D8]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <UserMenu userName={userName} userImage={userImage} />
        </div>
      </nav>
    </div>
  );
}
