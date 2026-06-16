import { Hono } from "hono";
import { Variables } from "../lib/type-variables";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../db/client";
import { friendCodes, friendships, userProfiles } from "../db";
import { and, eq, or } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { addFriendSchema } from "../schemas/friends.schema";

const friendsRoute = new Hono<{ Variables: Variables }>();

friendsRoute.use("*", authMiddleware);

friendsRoute.get("/code", async (c) => {
  try {
    const userId = c.get("userId");
    const existing = await db
      .select()
      .from(friendCodes)
      .where(eq(friendCodes.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return c.json({
        code: existing[0].code,
      });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await db.insert(friendCodes).values({ code, userId });

    return c.json({ code });
  } catch {
    return c.json(
      {
        error: "Failed to get friend code",
      },
      500,
    );
  }
});

friendsRoute.post(
  "/add-friend",
  zValidator("json", addFriendSchema),
  async (c) => {
    try {
      const userId = c.get("userId");
      const { code } = c.req.valid("json");

      const target = await db
        .select()
        .from(friendCodes)
        .where(eq(friendCodes.code, code))
        .limit(1);

      if (target.length === 0) {
        return c.json({ error: "Invalid code" }, 404);
      }

      if (target[0].userId === userId) {
        return c.json({ error: "Cannot add yourself" }, 400);
      }

      const [userId1, userId2] = [userId, target[0].userId].sort();

      await db.insert(friendships).values({
        userId1,
        userId2,
      });

      return c.json({ success: true }, 201);
    } catch {
      return c.json({
        error: "Failed to add friend",
      });
    }
  },
);

friendsRoute.get("/list-friends", async (c) => {
  try {
    const userId = c.get("userId");
    const rows = await db
      .select()
      .from(friendships)
      .where(
        or(eq(friendships.userId1, userId), eq(friendships.userId2, userId)),
      );

    const friendIds = rows.map((r) =>
      r.userId1 === userId ? r.userId2 : r.userId1,
    );

    return c.json({ friends: friendIds });
  } catch (error) {
    return c.json({ error: "Failed to get friends" }, 500);
  }
});

friendsRoute.get("/leaderboard", async (c) => {
  try {
    const userId = c.get("userId");
    const rows = await db
      .select()
      .from(friendships)
      .where(
        or(eq(friendships.userId1, userId), eq(friendships.userId2, userId)),
      );

    const friendIds = rows.map((r) =>
      r.userId1 === userId ? r.userId2 : r.userId1,
    );

    const allIds = [userId, ...friendIds];

    const profiles = await db
      .select()
      .from(userProfiles)
      .where(or(...allIds.map((id) => eq(userProfiles.userId, id))));

    const sorted = profiles.sort(
      (a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0),
    );

    return c.json({ leaderboard: sorted });
  } catch (error) {
    return c.json({ error: "Failed to get leaderboard" }, 500);
  }
});

friendsRoute.delete("/:friendId", async (c) => {
  try {
    const userId = c.get("userId");
    const friendId = c.req.param("friendId");
    const [userId1, userId2] = [userId, friendId].sort();

    await db
      .delete(friendships)
      .where(
        and(eq(friendships.userId1, userId1), eq(friendships.userId2, userId2)),
      );

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to remove friend" });
  }
});

export default friendsRoute;
