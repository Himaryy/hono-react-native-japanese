import z from "zod";

export const updateProfileSchema = z.object({
  jlptLevel: z.enum(["N5", "N4", "N3", "N2", "N1"]),
});
