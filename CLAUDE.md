# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repo.

## Project Overview

JLPT Learning App — Japanese study app for small friend group (Mina, Rio, Kenji), targeting JLPT N5→N3. Backend + frontend **built from scratch** inside this repo.

## Folder Structure

```
expo-japanese/
├── Backend/     — Hono + Better Auth + Drizzle ORM + Neon PostgreSQL → deploy to Vercel
├── Frontend/    — React Native + Expo app
└── Knowledge/   — Planning docs (PRD, build order, reference)
```

## Build Commands

### Backend
```bash
cd Backend
pnpm install
pnpm db:generate    # Generate Drizzle migrations from schema
pnpm db:migrate     # Apply migrations to Neon PostgreSQL
pnpm dev            # Local Hono server
vercel --prod       # Deploy to Vercel Edge Functions
```

### Frontend
```bash
cd Frontend
pnpm install
pnpm start              # Start Expo dev server
pnpm android            # Android emulator
pnpm ios                # iOS simulator
eas build --platform ios       # Production iOS build
eas build --platform android   # Production Android build
eas submit --platform ios      # Submit to TestFlight
```

## Architecture

### Data Flow
```
Expo UI → TanStack Query → Hono Backend → Neon PostgreSQL
                ↑
         (caches responses)
```

Auth uses Better Auth with HttpOnly cookies. All API calls must include `credentials: 'include'`.

### Backend Stack
- **Hono** — lightweight TypeScript web framework
- **Better Auth** — auth (email/password, sessions, HttpOnly cookies)
- **Drizzle ORM** — type-safe DB queries
- **Neon PostgreSQL** — serverless database
- **Vercel Edge Functions** — deployment

### Frontend Stack
- **React Native + Expo** — UI
- **React Navigation** — bottom tabs (Dashboard, Learn, Review, Profile, Friends) + auth stack
- **TanStack Query** — all API calls and caching (never fetch directly in components)
- **Zustand** — global state (user profile, session)
- **NativeWind** — Tailwind-style styling for React Native
- **Better Auth client** — `createAuthClient()` from `better-auth/react`

### Navigation Structure
```
App
├── AuthStack (unauthenticated)
│   ├── SignUp
│   └── Login
└── MainTabs (authenticated)
    ├── Dashboard
    ├── Lesson
    ├── Review
    ├── Profile
    └── Friends
```

### Static Content
N5 curriculum bundled as JSON in `Frontend/static-content/`:
- `kanji/n5-kanji.json` — 100 kanji
- `vocab/n5-vocab.json` — 400 words
- `grammar/n5-grammar.json` — 20 grammar patterns
- `hiragana/n5-hiragana.json`, `katakana/n5-katakana.json` — 46 chars each
- `lessons/n5-lessons.json` — 100-day lesson plan
- `audio/*.mp3` — pronunciations

## API Endpoints (to be built)

Base URL: `process.env.EXPO_PUBLIC_API_URL`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/sign-up` | `{ email, password, name }` |
| POST | `/auth/sign-in` | `{ email, password }` |
| POST | `/auth/sign-out` | End session |
| GET | `/auth/session` | Current session |
| GET | `/api/auth/profile` | JLPT profile (level, currentDay) |
| PATCH | `/api/auth/profile` | `{ jlptLevel }` |
| GET | `/api/lessons/today` | Today's lesson |
| GET | `/api/lessons/:day` | Specific day's lesson |
| GET | `/api/progress/stats` | Streak, kanji count, etc. |
| POST | `/api/progress/complete-lesson` | `{ day, timeSpentMinutes, itemsMasteredCount }` |
| GET | `/api/progress/review-items` | SRS items due today |
| POST | `/api/progress/review-item` | `{ contentId, isCorrect }` |
| GET | `/api/friends/code` | User's friend code |
| POST | `/api/friends/add` | `{ code }` |
| GET | `/api/friends/list` | Friend list |
| GET | `/api/friends/activity` | Friends' last study times |
| GET | `/api/friends/leaderboard` | Sorted by streak |
| DELETE | `/api/friends/:friendId` | Remove friend |

## Environment Variables

```bash
# Backend/.env
DATABASE_URL=postgresql://...neon.tech/jlpt_db?sslmode=require
BETTER_AUTH_SECRET=min-32-char-secret
BETTER_AUTH_URL=https://your-backend.vercel.app

