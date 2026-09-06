import { z } from "zod";

// YYYY-MM-DD, matches the `date` column type on completions.completedOn
const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date string.");

export const createCompletionSchema = z.object({
  habitId: z.string().min(1),
  // Optional: the client's local "today", so a check-off lands on the
  // right calendar day for the user rather than the server's UTC day.
  // Falls back to server UTC today if omitted.
  completedOn: dateStringSchema.optional(),
});

export type CreateCompletionInput = z.infer<typeof createCompletionSchema>;
