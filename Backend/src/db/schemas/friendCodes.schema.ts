import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const friendCodes = pgTable("friend_codes", {
  code: text("code").primaryKey(),
  userId: text("user_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
