# JLPT Learning App

> Personal project — built for a small friend group (Mina, Rio, Kenji) who are learning Japanese together.

A mobile app to study for JLPT N5→N3. Not a commercial product — just a fun tool to keep three friends accountable, track progress, and compete on streaks.

## Stack

**Backend** — Hono + Better Auth + Drizzle ORM + Neon PostgreSQL → Vercel Edge Functions  
**Frontend** — React Native + Expo + TanStack Query + Zustand + NativeWind

## Structure

```
expo-japanese/
├── Backend/              — API server
├── Frontend/             — Expo mobile app
├── Knowledge/            — Planning docs (PRD, build order)
└── static-content/       — N5 JSON content (kanji, vocab, grammar, lessons)
```

## Getting Started

### Backend

```bash
cd Backend
pnpm install
cp .env.example .env   # fill in DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
pnpm db:generate
pnpm db:migrate
pnpm dev               # http://localhost:3000
```

### Frontend

```bash
cd Frontend
pnpm install
cp .env.example .env.local   # fill in EXPO_PUBLIC_API_URL
pnpm start
```

## API

Base URL: `EXPO_PUBLIC_API_URL`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/sign-up/email` | Register |
| POST | `/api/auth/sign-in/email` | Login |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/profile` | JLPT profile |
| PATCH | `/api/profile` | Update JLPT level |
| GET | `/api/progress/stats` | Streak, kanji count |
| POST | `/api/progress/complete-lesson` | Mark lesson done |
| GET | `/api/progress/review-items` | SRS items due today |
| POST | `/api/progress/review-item` | Submit review result |
| GET | `/api/lessons/today` | Today's lesson |
| GET | `/api/lessons/:day` | Specific day lesson |
| GET | `/api/friends/code` | Your friend code |
| POST | `/api/friends/add` | Add friend by code |
| GET | `/api/friends/list` | Friend list |
| GET | `/api/friends/leaderboard` | Streak leaderboard |
| DELETE | `/api/friends/:friendId` | Remove friend |

## Environment Variables

```bash
# Backend/.env
DATABASE_URL=postgresql://...neon.tech/jlpt_db?sslmode=require
BETTER_AUTH_SECRET=min-32-char-secret
BETTER_AUTH_URL=http://localhost:3000

# Frontend/.env.local
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Build Status

- ✅ Backend — all routes complete
- ✅ Neon DB — 9 tables live
- ✅ Static content — N5 kanji, vocab, grammar, hiragana, katakana, lessons
- 🔴 Frontend — not yet started
- 🔴 Vercel — not yet deployed
