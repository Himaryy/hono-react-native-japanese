import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../db/client";
import { reviewItems, userProgress, userProfiles } from "../db";
import { and, eq, lte } from "drizzle-orm";
import { Variables } from "../lib/type-variables";
import { zValidator } from "@hono/zod-validator";
import {
  completeLessonSchema,
  reviewItemsSchema,
} from "../schemas/progress.schema";
import lessonsData from "../../../static-content/lessons/n5-lessons.json";

import { norm } from "../lib/content";
import hiraganaData from "../../../static-content/hiragana/n5-hiragana.json";
import katakanaData from "../../../static-content/katakana/n5-katakana.json";
import kanjiData from "../../../static-content/kanji/n5-kanji.json";
import vocabData from "../../../static-content/vocab/n5-vocab.json";
import grammarData from "../../../static-content/grammar/n5-grammar.json";

type ContentType = "hiragana" | "katakana" | "kanji" | "vocab" | "grammar";

function getContentType(contentId: string): ContentType {
  if (contentId.startsWith("kanji_")) return "kanji";
  if (contentId.startsWith("vocab_")) return "vocab";
  if (contentId.startsWith("grammar_")) return "grammar";
  const code = contentId.charCodeAt(0);
  if (code >= 0x3040 && code <= 0x309f) return "hiragana";
  return "katakana";
}

function enrichItem(item: typeof reviewItems.$inferSelect) {
  const contentType = getContentType(item.contentId);
  switch (contentType) {
    case "hiragana": {
      const c = hiraganaData.find((h) => h.character === item.contentId);
      return {
        ...item,
        contentType,
        question: item.contentId,
        reading: c?.romaji,
        meaning: c?.romaji ?? "?",
      };
    }
    case "katakana": {
      const c = katakanaData.find((k) => k.character === item.contentId);
      return {
        ...item,
        contentType,
        question: item.contentId,
        reading: c?.romaji,
        meaning: c?.romaji ?? "?",
      };
    }
    case "kanji": {
      const c = kanjiData.find((k) => k.id === item.contentId);
      return {
        ...item,
        contentType,
        question: c?.character ?? item.contentId,
        reading: [...(c?.onyomi ?? []), ...(c?.kunyomi ?? [])].join("、"),
        meaning: norm(c?.meaning),
      };
    }
    case "vocab": {
      const c = vocabData.find((v) => v.id === item.contentId);
      return {
        ...item,
        contentType,
        question: c?.word ?? item.contentId,
        reading: c?.reading,
        meaning: norm(c?.meaning),
      };
    }
    case "grammar": {
      const c = grammarData.find((g) => g.id === item.contentId);
      return {
        ...item,
        contentType,
        question: c?.pattern ?? item.contentId,
        reading: undefined,
        meaning: norm(c?.meaning),
        example: c?.example,
        exampleTranslation: c?.exampleTranslation,
      };
    }
  }
}

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

      const [existing, profile] = await Promise.all([
        db
          .select()
          .from(userProgress)
          .where(and(eq(userProgress.userId, userId), eq(userProgress.day, day)))
          .limit(1),
        db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .limit(1),
      ]);

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
      } else {
        await db.insert(userProgress).values({
          id: crypto.randomUUID(),
          userId,
          day,
          completed: true,
          completedAt: new Date(),
          timeSpentMinutes,
          itemsMasteredCount,
        });
      }

      // Recalculate streak from all completed days
      const allCompleted = await db
        .select({ day: userProgress.day })
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));

      const sortedDays = [...new Set(allCompleted.map((r) => r.day))].sort((a, b) => a - b);
      let streak = 0;
      for (let i = sortedDays.length - 1; i >= 0; i--) {
        const expected = (sortedDays[sortedDays.length - 1]!) - (sortedDays.length - 1 - i);
        if (sortedDays[i] === expected) streak++;
        else break;
      }

      // Advance currentDay if profile is still on this day, always update streak
      const currentDay = Number(profile[0]?.currentDay ?? 1);
      await db
        .update(userProfiles)
        .set({
          currentStreak: streak,
          lastStudiedAt: new Date(),
          ...(currentDay === day ? { currentDay: Math.min(day + 1, 165) } : {}),
        })
        .where(eq(userProfiles.userId, userId));

      // Seed review items for all content in this lesson
      const lesson = lessonsData.find((l) => l.day === day);
      if (lesson) {
        const allIds = [
          ...lesson.hiraganaIds,
          ...lesson.katakanaIds,
          ...lesson.kanjiIds,
          ...lesson.vocabIds,
          ...lesson.grammarIds,
        ];

        // Only insert items not already tracked
        const existingReviews = allIds.length > 0
          ? await db
              .select({ contentId: reviewItems.contentId })
              .from(reviewItems)
              .where(eq(reviewItems.userId, userId))
          : [];

        const existingIds = new Set(existingReviews.map((r) => r.contentId));
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const toInsert = allIds
          .filter((id) => !existingIds.has(id))
          .map((contentId) => ({
            id: crypto.randomUUID(),
            userId,
            contentId,
            nextReviewDate: tomorrow,
            repetitions: 1,
            interval: 1,
            easyFactor: 2.5,
            lastReviewedAt: now,
          }));

        if (toInsert.length > 0) {
          await db.insert(reviewItems).values(toInsert);
        }
      }

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

    return c.json({ items: items.map(enrichItem) });
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
