"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { CARD, INK, INK_MUTED, DANGER, BTN_PRIMARY, DIVIDER } from "@/lib/ui-classes";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const initialMode = searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";

  const [mode, setMode] = useState<"sign-in" | "sign-up">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result =
      mode === "sign-in"
        ? await signIn.email({ email, password })
        : await signUp.email({ email, password, name: name || email });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Something went wrong. Try again.");
      return;
    }

    router.push(redirectTo);
  }

  const inputClasses =
    "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors " +
    "bg-[#FFFEFB] dark:bg-[#1C2717] border-[#D8D2C2] dark:border-[#3A4530] " +
    "text-[#21251A] dark:text-[#ECE8D8] placeholder:text-[#8B8A72] dark:placeholder:text-[#757058] " +
    "focus:border-[#7C9473] dark:focus:border-[#82B27C]";

  return (
    <div className={`w-full max-w-sm ${CARD} px-7 sm:px-8 py-8 text-center`}>
      <Link href="/" className="inline-flex items-center gap-2">
        <Image src="/logo-wreath.png" alt="Twelve Leaves" width={34} height={34} />
      </Link>

      <h1 className={`mt-4 font-[family-name:var(--font-fraunces)] text-[24px] ${INK}`}>
        {mode === "sign-in" ? "Welcome back" : "Plant your garden"}
      </h1>
      <p className={`mt-1.5 text-[13.5px] ${INK_MUTED}`}>
        {mode === "sign-in"
          ? "Sign in to keep your streaks going."
          : "Your habits, your garden — synced across devices."}
      </p>

      <div className="mt-6 space-y-2">
        <button
          onClick={() => signIn.social({ provider: "github", callbackURL: redirectTo })}
          className={`w-full rounded-xl px-5 py-2.5 text-sm font-medium ${BTN_PRIMARY}`}
        >
          Continue with GitHub
        </button>
        <button
          onClick={() => signIn.social({ provider: "google", callbackURL: redirectTo })}
          className={`w-full rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors
                      ${DIVIDER} ${INK} hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]`}
        >
          Continue with Google
        </button>
      </div>

      <div className={`my-6 flex items-center gap-3 text-xs ${INK_MUTED}`}>
        <div className={`h-px flex-1 border-t ${DIVIDER}`} />
        or
        <div className={`h-px flex-1 border-t ${DIVIDER}`} />
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
        {mode === "sign-up" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
        <input
          type="password"
          placeholder="Password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
        />

        {error && <p className={`text-sm ${DANGER}`}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-50 ${BTN_PRIMARY}`}
        >
          {loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => {
          setError(null);
          setMode(mode === "sign-in" ? "sign-up" : "sign-in");
        }}
        className={`mt-5 text-sm transition-colors ${INK_MUTED} hover:text-[#21251A] dark:hover:text-[#ECE8D8]`}
      >
        {mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
