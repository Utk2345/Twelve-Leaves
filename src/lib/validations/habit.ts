import { z } from "zod";

export const createHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name your habit.")
    .max(80, "Keep it under 80 characters."),
  targetPerWeek: z
    .number()
    .int()
    .min(1, "Target at least once a week.")
    .max(7, "Max is 7 times a week.")
    .default(7),
});

export const updateHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name your habit.")
    .max(80, "Keep it under 80 characters.")
    .optional(),
  targetPerWeek: z
    .number()
    .int()
    .min(1, "Target at least once a week.")
    .max(7, "Max is 7 times a week.")
    .optional(),
  archived: z.boolean().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
