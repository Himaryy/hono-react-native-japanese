import { Hono } from "hono";
import { Variables } from "../lib/type-variables";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../db/client";
import { userProfiles } from "../db";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { updateProfileSchema } from "../schemas/profile.schema";

const profileRoute = new Hono<{ Variables: Variables }>();

profileRoute.use("*", authMiddleware);

profileRoute.get("/", async (c) => {
  try {
    const userId = c.get("userId");

    const rows = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      const newProfile = {
        userId,
        jlptLevel: "N5",
        currentDay: 1,
        totalKanjiLearned: 0,
        totalVocabLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudiedAt: null,
        createdAt: new Date(),
      };

      await db.insert(userProfiles).values(newProfile);

      return c.json(newProfile);
    }

    return c.json(rows[0]);
  } catch {
    return c.json(
      {
        error: "Failed to fetch profile",
      },
      500,
    );
  }
});

profileRoute.patch("/", zValidator("json", updateProfileSchema), async (c) => {
  try {
    const userId = c.get("userId");
    const { jlptLevel } = c.req.valid("json");

    await db
      .update(userProfiles)
      .set({ jlptLevel })
      .where(eq(userProfiles.userId, userId));

    return c.json({
      success: true,
      jlptLevel,
    });
  } catch {
    return c.json(
      {
        error: "Failed to update profile",
      },
      500,
    );
  }
});

export default profileRoute;
