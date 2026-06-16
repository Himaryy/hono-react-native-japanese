import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../db/client";
import { reviewItems, userProgress } from "../db";
import { and, eq, lte } from "drizzle-orm";
import { Variables } from "../lib/type-variables";
import { zValidator } from "@hono/zod-validator";
import {
  completeLessonSchema,
  reviewItemsSchema,
} from "../schemas/progress.schema";

const progressRoute = new Hono<{ Variables: Variables }>();

progressRoute.use("*", authMiddleware);

progressRoute.get("/stats", async (c) => {
  try {
    const userId = c.get("userId");

    const rows = await db
      .select()
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.completed, true)),
      );

    const totalDaysStudied = rows.length;
    const kanjiMastered = rows.reduce(
      (sum, r) => sum + (r.itemsMasteredCount ?? 0),
      0,
    );

    const days = rows.map((r) => r.day).sort((a, b) => a - b);

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    for (let i = 0; i < days.length; i++) {
      if (i === 0 || days[i] === days[i - 1] + 1) {
        streak++;
      } else {
        streak = 1;
      }
      longestStreak = Math.max(longestStreak, streak);
    }

    if (days.length > 0 && days[days.length - 1] === days.length) {
      currentStreak = streak;
    }

    return c.json({
      totalDaysStudied,
      kanjiMastered,
      currentStreak,
      longestStreak,
    });
  } catch {
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

progressRoute.post(
  "/complete-lesson",
  zValidator("json", completeLessonSchema),
  async (c) => {
    try {
      const userId = c.get("userId");
      const { day, timeSpentMinutes, itemsMasteredCount } = c.req.valid("json");

      const existing = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.day, day)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({
            completed: true,
            completedAt: new Date(),
            timeSpentMinutes,
            itemsMasteredCount,
          })
          .where(
            and(eq(userProgress.userId, userId), eq(userProgress.day, day)),
          );

        return c.json({ success: true, action: "updated" });
      }

      await db.insert(userProgress).values({
        id: crypto.randomUUID(),
        userId,
        day,
        completed: true,
        completedAt: new Date(),
        timeSpentMinutes,
        itemsMasteredCount,
      });

      return c.json({ success: true, action: "created" }, 201);
    } catch {
      return c.json({ error: "Failed to complete lesson" }, 500);
    }
  },
);

progressRoute.get("/review-items", async (c) => {
  try {
    const userId = c.get("userId");
    const now = new Date();

    const items = await db
      .select()
      .from(reviewItems)
      .where(
        and(
          eq(reviewItems.userId, userId),
          lte(reviewItems.nextReviewDate, now),
        ),
      );

    return c.json({ items });
  } catch (error) {
    return c.json({ error: "Failed to fetch review items" }, 500);
  }
});

progressRoute.post(
  "/review-item",
  zValidator("json", reviewItemsSchema),
  async (c) => {
    try {
      const userId = c.get("userId");
      const { contentId, isCorrect } = c.req.valid("json");

      const existing = await db
        .select()
        .from(reviewItems)
        .where(
          and(
            eq(reviewItems.userId, userId),
            eq(reviewItems.contentId, contentId),
          ),
        )
        .limit(1);

      const now = new Date();

      if (existing.length === 0) {
        const nextReviewDate = new Date(now);
        nextReviewDate.setDate(nextReviewDate.getDate() + 1);

        await db.insert(reviewItems).values({
          id: crypto.randomUUID(),
          userId,
          contentId,
          nextReviewDate,
          repetitions: isCorrect ? 1 : 0,
          interval: 1,
          easyFactor: 2.5,
          lastReviewedAt: now,
        });

        return c.json({
          success: true,
          action: "created",
        });
      }

      const item = existing[0];

      let { interval, easyFactor, repetitions } = item;

      if (isCorrect) {
        interval = Math.round((interval ?? 1) * (easyFactor ?? 2.5));
        easyFactor = Math.min(3.0, (easyFactor ?? 2.5) + 0.1);
        repetitions = (repetitions ?? 0) + 1;
      } else {
        interval = 1;
        easyFactor = Math.max(1.3, (easyFactor ?? 2.5) - 0.2);
        repetitions = 0;
      }

      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);

      await db
        .update(reviewItems)
        .set({
          interval,
          easyFactor,
          repetitions,
          nextReviewDate,
          lastReviewedAt: now,
        })
        .where(
          and(
            eq(reviewItems.userId, userId),
            eq(reviewItems.contentId, contentId),
          ),
        );

      return c.json({
        success: true,
        action: "updated",
      });
    } catch (error) {
      return c.json({ error: "Failed to update review item" }, 500);
    }
  },
);

export default progressRoute;
