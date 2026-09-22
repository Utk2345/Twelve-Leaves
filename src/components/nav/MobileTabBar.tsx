"use client";

// Bottom tab bar shown only below the `sm` breakpoint, where AppNav's link
// row is hidden (`hidden sm:flex`). Without this, phone-sized viewports had
// no persistent way to move between Dashboard / Habits / Garden / Stats —
// only the logo (-> /dashboard) and whatever "View ->" links a given page
// happened to include. Fixed to the viewport bottom so it's always
// thumb-reachable, with real `<a>` tags (not divs) so it's keyboard- and
// screen-reader-navigable like the desktop links.

type TabIconProps = { className?: string };

function DashboardIcon({ className }: TabIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 21c0-6 4-10 8-11-1 6-4 10-8 11Z" />
      <path d="M12 21c0-6-4-10-8-11 1 6 4 10 8 11Z" />
      <path d="M12 21V9" />
    </svg>
  );
}

function HabitsIcon({ className }: TabIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-4.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GardenIcon({ className }: TabIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 20V11" strokeLinecap="round" />
      <path d="M12 11c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6Z" strokeLinejoin="round" />
      <path d="M12 14c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" strokeLinejoin="round" />
    </svg>
  );
}

function StatsIcon({ className }: TabIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 20V13" strokeLinecap="round" />
      <path d="M12 20V6" strokeLinecap="round" />
      <path d="M19 20v-8" strokeLinecap="round" />
    </svg>
  );
}

const TABS = [
  { href: "/dashboard", label: "Home", Icon: DashboardIcon },
  { href: "/dashboard/habits", label: "Habits", Icon: HabitsIcon },
  { href: "/garden", label: "Garden", Icon: GardenIcon },
  { href: "/stats", label: "Stats", Icon: StatsIcon },
] as const;

export function MobileTabBar({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary"
      className="sm:hidden fixed inset-x-0 bottom-0 z-20 px-3 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] pt-2"
    >
      <div
        className="max-w-[420px] mx-auto flex items-center justify-between
                   rounded-[22px] px-2 py-1.5
                   bg-[#FFFEFB] dark:bg-[#1C2717]
                   shadow-[0_14px_32px_-14px_rgba(40,36,20,0.28),0_2px_8px_rgba(40,36,20,0.08)]
                   dark:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.35)]"
      >
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                active
                  ? "text-[#33502F] dark:text-[#82B27C]"
                  : "text-[#696856] dark:text-[#757058]"
              }`}
            >
              <Icon className={active ? "" : "opacity-80"} />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
