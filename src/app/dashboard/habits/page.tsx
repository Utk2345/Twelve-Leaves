import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitCard } from "@/components/habits/HabitCard";
import { fraunces, publicSans } from "./fonts";

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, session.user.id))
    .orderBy(asc(habits.createdAt));

  const active = allHabits.filter((h) => !h.archived);
  const archived = allHabits.filter((h) => h.archived);

  return (
    <main
      className={`${fraunces.variable} ${publicSans.variable} min-h-screen bg-[#FAF7F0] px-6 py-12 sm:px-10`}
    >
      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#24261F]">
            Your habits
          </h1>
          <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
            {active.length === 0
              ? "Nothing planted yet."
              : `${active.length} growing${archived.length ? `, ${archived.length} archived` : ""}.`}
          </p>
        </header>

        <AddHabitForm />

        {active.length === 0 ? (
          <div className="border-l-[3px] border-[#D8D2C2] px-5 py-6">
            <p className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744]">
              Add a habit above to start your garden. Each one you keep up
              with will grow something in{" "}
              <span className="font-[family-name:var(--font-fraunces)] italic">
                /garden
              </span>{" "}
              later on.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#EAE5D6]">
            {active.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}

        {archived.length > 0 && (
          <details className="group">
            <summary className="font-[family-name:var(--font-public-sans)] text-sm text-[#5B5744] cursor-pointer hover:text-[#24261F] select-none">
              Archived ({archived.length})
            </summary>
            <div className="flex flex-col divide-y divide-[#EAE5D6] mt-3">
              {archived.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
