import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { CARD, INK, INK_MUTED, LINK, DIVIDER } from "@/lib/ui-classes";


const OPERATOR_NAME = "Utkarsha Vishwasu";

const LAST_UPDATED = "22-09-2026";

const SECTION = `${CARD} px-6 sm:px-8 py-6 sm:py-7`;
const H2 = `font-[family-name:var(--font-fraunces)] text-[19px] ${INK} mb-3`;
const P = `text-[14.5px] leading-relaxed ${INK_MUTED} mb-3 last:mb-0`;
const UL = `text-[14.5px] leading-relaxed ${INK_MUTED} list-disc pl-5 space-y-1.5 mb-3 last:mb-0`;
const STRONG = INK;

export const metadata = {
  title: "Privacy Policy — Twelve Leaves",
};

export default function PrivacyPage() {
  return (
    <>
      <MarketingNav />

      <main className="flex-1">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-[30px] sm:text-[36px] ${INK}`}>
            Privacy Policy
          </h1>
          <p className={`mt-2 mb-8 text-[13px] ${INK_MUTED}`}>Last updated: {LAST_UPDATED}</p>

          <div className="flex flex-col gap-5">
            <section className={SECTION}>
              <h2 className={H2}>The short version</h2>
              <p className={P}>
                Twelve Leaves is an independent project, run by {OPERATOR_NAME}. It
                stores the habits, completions, and garden progress you create so the app can show
                them back to you across devices. We don&apos;t sell your data, we don&apos;t show
                ads, and we don&apos;t share it with anyone except the infrastructure providers
                that host the app (listed below), who process it only to run the service.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Who is responsible for your data</h2>
              <p className={P}>
                For the purposes of Indian data protection law, {OPERATOR_NAME} is the Data
                Fiduciary for the personal data Twelve Leaves collects — meaning the person who
                decides how and why your data is processed. You can reach {OPERATOR_NAME} using
                the contact details at the bottom of this page for anything related to your data,
                including questions, corrections, or complaints.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Information we collect</h2>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>Account information.</span> If you sign
                up with email and password, we store your email address and name, plus a securely
                hashed password — never the password itself. If you sign up or connect GitHub or
                Google, we receive and store the profile information those providers share (your
                name, email, and profile photo URL) along with the access tokens needed to keep
                that connection working. We never see your GitHub or Google password.
              </p>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>Profile photo.</span> If you upload a
                custom photo, it&apos;s resized and stored with our file-storage provider (Vercel
                Blob). If you sign in via GitHub or Google and haven&apos;t uploaded your own, we
                display the profile photo your provider makes available.
              </p>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>App content.</span> The habits you
                create, when you mark them complete, and your resulting garden growth and unlocked
                plants — this is the core data the app exists to store.
              </p>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>Preferences.</span> Your detected
                timezone is saved in cookies on your device so pages render correctly. This isn&apos;t
                linked back to your account server-side.
              </p>
              <p className={P}>
                <span className={`font-medium ${STRONG}`}>Technical &amp; security data.</span>{" "}
                To keep sign-in sessions secure, we record the IP address and browser/device
                information (user agent) associated with each session, along with when it was
                created.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Cookies</h2>
              <p className={P}>
                We use a small number of cookies, all of them functional — nothing here is used
                for advertising or cross-site tracking:
              </p>
              <ul className={UL}>
                <li>
                  <span className={`font-medium ${STRONG}`}>Session cookie</span> — keeps you
                  signed in. Required for the app to work.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Theme &amp; timezone cookies</span> —
                  remember your display preferences and local date, so &ldquo;today&rdquo; means
                  the same thing to the app as it does to you.
                </li>
              </ul>
              <p className={P}>
                Because these are all strictly necessary for the app to function, we don&apos;t
                show a cookie-consent banner. If that changes — for example, if we ever add
                analytics — this section and that decision will be updated together.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>How we keep your data safe</h2>
              <p className={P}>
                We use reasonable technical safeguards to protect your data, including encrypting
                traffic to the app in transit (HTTPS), hashing passwords rather than storing them
                in plain text, and relying on our infrastructure providers&apos; own security
                controls for data at rest. No system is perfectly secure, but we take reasonable
                steps appropriate to the kind of data we hold.
              </p>
              <p className={P}>
                If a data breach occurs that&apos;s likely to affect you, we&apos;ll notify you and,
                where required, the Data Protection Board of India, in line with the timelines set
                out under the Digital Personal Data Protection Act, 2023.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Who we share it with</h2>
              <p className={P}>
                We don&apos;t sell personal information or share it for advertising. The app runs
                on infrastructure providers who process data on our behalf to make the service
                work:
              </p>
              <ul className={UL}>
                <li>
                  <span className={`font-medium ${STRONG}`}>Vercel</span> — application hosting
                  and file storage (profile photos).
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Neon</span> — our Postgres database
                  provider, where your account and app data is stored.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>GitHub / Google</span> — only if you
                  choose to sign in with them; they see that you&apos;re signing in to Twelve
                  Leaves, never your habit or garden data.
                </li>
              </ul>
              <p className={P}>
                Some of these providers may process or store data on servers located outside
                India. Where that happens, it&apos;s to countries not currently restricted by the
                Indian government under the Digital Personal Data Protection Act, 2023, and only
                for the purpose of running the service.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>How long we keep it, and deletion</h2>
              <p className={P}>
                We keep your data for as long as your account exists. You can permanently delete
                your account at any time from{" "}
                <Link href="/dashboard/profile" className={`underline ${LINK}`}>
                  Profile &amp; settings
                </Link>
                . Doing so immediately and permanently removes your account, habits, completion
                history, and garden progress — this can&apos;t be undone and we can&apos;t recover
                it for you afterward.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Your rights</h2>
              <p className={P}>Under Indian data protection law, you have the right to:</p>
              <ul className={UL}>
                <li>
                  <span className={`font-medium ${STRONG}`}>Access and correct</span> your name
                  and profile photo directly from{" "}
                  <Link href="/dashboard/profile" className={`underline ${LINK}`}>
                    Profile &amp; settings
                  </Link>
                  , or by emailing us for anything you can&apos;t change yourself.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Withdraw consent</span> at any time —
                  for example by disconnecting a linked GitHub or Google account — without needing
                  to delete your account entirely.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Erase your data</span> by deleting
                  your account, as described above.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Nominate</span> another individual to
                  exercise these rights on your behalf in the event of your death or incapacity, by
                  contacting us.
                </li>
                <li>
                  <span className={`font-medium ${STRONG}`}>Raise a grievance</span> about how we
                  handle your data — see Contact below. If we can&apos;t resolve it, you can also
                  approach the Data Protection Board of India.
                </li>
              </ul>
              <p className={P}>
                For a copy of your data, or anything not covered above, contact us at{" "}
                <a href="mailto:orgdeveloper12@gmail.com" className={`underline ${LINK}`}>
                  orgdeveloper12@gmail.com
                </a>
                . We aim to respond within 30 days.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Children&apos;s privacy</h2>
              <p className={P}>
                Twelve Leaves isn&apos;t directed at children and isn&apos;t designed for anyone
                under 18. Under Indian law, anyone under 18 is considered a child, and processing a
                child&apos;s data requires verifiable consent from a parent or lawful guardian —
                Twelve Leaves doesn&apos;t currently have a way to collect or verify that consent,
                so we don&apos;t knowingly allow anyone under 18 to create an account. If you
                believe a child has created an account, contact us and we&apos;ll delete it and
                the data associated with it.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Changes to this policy</h2>
              <p className={P}>
                If this policy changes in a meaningful way, we&apos;ll update the date at the top
                of this page. Continuing to use Twelve Leaves after a change means you accept the
                updated policy.
              </p>
            </section>

            <section className={SECTION}>
              <h2 className={H2}>Contact</h2>
              <p className={P}>
                Questions about this policy, your data, or to raise a grievance — email{" "}
                <a href="mailto:orgdeveloper12@gmail.com" className={`underline ${LINK}`}>
                  orgdeveloper12@gmail.com
                </a>
                . {OPERATOR_NAME}
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
            <Link href="/terms" className={`text-[12px] underline ${INK_MUTED}`}>
              Terms
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
