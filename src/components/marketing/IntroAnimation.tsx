"use client";

import { useEffect, useRef, useState } from "react";

export const INTRO_SEEN_KEY = "tl-intro-seen";

/**
 * Full-screen video overlay that plays once before the landing page is
 * revealed. The mark it ends on (the leaf wreath) is the same image used
 * in the nav logo underneath, so when this fades out the logo reads as
 * "settling into place" rather than a hard cut.
 *
 * This renders open by default — on purpose — so it's part of the very
 * first paint instead of appearing a beat later via useEffect (which is
 * what caused the landing page to flash underneath it). The matching
 * pre-hydration script in layout.tsx (IntroSeenScript) adds `intro-seen`
 * to <html> *before paint* on repeat visits in the same session, and a
 * CSS rule in globals.css hides this overlay instantly when that class is
 * present — so neither direction (show → hide, or hide → show) ever flashes.
 */
export function IntroAnimation() {
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
      setPhase("done");
    }
  }, []);

  function leave() {
    setPhase((p) => (p === "leaving" || p === "done" ? p : "leaving"));
  }

  function finish() {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setPhase("done");
  }

  function toggleSound() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  if (phase === "done") return null;

  return (
    <div
      aria-hidden={phase === "leaving"}
      className={`intro-overlay fixed inset-0 z-50 overflow-hidden
                  bg-[#F5F0E2] dark:bg-[#131C10]
                  transition-opacity duration-700 ease-out
                  ${phase === "leaving" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      onTransitionEnd={() => phase === "leaving" && finish()}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={leave}
        onError={finish}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="text-[13px] font-medium px-3 py-1.5 rounded-full
                     text-[#5B5744] dark:text-[#AFAB92] bg-[#F5F0E2]/70 dark:bg-[#131C10]/70
                     backdrop-blur-sm
                     hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]
                     hover:text-[#21251A] dark:hover:text-[#ECE8D8] transition-colors"
        >
          {muted ? "Sound on" : "Mute"}
        </button>
        <button
          onClick={leave}
          className="text-[13px] font-medium px-3 py-1.5 rounded-full
                     text-[#5B5744] dark:text-[#AFAB92] bg-[#F5F0E2]/70 dark:bg-[#131C10]/70
                     backdrop-blur-sm
                     hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]
                     hover:text-[#21251A] dark:hover:text-[#ECE8D8] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
