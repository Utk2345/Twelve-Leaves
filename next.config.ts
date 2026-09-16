import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Deliberately NOT the nonce-based strict CSP from the Next.js docs: that
// approach forces every page into dynamic rendering (no static
// optimization, no ISR, no CDN caching) and doesn't cover inline `style={{}}`
// attributes at all (CSP nonces only apply to <style> elements/<script>
// elements, never to inline style="" attributes) — and this app uses
// inline style={{}} for backgrounds throughout (layout background image,
// plant card art, etc). Using 'unsafe-inline' here keeps every existing
// page working exactly as before; script-src still blocks loading any
// *external* script from an untrusted origin, which is the more common
// real-world XSS vector anyway.
//
// img-src allowances, beyond 'self'/blob:/data:, exist because avatar
// photos come from three possible origins depending on how the user
// signed up / whether they've uploaded a custom photo:
//   - Vercel Blob storage (custom-uploaded avatars, see
//     src/app/api/profile/avatar/route.ts)
//   - avatars.githubusercontent.com (default GitHub OAuth profile photo)
//   - *.googleusercontent.com (default Google OAuth profile photo)
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://avatars.githubusercontent.com https://*.googleusercontent.com;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Legacy fallback for browsers that don't honor frame-ancestors.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing in this app uses these browser APIs — off by default.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Complements the HTTPS work from item 2. No `preload` — that's
          // a separate, hard-to-reverse commitment (submission to the
          // browser preload list); add it later only if you're sure.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;