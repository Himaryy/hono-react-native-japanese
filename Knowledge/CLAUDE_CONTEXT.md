# CLAUDE.md - AI Context & Project Rules for JLPT App

**Purpose**: This file tells Claude (or any AI) the exact context of your JLPT app project so it understands your tech stack, architecture, and coding standards.

**When to use**: Paste the content below into Claude before asking coding questions.

---

## PROJECT OVERVIEW

**Project**: JLPT Learning App (Japanese Language Proficiency Test preparation)  
**Target Users**: 3–5 friends (Mina, Rio, Kenji)  
**Status**: Development phase  
**Timeline**: 6 weeks to MVP  

---

## TECH STACK

### Backend (COMPLETE - ALREADY BUILT)
- **Framework**: Hono (TypeScript)
- **Auth**: Better Auth (email/password)
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL (serverless)
- **Deployment**: Vercel Edge Functions
- **Status**: ✅ Ready to use

**Important**: Backend is ALREADY BUILT. Do NOT rebuild auth, database, or API structure.

### Frontend (IN DEVELOPMENT)
- **Framework**: React Native + Expo
- **Navigation**: React Navigation (bottom tabs)
- **State**: Zustand (global state)
- **API Client**: TanStack Query (HTTP calls + caching)
- **Styling**: NativeWind (Tailwind for React Native)
- **Local Storage**: SQLite (optional, Phase 2 for offline)

### Content
- **Kanji/Vocab/Grammar**: Static JSON files
- **Audio**: MP3 files (Forvo or recorded)
- **Lessons**: 100-day N5 curriculum

### Future Integration
- **AI Explanations**: DeepSeek API (Phase 2)

---

## PROJECT STRUCTURE

```
jlpt-app-frontend/
├── src/
│   ├── screens/
│   │   ├── AuthScreen.tsx        (Login/Signup)
│   │   ├── DashboardScreen.tsx   (Home)
│   │   ├── LessonScreen.tsx      (Daily lesson)
│   │   ├── ReviewScreen.tsx      (SRS flashcards)
│   │   ├── ProfileScreen.tsx     (User stats)
│   │   └── FriendsScreen.tsx     (Leaderboards)
│   ├── components/
│   │   ├── StreakCounter.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── FlashCard.tsx
│   │   └── LeaderboardList.tsx
│   ├── services/
│   │   ├── authService.ts        (API calls for auth)
│   │   ├── lessonService.ts      (API calls for lessons)
│   │   ├── progressService.ts    (API calls for progress)
│   │   └── friendsService.ts     (API calls for friends)
│   ├── hooks/
│   │   ├── useAuth.ts            (Auth context)
│   │   ├── useProgress.ts        (Progress queries)
│   │   └── useFriends.ts         (Friends queries)
│   ├── store/
│   │   └── appStore.ts           (Zustand global state)
│   ├── types/
│   │   └── index.ts              (TypeScript types)
│   ├── App.tsx                   (Main entry)
│   └── Navigation.tsx            (Tab navigation)
├── static-content/
│   ├── kanji/
│   │   └── n5-kanji.json         (100 kanji)
│   ├── vocab/
│   │   └── n5-vocab.json         (400 words)
│   ├── grammar/
│   │   └── n5-grammar.json       (20 patterns)
│   ├── hiragana/
│   │   └── n5-hiragana.json      (46 chars)
│   ├── katakana/
│   │   └── n5-katakana.json      (46 chars)
│   ├── lessons/
│   │   └── n5-lessons.json       (100-day plan)
│   └── audio/
│       └── *.mp3                 (pronunciations)
├── App.tsx
├── package.json
├── tsconfig.json
├── app.json
└── rules/
    └── knowledge/                (Your documentation)
        ├── BUILD_ORDER.md
        ├── JLPT_App_PRD.md
        ├── JLPT_Backend_BetterAuth.md
        ├── CLARIFICATIONS.md
        └── CLAUDE.md             (This file)
```

---

## KEY ARCHITECTURAL DECISIONS

### 1. Backend is the Source of Truth
- **Neon PostgreSQL** = all user data (profiles, progress, friends, etc.)
- **Expo app** = UI layer only
- **TanStack Query** = client-side cache
- **SQLite** = optional offline fallback (Phase 2)

### 2. Data Flow
```
User taps button
    ↓
Expo app calls API
    ↓
Backend (Hono) validates session
    ↓
Backend queries Neon PostgreSQL
    ↓
Backend returns JSON
    ↓
Expo app displays UI
    ↓
TanStack Query caches response
```

### 3. API Communication
- **Base URL**: `https://your-backend.vercel.app` (will be provided)
- **Method**: REST/JSON
- **Auth**: Better Auth session (HttpOnly cookies)
- **Headers**: Include credentials

### 4. No SQLite for MVP
- Keep it simple
- Assume users have internet
- Use TanStack Query for caching
- Add SQLite in Phase 2 if needed

---

## CODING STANDARDS

### TypeScript
- ✅ Always use TypeScript (`.ts` or `.tsx`)
- ✅ Define types for all API responses
- ✅ Use interfaces for props, not `any`
- ❌ Never use `any` type

