import { api } from "@/lib/api-client";

export type ReviewItem = {
  id: string;
  contentId: string;
  contentType: "hiragana" | "katakana" | "kanji" | "vocab" | "grammar";
  nextReviewDate: string;
  question: string;
  reading?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
};

export const progressApi = {
  reviewItems: async (): Promise<{ items: ReviewItem[] }> => {
    // @ts-ignore
    const res = await api.api.progress["review-items"].$get();
    if (!res.ok) throw new Error("Failed to fetch review items");
    return res.json() as Promise<{ items: ReviewItem[] }>;
  },
  completeLesson: async (payload: {
    day: number;
    timeSpentMinutes: number;
    itemsMasteredCount: number;
  }): Promise<{ success: boolean }> => {
    // @ts-ignore
    const res = await api.api.progress["complete-lesson"].$post({ json: payload });
    if (!res.ok) throw new Error("Failed to complete lesson");
    return res.json() as Promise<{ success: boolean }>;
  },
  reviewItem: async (payload: {
    contentId: string;
    isCorrect: boolean;
  }): Promise<{ success: boolean }> => {
    // @ts-ignore
    const res = await api.api.progress["review-item"].$post({ json: payload });
    if (!res.ok) throw new Error("Failed to submit review");
    return res.json() as Promise<{ success: boolean }>;
  },
};
