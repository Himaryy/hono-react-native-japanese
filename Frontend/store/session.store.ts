import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type JlptProfile = {
  jlptLevel: "N5" | "N4" | "N3";
  currentDay: number;
};

type SessionState = {
  user: User | null;
  profile: JlptProfile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: JlptProfile | null) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearSession: () => set({ user: null, profile: null }),
}));
