import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { TimezoneSync } from "@/components/TimezoneSync";
import { getTheme } from "@/lib/theme";
import { fraunces, publicSans } from "@/app/fonts";
import { INTRO_SEEN_KEY } from "@/components/marketing/IntroAnimation";

export const metadata: Metadata = {
  title: "Twelve Leaves",
  description: "Grow a garden by building habits.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getTheme();

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col
                   bg-[#F5F0E2] text-[#21251A]
                   dark:bg-[#131C10] dark:text-[#ECE8D8]
                   font-[family-name:var(--font-public-sans)]
                   transition-colors duration-200"
      >
        {/* Runs before hydration/paint so a repeat same-session visit to "/"
            never flashes the intro overlay on and back off — see the
            matching CSS rule in globals.css and IntroAnimation.tsx. */}
        <Script id="intro-seen-check" strategy="beforeInteractive">
          {`try {
              if (sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})) {
                document.documentElement.classList.add("intro-seen");
              }
            } catch (e) {}`}
        </Script>
        <TimezoneSync />
        {children}
      </body>
    </html>
  );
}