### React Native / Expo
- ✅ Use functional components + hooks
- ✅ Use `useCallback` for memoization
- ✅ Use TanStack Query for data fetching
- ✅ Use Zustand for global state
- ❌ Don't use class components
- ❌ Don't use Redux (use Zustand instead)
- ❌ Don't use AsyncStorage (use TanStack Query + backend)

### File Naming
- Components: `PascalCase.tsx` (e.g., `DashboardScreen.tsx`)
- Services: `camelCase.ts` (e.g., `lessonService.ts`)
- Hooks: `camelCase.ts` + prefix `use` (e.g., `useProgress.ts`)
- Screens: `PascalCase.tsx` + suffix `Screen` (e.g., `LessonScreen.tsx`)

### Code Style
- Indent: 2 spaces
- Line length: ~80–100 characters
- Use `const`, avoid `let` and `var`
- Use arrow functions
- Comments: Only for "why", not "what"

---

## API ENDPOINTS (BACKEND - Already Built)

### Authentication (Better Auth)
```
POST /auth/sign-up
  Body: { email, password, name }
  Response: { token, userId }

POST /auth/sign-in
  Body: { email, password }
  Response: { token, userId }

GET /auth/session
  Response: { user, session }
```

### Custom Auth
```
GET /api/auth/profile
  Response: { userId, email, name, jlptLevel, currentDay, ... }

PATCH /api/auth/profile
  Body: { jlptLevel }
  Response: { success, jlptLevel }
```

### Lessons (TO BE IMPLEMENTED)
```
GET /api/lessons/today
  Response: { day, title, items: [{}, ...] }

GET /api/lessons/:day
  Response: { day, title, items: [{}, ...] }
```

### Progress
```
GET /api/progress/stats
  Response: { currentDay, totalKanjiLearned, streak, ... }

POST /api/progress/complete-lesson
  Body: { day, timeSpentMinutes, itemsMasteredCount }
  Response: { nextDay, currentStreak, totalKanjiLearned }

GET /api/progress/review-items
  Response: { totalDue, items: [{}, ...] }

POST /api/progress/review-item
  Body: { contentId, isCorrect }
  Response: { nextReviewDate, interval }
```

### Friends
```
GET /api/friends/code
  Response: { code }

POST /api/friends/add
  Body: { code }
  Response: { friendId, success }

GET /api/friends/list
  Response: { friends: [userId, ...] }

GET /api/friends/activity
  Response: { friends: [{ userId, streak, lastStudiedAt }, ...] }

GET /api/friends/leaderboard
  Response: { leaderboard: [{ userId, streak, totalKanjiLearned }, ...] }

DELETE /api/friends/:friendId
  Response: { success }
```

---

## STYLING GUIDELINES

### Colors
- **Primary**: Green (from design system)
- **Text**: Dark gray/black
- **Backgrounds**: White/light gray
- **Accents**: Streak 🔥 (orange/red), Success ✅ (green)

### Layout
- **Safe area**: Always use `SafeAreaView`
- **Spacing**: 8px, 16px, 24px grid
- **Button size**: 44px minimum height (tap target)
- **Font size**: 14px (body), 16px (titles), 12px (captions)

### Responsive Design
- Design for: iPhone SE (375px) to iPhone 15 Pro (430px)
- Use `Dimensions` API for screen-dependent sizing
- Never hardcode pixel widths (use flex)

---

## SCREEN REQUIREMENTS (From PRD)

### 1. Auth Screen
- Email input
- Password input
- Username input (signup only)
- Sign up / Sign in buttons
- Link to toggle between screens
- Error messages

### 2. Dashboard Screen
- Profile badge (name, level)
- Streak counter (🔥 X days)
- Daily progress bar (X/10 items)
- "Start Today's Lesson" button (big, prominent)
- Quick stats (kanji count, vocab count)
- Friends activity feed
- Bottom navigation (5 tabs)

### 3. Lesson Screen
- Phase 1: Learn (stroke animations, audio)
- Phase 2: Recognize (multiple choice)
- Phase 3: Write (optional, stroke tracing)
- Phase 4: Summary (items mastered, time, streak)
- "Complete Lesson" button
- Progress indicator

### 4. Review Screen
- Cards due count
- Flip card interface (front = kanji, back = meaning)
- Audio playback button
- "Got it" / "Wrong" buttons
- Progress bar
- Repeat until done

### 5. Profile Screen
- Stats tab: total hours, kanji, vocab, streak, weak areas
- Settings tab: reminder time, timezone, language, logout
- Separate screens or tabs

### 6. Friends Screen
- Add friend (modal with code input)
- Friends list
- Leaderboard (sorted by streak)
- Activity feed (real-time polling)

---

## WORKFLOW FOR CODE REVIEW

**Before writing any code:**

1. **Read the PRD** section for the feature
2. **Check BUILD_ORDER.md** to see if it's next
3. **Review existing types** in `src/types/`
4. **Ask Claude** for code help following this template:

```
I'm building [SCREEN/FEATURE] for the JLPT app.

Requirements:
- [List what it should do]

API endpoint:
GET /api/[endpoint]
Response: { ... }

Can you generate the code for [component/service]?
Please analyze before I copy-paste.
```

