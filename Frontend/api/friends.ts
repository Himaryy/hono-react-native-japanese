import { api } from "@/lib/api-client";

export type Friend = {
  id: string;
  name: string;
  currentStreak: number;
  lastStudiedAt: string | null;
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  jlptLevel: string | null;
  currentStreak: number | null;
  currentDay: number | null;
  lastStudiedAt: string | null;
};

export const friendsApi = {
  code: async (): Promise<{ code: string }> => {
    // @ts-ignore
    const res = await api.api.friends.code.$get();
    if (!res.ok) throw new Error("Failed to fetch friend code");
    return res.json() as Promise<{ code: string }>;
  },
  list: async (): Promise<{ friends: Friend[] }> => {
    // @ts-ignore
    const res = await api.api.friends.list.$get();
    if (!res.ok) throw new Error("Failed to fetch friends");
    return res.json() as Promise<{ friends: Friend[] }>;
  },
  activity: async (): Promise<{ friends: Friend[] }> => {
    // @ts-ignore
    const res = await api.api.friends.activity.$get();
    if (!res.ok) throw new Error("Failed to fetch friends activity");
    return res.json() as Promise<{ friends: Friend[] }>;
  },
  leaderboard: async (): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    // @ts-ignore
    const res = await api.api.friends.leaderboard.$get();
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return res.json() as Promise<{ leaderboard: LeaderboardEntry[] }>;
  },
  add: async (code: string): Promise<{ success: boolean }> => {
    // @ts-ignore
    const res = await api.api.friends.add.$post({ json: { code } });
    if (!res.ok) throw new Error("Failed to add friend");
    return res.json() as Promise<{ success: boolean }>;
  },
  remove: async (friendId: string): Promise<{ success: boolean }> => {
    // @ts-ignore
    const res = await api.api.friends[":friendId"].$delete({
      param: { friendId },
    });
    if (!res.ok) throw new Error("Failed to remove friend");
    return res.json() as Promise<{ success: boolean }>;
  },
};
