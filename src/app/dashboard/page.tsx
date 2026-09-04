import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Welcome, {session.user.name ?? session.user.email}
        </h1>
        <p className="mt-2 text-neutral-500">
          Session 2 checkpoint — habit list comes in Session 3.
        </p>
        <SignOutButton />
      </div>
    </main>
  );
}
