import type { Metadata } from "next";
import "./globals.css";
import { TimezoneSync } from "@/components/TimezoneSync";

export const metadata: Metadata = {
  title: "Habit Garden",
  description: "Grow a garden by building habits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TimezoneSync />
        {children}
        </body>
    </html>
  );
}
