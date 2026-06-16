import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(),
  jlptLevel: text("jlpt_level").default("N5"),
  currentDay: integer("current_day").default(1),
  totalKanjiLearned: integer("total_kanji_learned").default(0),
  totalVocabLearned: integer("total_vocab_learned").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastStudiedAt: timestamp("last_studied_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
