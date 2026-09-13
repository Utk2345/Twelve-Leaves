import Link from "next/link";
import { IntroAnimation } from "@/components/marketing/IntroAnimation";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { GrowthStrip } from "@/components/marketing/GrowthStrip";
import { CARD, INK, INK_MUTED, BTN_PRIMARY, DIVIDER } from "@/lib/ui-classes";

const STEPS = [
  {
    n: "1",
    title: "Plant a habit",
    body: "Name it, pick how many times a week — takes a few seconds.",
  },
  {
    n: "2",
    title: "Check it off",
    body: "One tap once you've done it, once a day. That's the whole interaction.",
  },
  {
    n: "3",
    title: "Watch it grow",
    body: "Points bank permanently, your plant moves through its stages, and new ones unlock as you go.",
  },
];

const REASONS = [
  {
    accent: "border-[#7C9473] dark:border-[#86A971]",
    title: "Nothing resets to zero",
    body: "Growth points only go up. A rough week dents momentum — it doesn't erase the record of everything before it.",
  },
  {
    accent: "border-[#B9862E] dark:border-[#E6BD6C]",
    title: "A garden, not a leaderboard",
    body: "No feed, no friends list, no streak-shaming. This is built to be looked at by exactly one person: you.",
  },
  {
    accent: "border-[#33502F] dark:border-[#82B27C]",
    title: "Three ways in, one account",
    body: "Email and password, GitHub, or Google — however you sign up, it's the same garden on every device.",
  },
];

export default async function Home() {
  return (
    <>
      <IntroAnimation />

      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-[1000px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-8 items-center">
            <div>
              <h1
                className={`font-[family-name:var(--font-fraunces)] text-[38px] sm:text-[48px] leading-[1.08] tracking-tight ${INK}`}
              >
                The habit tracker that grows something back.
              </h1>
              <p className={`mt-5 text-[16px] sm:text-[17px] leading-relaxed max-w-[46ch] ${INK_MUTED}`}>
                Twelve Leaves turns daily check-ins into a living garden. Streaks earn growth
                points, growth points move a plant through its stages, and a missed day dents
                momentum without erasing the whole thing.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-in?mode=sign-up"
                  className={`text-[14px] font-medium rounded-full px-5 py-2.5 ${BTN_PRIMARY}`}
                >
                  Get started — it&apos;s free
                </Link>
                <a
                  href="#how-it-works"
                  className={`text-[14px] font-medium rounded-full px-5 py-2.5 border ${DIVIDER} ${INK} hover:bg-[#EEE8D6] dark:hover:bg-[#24311C] transition-colors`}
                >
                  See how it works
                </a>
              </div>
            </div>

            <div
              className={`${CARD} border-l-[3px] border-[#86A971] dark:border-[#9AC286] pl-6 pr-5 py-6 sm:py-7`}
            >
              <p className={`text-[12px] font-medium ${INK_MUTED}`}>One habit, three weeks in</p>
              <div className="mt-5 overflow-x-auto">
                <GrowthStrip />
              </div>
              <p className={`mt-6 text-[13px] ${INK_MUTED}`}>
                <span className={`font-[family-name:var(--font-fraunces)] italic text-[15px] ${INK}`}>
                  17-day streak
                </span>{" "}
                · 610 growth points banked
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-[1000px] mx-auto px-5 sm:px-6 py-16 sm:py-20 scroll-mt-24">
          <h2 className={`font-[family-name:var(--font-fraunces)] text-[26px] sm:text-[30px] ${INK}`}>
            How it works
          </h2>
          <div className={`mt-8 divide-y ${DIVIDER}`}>
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                <span
                  className={`font-[family-name:var(--font-fraunces)] italic text-[22px] shrink-0 w-8 ${INK_MUTED}`}
                >
                  {step.n}
                </span>
                <div>
                  <h3 className={`text-[15px] font-medium ${INK}`}>{step.title}</h3>
                  <p className={`mt-1 text-[14px] leading-relaxed max-w-[52ch] ${INK_MUTED}`}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why it's different */}
        <section className="max-w-[1000px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <h2 className={`font-[family-name:var(--font-fraunces)] text-[26px] sm:text-[30px] ${INK}`}>
            Why it feels different
          </h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {REASONS.map((reason) => (
              <div key={reason.title} className={`border-l-[3px] ${reason.accent} pl-4`}>
                <h3 className={`text-[15px] font-medium ${INK}`}>{reason.title}</h3>
                <p className={`mt-1.5 text-[13.5px] leading-relaxed ${INK_MUTED}`}>{reason.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-[1000px] mx-auto px-5 sm:px-6 pb-20 sm:pb-24">
          <div className={`${CARD} px-6 sm:px-10 py-10 sm:py-12 text-center`}>
            <h2 className={`font-[family-name:var(--font-fraunces)] text-[24px] sm:text-[28px] ${INK}`}>
              Plant your first habit today.
            </h2>
            <p className={`mt-2 text-[14px] ${INK_MUTED}`}>
              Free to use. No credit card, no notifications you didn&apos;t ask for.
            </p>
            <Link
              href="/sign-in?mode=sign-up"
              className={`inline-block mt-6 text-[14px] font-medium rounded-full px-6 py-2.5 ${BTN_PRIMARY}`}
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className={`border-t ${DIVIDER}`}>
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6 py-8 flex items-center justify-between gap-4">
          <span className={`font-[family-name:var(--font-fraunces)] italic text-[13px] ${INK_MUTED}`}>
            Twelve Leaves
          </span>
          <span className={`text-[12px] ${INK_MUTED}`}>Grow a garden by building habits.</span>
        </div>
      </footer>
    </>
  );
}
