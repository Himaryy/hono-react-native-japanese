import { integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const reviewItems = pgTable("review_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  contentId: text("content_id").notNull(),
  nextReviewDate: timestamp("next_review_date").notNull(),
  repetitions: integer("repetitions").default(0),
  interval: integer("interval").default(1),
  easyFactor: real("easy_factor").default(2.5),
  lastReviewedAt: timestamp("last_reviewed_at"),
});
