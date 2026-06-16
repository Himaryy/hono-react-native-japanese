import { z } from "zod";

export const completeLessonSchema = z.object({
  day: z.number(),
  timeSpentMinutes: z.number(),
  itemsMasteredCount: z.number(),
});

export const reviewItemsSchema = z.object({
  contentId: z.string(),
  isCorrect: z.boolean(),
});
