"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CARD, INK, INK_MUTED, DANGER, LINK } from "@/lib/ui-classes";

const PROVIDERS = [
  { id: "credential", label: "Email & password", linkable: false },
  { id: "github", label: "GitHub", linkable: true },
  { id: "google", label: "Google", linkable: true },
] as const;

export function LinkedAccountsCard() {
  const [accounts, setAccounts] = useState<{ id: string; providerId: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);

  async function refresh() {
    const { data } = await authClient.listAccounts();
    setAccounts(data ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleUnlink(providerId: string) {
    const account = accounts?.find((a) => a.providerId === providerId);
    if (!account) return;

    setError(null);
    setBusyProvider(providerId);
    const result = await authClient.unlinkAccount({ accountId: account.id });
    setBusyProvider(null);
    if (result.error) {
      setError(result.error.message ?? "Couldn't disconnect that account.");
      return;
    }
    refresh();
  }

  async function handleLink(providerId: "github" | "google") {
    setError(null);
    await authClient.linkSocial({ provider: providerId, callbackURL: "/dashboard/profile" });
  }

  if (!accounts) return null;

  const connectedCount = accounts.length;

  return (
    <div className={`${CARD} px-5 py-5 flex flex-col gap-2`}>
      <h2 className={`font-(family-name:--font-fraunces) text-lg ${INK} mb-1`}>Connected accounts</h2>

      <div className="flex flex-col divide-y divide-[#EEE8D6] dark:divide-[#24311C]">
        {PROVIDERS.map((p) => {
          const connected = accounts.some((a) => a.providerId === p.id);
          const isOnlyMethod = connected && connectedCount === 1;

          return (
            <div key={p.id} className="flex items-center justify-between py-3">
              <span className={`text-sm ${INK}`}>{p.label}</span>

              {connected ? (
                p.linkable ? (
                  <button
                    onClick={() => handleUnlink(p.id)}
                    disabled={isOnlyMethod || busyProvider === p.id}
                    title={isOnlyMethod ? "This is your only sign-in method" : undefined}
                    className={`text-xs ${INK_MUTED} hover:text-[#A3492E] dark:hover:text-[#E0715A] disabled:opacity-40 disabled:hover:text-inherit`}
                  >
                    {busyProvider === p.id ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : (
                  <span className={`text-xs ${INK_MUTED}`}>Connected</span>
                )
              ) : p.linkable ? (
                <button onClick={() => handleLink(p.id)} className={`text-xs font-medium ${LINK}`}>
                  Connect
                </button>
              ) : (
                <span className={`text-xs ${INK_MUTED}`}>Not set</span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}
    </div>
  );
}