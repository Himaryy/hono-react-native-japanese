import { Hono } from "hono";
import { Variables } from "../lib/type-variables";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../db/client";
import { userProfiles } from "../db";
import { eq } from "drizzle-orm";

import lessonsData from "../../../static-content/lessons/n5-lessons.json";

const lessonsRoute = new Hono<{ Variables: Variables }>();

lessonsRoute.use("*", authMiddleware);

lessonsRoute.get("/today", async (c) => {
  try {
    const userId = c.get("userId");

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    const currentDay = profile[0]?.currentDay ?? 1;
    const lesson = lessonsData.find((l) => l.day === currentDay);

    if (!lesson) {
      return c.json({ error: "Lesson not found" }, 404);
    }

    return c.json({ lesson });
  } catch (error) {
    return c.json({ error: "Failed to fetch today lessons" }, 500);
  }
});

lessonsRoute.get("/:day", async (c) => {
  try {
    const day = parseInt(c.req.param("day"));

    if (isNaN(day) || day < 1 || day > 100) {
      return c.json({ error: "Invalid day" }, 400);
    }

    const lessons = lessonsData.find((l) => l.day === day);

    if (!lessons) {
      return c.json({ error: "Lesson not found" }, 404);
    }

    return c.json(lessons);
  } catch (error) {
    return c.json({ error: "Failed to fetch lesson" }, 500);
  }
});

export default lessonsRoute;
