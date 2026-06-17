import { api } from "@/lib/api-client";

export type LessonItem = {
  contentId: string;
  contentType: "hiragana" | "katakana" | "kanji" | "vocab" | "grammar";
  question: string;
  reading?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
};

export type Lesson = {
  day: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  items: LessonItem[];
};

export const lessonsApi = {
  today: async (): Promise<{ lesson: Lesson }> => {
    // @ts-ignore
    const res = await api.api.lessons.today.$get();
    if (!res.ok) throw new Error("Failed to fetch lesson");
    return res.json() as Promise<{ lesson: Lesson }>;
  },
  byDay: async (day: number): Promise<Lesson> => {
    // @ts-ignore
    const res = await api.api.lessons[":day"].$get({ param: { day: String(day) } });
    if (!res.ok) throw new Error("Failed to fetch lesson");
    return res.json() as Promise<Lesson>;
  },
};
