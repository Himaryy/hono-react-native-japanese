import { api } from "@/lib/api-client";

export type Profile = {
  jlptLevel: string;
  currentDay: number;
  totalKanjiLearned: number;
  totalVocabLearned: number;
  currentStreak: number;
};

export const profileApi = {
  get: async (): Promise<Profile> => {
    // @ts-ignore
    const res = await api.api.profile.$get();
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json() as Promise<Profile>;
  },
  update: async (payload: { jlptLevel: string }): Promise<Profile> => {
    //@ts-ignore
    const res = await api.api.profile.$patch({
      json: payload,
    });

    if (!res.ok) throw new Error("Failed to update profile");

    return res.json() as Promise<Profile>;
  },
};
