import { z } from "zod";

// No length cap exists anywhere by default for the account `name` field —
// not client-side, not in Better Auth's built-in schema. This is the one
// value used on both sign-up (email + OAuth) and the profile "change name"
// form, so it's validated in both places from this single schema.
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name can't be empty.")
  .max(100, "Keep it under 100 characters.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email.")
  .email("Enter a valid email address.");

// Matches auth.ts's emailAndPassword.minPasswordLength/maxPasswordLength —
// keep both in sync if you change one.
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Keep it under 128 characters.");

export const signUpSchema = z.object({
  // Genuinely optional here — SignInForm falls back to the email address
  // when left blank, so this only needs to cap length, not require content.
  // (Contrast with nameSchema itself, used by the profile "change name"
  // form, where blank isn't a valid choice.)
  name: z.string().trim().max(100, "Keep it under 100 characters.").optional(),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"],
  });
