import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userProgress = pgTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  day: integer("day").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpentMinutes: integer("time_spent_minutes"),
  itemsMasteredCount: integer("items_mastered_count"),
});
