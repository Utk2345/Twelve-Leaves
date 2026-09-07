import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";

/** The visitor's saved theme choice (Server Components only). Defaults to "light" until they toggle it. */
export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}