# Frontend/.env.local
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Coding Rules

**Always:**
- TypeScript (`.ts` / `.tsx`) — no `any`
- Functional components + hooks only
- TanStack Query for all API calls (never fetch directly in components)
- Zustand for global state
- `SafeAreaView` for all screens
- `useCallback` for memoization
- `credentials: 'include'` on every fetch (Better Auth cookies)

**Never:**
- Redux (use Zustand)
- AsyncStorage (use TanStack Query + backend)
- Class components
- Hardcoded backend URLs (use `EXPO_PUBLIC_API_URL`)
- SQLite for MVP
- Rebuild auth — Better Auth handles sign-up/sign-in/session/cookies

**File naming:**
- Screens: `PascalCaseScreen.tsx`
- Components: `PascalCase.tsx`
- Services: `camelCase.ts`
- Hooks: `useFeature.ts`

**Styling:** 8/16/24px spacing grid, 44px min tap targets, flex layout (no hardcoded widths), NativeWind classes.

## Current Build Status

- ✅ `Backend/` — all routes complete (auth, profile, progress, lessons, friends)
- ✅ Neon DB — 9 tables live
- ✅ Static content JSON — all N5 content created (kanji, vocab, grammar, hiragana, katakana, lessons)
- 🔴 `Frontend/` — not yet started
- 🔴 Vercel — not yet deployed

**Build order:** Backend → Neon DB → Deploy Vercel → Frontend → Connect

## Active Skills & Tools

### `/karpathy-guidelines`
Invoke before write/review/refactor. Prevents overcomplication, enforces surgical changes, surfaces hidden assumptions, defines verifiable success criteria.

### `/impeccable`
Use for all UI work — screens, components, styling. Produces production-grade React Native UI. Trigger before any screen or component.

### Caveman mode + Cavecrew
Token efficiency. Active via session hook. Use `full` (default) or `ultra`. Commands: `/caveman full`, `/caveman ultra`, `stop caveman`.
Cavecrew subagents — use when applicable to save main context:
- `cavecrew-investigator` — locate code, map files, find where X defined
- `cavecrew-builder` — surgical 1-2 file edits
- `cavecrew-reviewer` — review diffs/PRs/files

### Context7 (`mcp__plugin_context7_context7__query-docs`)
Fetch current docs for any library before use — Expo, React Navigation, TanStack Query, Zustand, NativeWind, Better Auth, Drizzle, Hono. Never rely on training-data knowledge for API signatures or config. Use even for well-known libraries.

### React Native Reusables
shadcn-style component library for React Native. Docs: https://reactnativereusables.com/docs
Check before writing custom UI primitives. Pairs with NativeWind.

## Key Docs

All planning docs in `Knowledge/`:
- `BUILD_ORDER.md` — numbered task list with effort estimates
- `JLPT_App_PRD.md` — full product spec including screen wireframes and data models
- `JLPT_Backend_BetterAuth.md` — backend schema, auth setup, route examples
- `JLPT_Backend_Setup.md` — backend structure, DB schema, deployment steps
- `CLARIFICATIONS.md` — persona details and architecture decisions

## graphify

Knowledge graph at graphify-out/ with god nodes, community structure, cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. Returns scoped subgraph — smaller than GRAPH_REPORT.md or raw grep.
- If graphify-out/wiki/index.md exists, use for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain surface insufficient context.
- After modifying code, run `graphify update .` to keep graph current (AST-only, no API cost).