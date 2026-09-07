import type { Metadata } from "next";
import "./globals.css";
import { TimezoneSync } from "@/components/TimezoneSync";
import { getTheme } from "@/lib/theme";
import { fraunces, publicSans } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Habit Garden",
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
        <TimezoneSync />
        {children}
      </body>
    </html>
  );
}
