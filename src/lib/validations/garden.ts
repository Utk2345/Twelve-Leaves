import { z } from "zod";

export const selectPlantSchema = z.object({
  // null clears the selection, reverting the bloom stage to its default art.
  plantId: z.string().min(1).nullable(),
});

export type SelectPlantInput = z.infer<typeof selectPlantSchema>;
