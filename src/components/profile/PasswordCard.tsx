"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CARD, INK, INK_MUTED, DANGER, BTN_PRIMARY } from "@/lib/ui-classes";
import { changePasswordSchema } from "@/lib/validations/profile";

const FIELD =
  "bg-transparent border-b border-[#D8D2C2] dark:border-[#333B27] " +
  "focus:border-[#33502F] dark:focus:border-[#82B27C] outline-none py-1.5 pr-8 text-sm w-full";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.3 21.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.3 21.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function PasswordField({
  placeholder,
  autoComplete,
  value,
  onChange,
  minLength,
  maxLength,
}: {
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  maxLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD}
        required
        minLength={minLength}
        maxLength={maxLength}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`}
        className={`absolute right-0 top-1/2 -translate-y-1/2 ${INK_MUTED} hover:text-inherit`}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

export function PasswordCard() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    authClient.listAccounts().then(({ data }) => {
      setHasPassword(!!data?.some((a) => a.providerId === "credential"));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "That password isn't valid.");
      return;
    }

    setSaving(true);
    const result = await authClient.changePassword({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
      revokeOtherSessions: true,
    });
    setSaving(false);

    if (result.error) {
      setError(result.error.message ?? "Couldn't change your password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
  }

  // Avoid a layout jump while we check — this resolves in one fast client call.
  if (hasPassword === null) return null;

  return (
    <div className={`${CARD} px-5 py-5 flex flex-col gap-4`}>
      <h2 className={`font-(family-name:--font-fraunces) text-lg ${INK}`}>Password</h2>

      {!hasPassword ? (
        <p className={`text-sm ${INK_MUTED} m-0`}>
          You sign in with a connected account, so there&apos;s no password to change here.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
          <p className={`text-xs ${INK_MUTED} m-0`}>
            A password is set on this account. For security, we can&apos;t display your current
            password — only you know it. Enter it below to set a new one.
          </p>

          <PasswordField
            placeholder="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordField
            placeholder="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
            minLength={8}
            maxLength={128}
          />
          <PasswordField
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            minLength={8}
            maxLength={128}
          />

          {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}
          {success && (
            <p className="text-sm text-[#33502F] dark:text-[#82B27C] m-0">
              Password changed. Other signed-in devices have been signed out.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className={`self-start text-sm font-medium rounded-full px-4 py-2 disabled:opacity-40 ${BTN_PRIMARY}`}
          >
            {saving ? "Saving…" : "Change password"}
          </button>
        </form>
      )}
    </div>
  );
}
