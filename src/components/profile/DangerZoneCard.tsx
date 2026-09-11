"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DANGER } from "@/lib/ui-classes";

export function DangerZoneCard() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    const result = await authClient.deleteUser();
    setDeleting(false);
    if (result.error) {
      setError(result.error.message ?? "Couldn't delete your account.");
      return;
    }
    router.push("/sign-in");
  }

  return (
    <div
      className="rounded-[22px] px-5 py-5 flex flex-col gap-3
                 bg-[#FFFEFB] dark:bg-[#1C2717]
                 border border-[#F1D7DC] dark:border-[#3A2429]"
    >
      <h2 className="font-(family-name:--font-fraunces) text-lg text-[#8A4A57] dark:text-[#F0D6DA]">Danger zone</h2>
      <p className="text-sm text-[#5C6150] dark:text-[#AFAB92] m-0">
        Deleting your account permanently removes your habits, garden, and history. This can&apos;t be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className={`self-start text-sm font-medium rounded-full px-4 py-2 border border-current ${DANGER}`}
        >
          Delete account
        </button>
      ) : (
        <div className="flex flex-col gap-2 max-w-sm">
          <label className="text-xs text-[#5C6150] dark:text-[#AFAB92]">
            Type <span className="font-medium">DELETE</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="text-sm bg-transparent border-b border-[#D8D2C2] dark:border-[#333B27] outline-none py-1"
            autoFocus
          />
          {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || deleting}
              className="text-sm font-medium rounded-full px-4 py-2 disabled:opacity-40
                         bg-[#A3492E] dark:bg-[#E0715A] text-[#F5F0E2] dark:text-[#0D140A]"
            >
              {deleting ? "Deleting…" : "Permanently delete"}
            </button>
            <button
              onClick={() => {
                setConfirming(false);
                setConfirmText("");
                setError(null);
              }}
              className="text-sm text-[#5C6150] dark:text-[#AFAB92]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
