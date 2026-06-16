import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const friendships = pgTable(
  "friendships",
  {
    userId1: text("user_id_1").notNull(),
    userId2: text("user_id_2").notNull(),
    addedAt: timestamp("added_at").defaultNow(),
    status: text("status").default("active"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId1, table.userId2],
    }),
  }),
);
