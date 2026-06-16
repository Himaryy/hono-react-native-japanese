import z from "zod";

export const addFriendSchema = z.object({
  code: z.string().length(6),
});
