import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Requires the @vercel/blob package and a BLOB_READ_WRITE_TOKEN env var
// (Vercel dashboard → Storage → Create Database → Blob, then
// `vercel env pull` locally). This route only handles storage — saving the
// resulting URL onto the user record happens client-side via
// authClient.updateUser({ image }), the same call used for name changes.

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Vercel Functions cap request bodies around 4.5MB — stay comfortably under it.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json({ error: "Please upload a JPG, PNG, or WEBP image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image must be under 4MB." }, { status: 400 });
  }

  const blob = await put(`avatars/${session.user.id}-${Date.now()}.${ext}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
