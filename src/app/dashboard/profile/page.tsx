import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTheme } from "@/lib/theme";
import { AppNav } from "@/components/nav/AppNav";
import { AvatarNameCard } from "@/components/profile/AvatarNameCard";
import { PasswordCard } from "@/components/profile/PasswordCard";
import { DangerZoneCard } from "@/components/profile/DangerZoneCard";
import { PAGE_BG, INK, INK_MUTED } from "@/lib/ui-classes";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const theme = await getTheme();

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <AppNav theme={theme} userName={session.user.name ?? session.user.email} userImage={session.user.image} />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1 px-1">
          <h1 className={`font-[family-name:var(--font-fraunces)] text-3xl ${INK}`}>Profile &amp; settings</h1>
          <p className={`text-sm ${INK_MUTED}`}>{session.user.email}</p>
        </div>

        <AvatarNameCard initialName={session.user.name ?? ""} initialImage={session.user.image} />
        <PasswordCard />
        <DangerZoneCard />
      </main>
    </div>
  );
}
