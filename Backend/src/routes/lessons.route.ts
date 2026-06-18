import { Hono } from "hono";
import { Variables } from "../lib/type-variables.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { db } from "../db/client.js";
import { userProfiles } from "../db/index.js";
import { eq } from "drizzle-orm";

import { norm } from "../lib/content.js";
import lessonsData from "../../../static-content/lessons/n5-lessons.json";
import hiraganaData from "../../../static-content/hiragana/n5-hiragana.json";
import katakanaData from "../../../static-content/katakana/n5-katakana.json";
import kanjiData from "../../../static-content/kanji/n5-kanji.json";
import vocabData from "../../../static-content/vocab/n5-vocab.json";
import grammarData from "../../../static-content/grammar/n5-grammar.json";

type ContentType = "hiragana" | "katakana" | "kanji" | "vocab" | "grammar";

type LessonItem = {
  contentId: string;
  contentType: ContentType;
  question: string;
  reading?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
};

function buildItems(lesson: (typeof lessonsData)[number]): LessonItem[] {
  const items: LessonItem[] = [];

  for (const id of lesson.hiraganaIds) {
    const c = hiraganaData.find((h) => h.character === id);
    items.push({
      contentId: id,
      contentType: "hiragana",
      question: id,
      reading: c?.romaji,
      meaning: norm(c?.romaji),
    });
  }

  for (const id of lesson.katakanaIds) {
    const c = katakanaData.find((k) => k.character === id);
    items.push({
      contentId: id,
      contentType: "katakana",
      question: id,
      reading: c?.romaji,
      meaning: norm(c?.romaji),
    });
  }

  for (const id of lesson.kanjiIds) {
    const c = kanjiData.find((k) => k.id === id);
    items.push({
      contentId: id,
      contentType: "kanji",
      question: c?.character ?? id,
      reading: [...(c?.onyomi ?? []), ...(c?.kunyomi ?? [])].join("、"),
      meaning: norm(c?.meaning),
    });
  }

  for (const id of lesson.vocabIds) {
    const c = vocabData.find((v) => v.id === id);
    items.push({
      contentId: id,
      contentType: "vocab",
      question: c?.word ?? id,
      reading: c?.reading,
      meaning: norm(c?.meaning),
    });
  }

  for (const id of lesson.grammarIds) {
    const c = grammarData.find((g) => g.id === id);
    items.push({
      contentId: id,
      contentType: "grammar",
      question: norm(c?.pattern),
      reading: undefined,
      meaning: norm(c?.meaning),
      example: c?.example,
      exampleTranslation: c?.exampleTranslation,
    });
  }

  return items;
}

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

    const currentDay = Number(profile[0]?.currentDay ?? 1);
    const lesson = lessonsData.find((l) => l.day === currentDay);

    if (!lesson) {
      return c.json({ error: "Lesson not found" }, 404);
    }

    return c.json({ lesson: { ...lesson, items: buildItems(lesson) } });
  } catch {
    return c.json({ error: "Failed to fetch today lessons" }, 500);
  }
});

lessonsRoute.get("/:day", async (c) => {
  try {
    const day = parseInt(c.req.param("day"));

    if (isNaN(day) || day < 1 || day > 165) {
      return c.json({ error: "Invalid day" }, 400);
    }

    const lesson = lessonsData.find((l) => l.day === day);

    if (!lesson) {
      return c.json({ error: "Lesson not found" }, 404);
    }

    return c.json({ ...lesson, items: buildItems(lesson) });
  } catch {
    return c.json({ error: "Failed to fetch lesson" }, 500);
  }
});

export default lessonsRoute;
