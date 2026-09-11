import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import type { Theme } from "@/lib/theme-constants";

export function MarketingNav({ theme }: { theme: Theme }) {
  return (
    <div className="sticky top-3.5 z-20 px-4 sm:px-5">
      <nav
        className="max-w-[800px] mx-auto flex items-center justify-between gap-3
                   rounded-full pl-3 pr-2 py-2
                   bg-[#FFFEFB] dark:bg-[#1C2717]
                   shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                   dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-wreath.png"
            alt="Twelve Leaves"
            width={30}
            height={30}
            priority
            className="shrink-0 -my-1"
          />
          <span className="font-[family-name:var(--font-fraunces)] italic text-[15px] text-[#21251A] dark:text-[#ECE8D8]">
            Twelve Leaves
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle initialTheme={theme} />
          <Link
            href="/sign-in"
            className="text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors
                       text-[#5B5744] dark:text-[#AFAB92]
                       hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]
                       hover:text-[#21251A] dark:hover:text-[#ECE8D8]"
          >
            Log in
          </Link>
          <Link
            href="/sign-in?mode=sign-up"
            className="text-[13px] font-medium px-4 py-2 rounded-full
                       bg-[#33502F] dark:bg-[#82B27C] text-[#F5F0E2] dark:text-[#0D140A]
                       hover:-translate-y-px transition-transform"
          >
            Get started
          </Link>
        </div>
      </nav>
    </div>
  );
}
