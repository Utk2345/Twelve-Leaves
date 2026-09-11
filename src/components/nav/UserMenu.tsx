"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold overflow-hidden
                   bg-gradient-to-br from-[#33502F] to-[#86A971]
                   dark:from-[#82B27C] dark:to-[#9AC286]
                   text-[#F5F0E2] dark:text-[#0D140A]"
      >
        {userImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={userImage} alt="" className="w-full h-full object-cover" />
        ) : (
          initials(userName)
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[46px] min-w-[180px] p-2 rounded-2xl flex flex-col z-30
                     bg-[#FFFEFB] dark:bg-[#1C2717]
                     shadow-[0_14px_32px_-16px_rgba(40,36,20,0.22),0_2px_8px_rgba(40,36,20,0.06)]
                     dark:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]"
        >
          <a
            href="/dashboard/profile"
            className="text-sm px-3 py-2 rounded-lg text-[#21251A] dark:text-[#ECE8D8] hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]"
          >
            Profile &amp; settings
          </a>
          <div className="h-px my-1 mx-1 bg-[#EEE8D6] dark:bg-[#24311C]" />
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } })}
            className="text-sm text-left px-3 py-2 rounded-lg text-[#8A4A57] dark:text-[#F0D6DA] hover:bg-[#EEE8D6] dark:hover:bg-[#24311C]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
