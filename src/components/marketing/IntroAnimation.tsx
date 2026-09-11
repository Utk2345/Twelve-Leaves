"use client";

import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "hg-intro-seen";

/**
 * Full-screen video overlay that plays once before the landing page is
 * revealed. The mark it ends on (the leaf wreath) is the same image used
 * in the nav logo underneath, so when this fades out the logo reads as
 * "settling into place" rather than a hard cut.
 *
 * Plays once per browser session (sessionStorage) — returning to "/" in the
 * same visit won't replay it. Autoplays muted (required for autoplay in
 * every browser); a small control lets people turn the sound on.
 */
export function IntroAnimation() {
  const [phase, setPhase] = useState<"pending" | "playing" | "leaving" | "done">("pending");
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase("done");
      return;
    }
    setPhase("playing");
  }, []);

  function leave() {
    setPhase((p) => (p === "leaving" || p === "done" ? p : "leaving"));
  }

  function finish() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setPhase("done");
  }

  function toggleSound() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  if (phase === "pending" || phase === "done") return null;

  return (
    <div
      aria-hidden={phase === "leaving"}
      className={`fixed inset-0 z-50 flex items-center justify-center
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
        className="w-full max-w-[520px] px-8"
      />

      <div className="absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={toggleSound}
          className="text-[13px] font-medium px-3 py-1.5 rounded-full
                     text-[#5B5744] dark:text-[#AFAB92]
                     hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]
                     hover:text-[#21251A] dark:hover:text-[#ECE8D8] transition-colors"
        >
          {muted ? "Sound on" : "Mute"}
        </button>
        <button
          onClick={leave}
          className="text-[13px] font-medium px-3 py-1.5 rounded-full
                     text-[#5B5744] dark:text-[#AFAB92]
                     hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]
                     hover:text-[#21251A] dark:hover:text-[#ECE8D8] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
