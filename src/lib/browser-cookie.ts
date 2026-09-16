/**
 * Sets a first-party, non-sensitive cookie from the browser (theme, detected
 * timezone, etc). Not for auth/session cookies — those are issued server-side
 * by Better Auth, which already marks them httpOnly + Secure in production.
 *
 * Adds `; Secure` automatically whenever the page itself is loaded over
 * https, so the cookie can never be replayed over a plain-http connection
 * (mixed-content / downgrade protection). Left off on http so this keeps
 * working unchanged during local dev (`next dev` on http://localhost).
 */
export function setBrowserCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}