**When reviewing Claude's code:**
- ✅ Check: Uses TanStack Query
- ✅ Check: Uses TypeScript types
- ✅ Check: No `any` types
- ✅ Check: Functional components with hooks
- ✅ Check: Error handling
- ❌ Reject: Class components, Redux, AsyncStorage
- ❌ Reject: Hardcoded backend URLs
- ❌ Reject: Missing types

**If code needs changes:**
- Tell Claude specifically what's wrong
- Ask it to fix before you copy-paste
- Don't manually edit the code (let Claude revise)

---

## ENVIRONMENT VARIABLES

### `.env.local` (Expo app)
```
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
EXPO_PUBLIC_DEEPSEEK_API_KEY=sk_... (Phase 2)
```

### Note
- Start with JUST the backend URL
- Don't hardcode URLs in code
- Use env vars instead

---

## IMPORTANT NOTES

### ✅ DO
- Use TanStack Query for all API calls
- Use Zustand for global state
- Use TypeScript strictly
- Write reusable components
- Cache API responses automatically
- Handle loading/error states
- Test on real phone before deploying

### ❌ DON'T
- Rebuild auth (use Better Auth)
- Rebuild API structure (it's fixed)
- Use SQLite (for MVP)
- Use class components
- Use Redux
- Hardcode backend URLs
- Make API calls in components (use custom hooks)
- Use `any` types

---

## PHASE BREAKDOWN

### Phase 1: MVP (Weeks 1–6)
✅ Static content (1.1–1.6)
✅ Lesson API (2.1)
🔨 Expo screens (3.1–3.8)
🔨 Testing (4.1–4.5)
🔨 Deploy (4.4)

### Phase 2: Post-MVP (Weeks 7+)
⏳ N4 content (5.1)
⏳ DeepSeek (5.2)

---

## FILE LOCATIONS

**Your project structure**:
```
~/projects/jlpt-app/
├── jlpt-app-backend/        (ALREADY BUILT - don't touch)
│   └── src/
│       ├── routes/
│       ├── db/
│       └── ...
├── jlpt-app-frontend/       (YOU'RE BUILDING THIS)
│   ├── src/
│   ├── static-content/
│   └── rules/
│       └── knowledge/        (Documentation)
│           ├── BUILD_ORDER.md
│           ├── JLPT_App_PRD.md
│           ├── CLAUDE.md
│           └── ...
└── README.md
```

---

## QUICK START FOR CODING

1. **Setup**:
   ```bash
   npx create-expo-app jlpt-app
   cd jlpt-app
   npm install @react-navigation/native @tanstack/react-query zustand
   ```

2. **Create folder structure**:
   ```bash
   mkdir -p src/{screens,components,services,hooks,store,types}
   mkdir -p static-content/{kanji,vocab,grammar,audio,lessons}
   mkdir -p rules/knowledge
   ```

3. **Copy documentation**:
   - Copy all .md files to `rules/knowledge/`
   - Reference them when building

4. **Code first feature**:
   - Start with #1 from BUILD_ORDER.md (Auth screens)
   - Use Claude for code generation
   - Review code before copy-paste

---

## BACKEND API REFERENCE

**Base URL**: `https://your-backend.vercel.app` (TBD)

**Example API call**:
```typescript
// authService.ts
import { useQuery, useMutation } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'  // For cookies
      });
      return response.json();
    }
  });
};
```

---

## HELPFUL RESOURCES

**Documentation** (in your `rules/knowledge/`):
- `JLPT_App_PRD.md` — Full product spec
- `BUILD_ORDER.md` — What to build and when
- `JLPT_Backend_BetterAuth.md` — Backend details
- `CLARIFICATIONS.md` — Personas & architecture

**External Docs**:
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- TanStack Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand
- TypeScript: https://www.typescriptlang.org

---

## COMMUNICATION PROTOCOL WITH AI

**When asking Claude for code:**

1. **Give context**:
   ```
   I'm building [FEATURE] for JLPT app.
   Stack: React Native + Expo + TanStack Query + Zustand
   [Link to relevant PRD section]
   ```

2. **Ask for analysis**:
   ```
   Can you generate code for [component/service]?
   Please provide code that I can review before copy-paste.
   ```

3. **Review step**:
   ```
   [Claude provides code]
   I'll analyze this and tell you if I need changes.
   ```

4. **Approval or revision**:
   ```
   ✅ Code looks good, copying now
   OR
   ❌ Please change [specific issue]
   ```

---

## FINAL CHECKLIST BEFORE CODING

- [ ] Backend is deployed ✅
- [ ] Neon database is set up ✅
- [ ] Documentation is in `rules/knowledge/`
- [ ] `.env.local` has `EXPO_PUBLIC_API_URL`
- [ ] Expo project is initialized
- [ ] You've read BUILD_ORDER.md
- [ ] You understand the 6 screens you need to build
- [ ] You have Claude ready to help with code generation

---

**Status**: Ready to code! Start with BUILD_ORDER.md step 3.1 (Expo Setup) or step 1 (Static Content).

Last updated: June 15, 2026
