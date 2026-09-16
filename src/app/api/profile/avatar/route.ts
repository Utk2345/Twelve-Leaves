import { put } from "@vercel/blob";
import { headers } from "next/headers";
import sharp from "sharp";
import { auth } from "@/lib/auth";

// Requires the @vercel/blob package and a BLOB_READ_WRITE_TOKEN env var
// (Vercel dashboard → Storage → Create Database → Blob, then
// `vercel env pull` locally). This route only handles storage — saving the
// resulting URL onto the user record happens client-side via
// authClient.updateUser({ image }), the same call used for name changes.

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// Vercel Functions cap request bodies around 4.5MB — stay comfortably under it.
const MAX_BYTES = 4 * 1024 * 1024;

// Avatars only ever render at 64px (AvatarNameCard) or 36px (UserMenu),
// both circular. Uploads used to be stored and served at whatever
// resolution the user's phone camera produced (often several MB) and
// scaled down purely in CSS — full bytes downloaded on every page just to
// be shrunk into a 36–64px circle. Resizing/cropping to a fixed square and
// re-encoding as WebP server-side means every avatar is a few KB
// regardless of what was uploaded, with 4x headroom over the largest
// on-screen size for retina displays.
const AVATAR_SIZE = 256;

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

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Please upload a JPG, PNG, or WEBP image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image must be under 4MB." }, { status: 400 });
  }

  let resized: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    resized = await sharp(input)
      .rotate() // apply EXIF orientation before cropping, then drop it
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return Response.json({ error: "That image couldn't be processed. Try a different file." }, { status: 400 });
  }

  const blob = await put(`avatars/${session.user.id}-${Date.now()}.webp`, resized, {
    access: "public",
    contentType: "image/webp",
  });

  return Response.json({ url: blob.url });
}
