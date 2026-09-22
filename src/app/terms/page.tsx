import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { CARD, INK, INK_MUTED, LINK, DIVIDER } from "@/lib/ui-classes";


const OPERATOR_NAME = "Utkarsha Vishwasu";

const JURISDICTION_CITY ="Chhatrapati Sambhajinagar, Maharashtra";

const LAST_UPDATED = "22-09-2026";

const SECTION = `${CARD} px-6 sm:px-8 py-6 sm:py-7`;
const H2 = `font-[family-name:var(--font-fraunces)] text-[19px] ${INK} mb-3`;
const P = `text-[14.5px] leading-relaxed ${INK_MUTED} mb-3 last:mb-0`;
const UL = `text-[14.5px] leading-relaxed ${INK_MUTED} list-disc pl-5 space-y-1.5 mb-3 last:mb-0`;
const STRONG = INK;

export const metadata = {
  title: "Terms of Service — Twelve Leaves",
};

export default function TermsPage() {
  return (
    <>
      <MarketingNav />

      <main className="flex-1">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-[30px] sm:text-[36px] ${INK}`}>
            Terms of Service
          </h1>
          <p className={`mt-2 mb-8 text-[13px] ${INK_MUTED}`}>Last updated: {LAST_UPDATED}</p>

          <div className="flex flex-col gap-5">
            <section className={SECTION}>
              <h2 className={H2}>The short version</h2>
              <p className={P}>
                Twelve Leaves is a personal, independently-run project, free to use. By creating
                an account you agree to these terms and to our{" "}
                <Link href="/privacy" className={`underline ${LINK}`}>
                  Privacy Policy
                </Link>
                . Don&apos;t misuse the service, the habits and photo you add are yours, and you
                can delete your account whenever you want.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Who runs this</h2>
              <p className={P}>
                Twelve Leaves is built and operated by {OPERATOR_NAME}, as an independent personal
                project — not a registered company. That doesn&apos;t change your rights under
                these terms or under Indian law; it just means you&apos;re dealing directly with
                an individual rather than a corporate entity.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Your account</h2>
              <p className={P}>
                You can create an account with email and password, or by signing in with GitHub or
                Google. You&apos;re responsible for keeping your credentials secure and for
                activity that happens under your account. Let us know if you believe your account
                has been compromised.
              </p>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>You must be 18 or older</span> to create
                an account and use Twelve Leaves. Under Indian law, minors (under 18) generally
                can&apos;t enter into a binding contract, so if you&apos;re not yet 18, please
                don&apos;t sign up. If we learn that an account belongs to someone under 18,
                we&apos;ll delete it and the data associated with it. See the{" "}
                <Link href="/privacy" className={`underline ${LINK}`}>
                  Privacy Policy
                </Link>{" "}
                for more on how we handle this.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>The service</h2>
              <p className={P}>
                Twelve Leaves is currently free, with no paid plans or in-app purchases. We may
                introduce paid features in the future; if we do, we&apos;ll update these terms and
                you won&apos;t be charged without clear notice and your consent.
              </p>
              <p className={P}>
                We aim to keep the service reliable, but we don&apos;t guarantee it will always be
                available, error-free, or uninterrupted, and we may change, suspend, or discontinue
                any part of it. As a personal project run by one person, planned or unplanned
                downtime is more likely than with a larger service — we&apos;ll do our best to
                keep things running smoothly regardless.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Your content</h2>
              <p className={P}>
                The habits you name, the completion history you build, and any profile photo you
                upload belong to you. By adding a profile photo, you confirm you have the right to
                use it and that it doesn&apos;t violate anyone else&apos;s rights.
              </p>
              <p className={P}>
                We store and display your content back to you so the app can work — that&apos;s
                the only reason we use it. We don&apos;t claim ownership of it, and we don&apos;t
                use it to train anything or share it with anyone outside what&apos;s described in
                our{" "}
                <Link href="/privacy" className={`underline ${LINK}`}>
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Acceptable use</h2>
              <p className={P}>Please don&apos;t use Twelve Leaves to:</p>
              <ul className={UL}>
                <li>Upload a profile photo that&apos;s abusive, illegal, or not actually you.</li>
                <li>Attempt to access another user&apos;s account or data.</li>
                <li>
                  Interfere with the service&apos;s normal operation — for example, automated
                  scripting against the API outside of normal app use, or attempting to bypass
                  rate limits or authentication.
                </li>
                <li>Use the service for anything illegal in your jurisdiction.</li>
              </ul>
              <p className={P}>
                We may suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Ending your account</h2>
              <p className={P}>
                You can delete your account at any time from{" "}
                <Link href="/dashboard/profile" className={`underline ${LINK}`}>
                  Profile &amp; settings
                </Link>
                . This immediately and permanently removes your habits, completion history, and
                garden progress — it can&apos;t be undone. We may also suspend or terminate an
                account that violates these terms, with notice where reasonably possible.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>No warranty</h2>
              <p className={P}>
                Twelve Leaves is provided &ldquo;as is,&rdquo; without warranties of any kind.
                It&apos;s a habit-tracking and motivation tool, not medical, psychological, or
                professional advice of any kind — use your own judgment, and talk to a qualified
                professional for anything health-related.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Limitation of liability</h2>
              <p className={P}>
                To the extent permitted by law, {OPERATOR_NAME} isn&apos;t liable for indirect,
                incidental, or consequential damages arising from your use of the service,
                including loss of data such as habit history or garden progress. Nothing in these
                terms limits liability that can&apos;t legally be limited.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Changes to these terms</h2>
              <p className={P}>
                If these terms change in a meaningful way, we&apos;ll update the date at the top of
                this page. Continuing to use Twelve Leaves after a change means you accept the
                updated terms.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Governing law</h2>
              <p className={P}>
                These terms are governed by the laws of India. Subject to your non-waivable
                statutory rights, any dispute will be subject to the exclusive jurisdiction of the
                courts of {JURISDICTION_CITY}.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Contact</h2>
              <p className={P}>
                Questions about these terms — email{" "}
                <a href="mailto:orgdeveloper12@gmail.com" className={`underline ${LINK}`}>
                  orgdeveloper12@gmail.com
                </a>
                . We aim to respond within 30 days.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className={`border-t ${DIVIDER}`}>
        <div className="max-w-[1000px] mx-auto px-5 sm:px-6 py-8 flex items-center justify-between gap-4">
          <span className={`font-[family-name:var(--font-fraunces)] italic text-[13px] ${INK_MUTED}`}>
            Twelve Leaves
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className={`text-[12px] underline ${INK_MUTED}`}>
              Privacy
            </Link>
            <Link href="/" className={`text-[12px] underline ${INK_MUTED}`}>
              Back home
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
