"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CARD, INK, INK_MUTED, DANGER, BTN_PRIMARY } from "@/lib/ui-classes";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AvatarNameCard({
  initialName,
  initialImage,
}: {
  initialName: string;
  initialImage?: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(initialImage ?? null);
  const [name, setName] = useState(initialName);
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file again still fires onChange
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setUploading(false);
      setError(data?.error ?? "Couldn't upload that image.");
      return;
    }

    const result = await authClient.updateUser({ image: data.url });
    setUploading(false);
    if (result.error) {
      setError(result.error.message ?? "Uploaded, but couldn't save it to your profile.");
      return;
    }

    setImage(data.url);
    setSuccess("Photo updated.");
    router.refresh();
  }

  async function handleRemovePhoto() {
    setError(null);
    setSuccess(null);
    const result = await authClient.updateUser({ image: null });
    if (result.error) {
      setError(result.error.message ?? "Couldn't remove that photo.");
      return;
    }
    setImage(null);
    router.refresh();
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSavingName(true);
    const result = await authClient.updateUser({ name });
    setSavingName(false);
    if (result.error) {
      setError(result.error.message ?? "Couldn't save your name.");
      return;
    }
    setSuccess("Name updated.");
    router.refresh();
  }

  return (
    <div className={`${CARD} px-5 py-5 flex flex-col gap-5`}>
      <h2 className={`font-(family-name:--font-fraunces) text-lg ${INK}`}>Profile</h2>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-lg font-semibold
                       bg-gradient-to-br from-[#33502F] to-[#86A971] dark:from-[#82B27C] dark:to-[#9AC286]
                       text-[#F5F0E2] dark:text-[#0D140A]"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              initials(name || "?")
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-[10px]">
              …
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`text-xs font-medium rounded-full px-3.5 py-1.5 disabled:opacity-50 ${BTN_PRIMARY}`}
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            {image && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className={`text-xs ${INK_MUTED} hover:text-[#21251A] dark:hover:text-[#ECE8D8]`}
              >
                Remove
              </button>
            )}
          </div>
          <span className={`text-[11px] ${INK_MUTED}`}>JPG, PNG or WEBP. Up to 4MB.</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleSaveName} className="flex flex-col gap-1.5 max-w-sm">
        <label htmlFor="profile-name" className={`text-xs font-medium ${INK_MUTED}`}>
          Name
        </label>
        <div className="flex items-center gap-3">
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`flex-1 font-(family-name:--font-fraunces) text-lg ${INK}
                        bg-transparent border-b border-[#D8D2C2] dark:border-[#333B27]
                        focus:border-[#33502F] dark:focus:border-[#82B27C] outline-none py-1`}
          />
          <button
            type="submit"
            disabled={savingName || name.trim().length === 0 || name === initialName}
            className={`shrink-0 text-sm font-medium rounded-full px-4 py-2 disabled:opacity-40 ${BTN_PRIMARY}`}
          >
            {savingName ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {error && <p className={`text-sm ${DANGER} m-0`}>{error}</p>}
      {success && !error && <p className="text-sm text-[#33502F] dark:text-[#82B27C] m-0">{success}</p>}
    </div>
  );
}
