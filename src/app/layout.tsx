import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { TimezoneSync } from "@/components/TimezoneSync";
import { fraunces, publicSans } from "@/app/fonts";
import { INTRO_SEEN_KEY } from "@/components/marketing/IntroAnimation";

export const metadata: Metadata = {
  title: "Twelve Leaves",
  description: "Grow a garden by building habits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-[#F5F0E2] text-[#21251A] font-[family-name:var(--font-public-sans)]"
        style={{
          backgroundImage: "url(/tl-background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
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
