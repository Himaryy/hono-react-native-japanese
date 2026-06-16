# JLPT App - Clarifications: Personas, PRD, and Database Strategy

**Date**: June 15, 2026  
**Purpose**: Clear up confusion about user personas, PRD, and database choices

---

## 1. PERSONAS EXPLANATION

### What are Personas?

**Personas are fictional user profiles** that represent your real users. They help you:
- Design features around actual user needs
- Make decisions about UI/UX
- Prioritize features
- Understand different user types in your group

### The 3 JLPT App Personas (Your Friends)

In your case, the personas represent the **3 different types of friends** you'll be studying with:

#### **Persona 1: Mina (The Committed Learner)**

**Who is she?**
- Serious about passing JLPT N3 in 6 months
- Wants to be top of leaderboard
- Studies every evening (30 min consistent)
- Gets frustrated with chaotic apps
- Loves seeing her progress

**Her Needs** (= features you'll build):
- Clear progress path (Day 1 → Day 100)
- Error explanations (when she gets it wrong)
- Leaderboard to compete with friends
- Streak counter (motivation)
- Daily reminders

**Real-life example from your group:**
- This is probably **you** (since you're building the app)
- Or one of your friends who's most dedicated

#### **Persona 2: Rio (The Casual Enthusiast)**

**Who is he?**
- "I want to get decent at Japanese, maybe test N4 next year"
- Studies 10–15 min when bored
- Doesn't like complicated apps
- Stops if things feel overwhelming
- Prefers bite-sized lessons

**His Needs** (= features you'll build):
- Simple, quick lessons (not long)
- Not pressured by leaderboards
- Easy to skip/pause without guilt
- Low friction onboarding
- Suggestions on what to study

**Real-life example:**
- Friend who's interested but not obsessed
- Probably studies 2–3 times/week

#### **Persona 3: Kenji (The Perfectionist)**

**Who is he?**
- Wants to master N3 grammar nuances
- Studies 45–60 min per session
- Wants detailed explanations
- Researches etymology/history
- Wants related patterns explained

**His Needs** (= features you'll build):
- Advanced content (not dumbed-down)
- Detailed explanations (why, not just what)
- Etymology/etymology notes
- Related patterns/variations
- Deep dives into tricky topics

**Real-life example:**
- Friend who loves language learning deeply
- Probably studies 5–6 times/week, longer sessions

---

### How to Use Personas When Building

**When deciding on a feature:**

❌ **DON'T**: "Should we add feature X?"

✅ **DO**: "How would Mina, Rio, and Kenji use feature X?"

**Example: Should we add "easy mode" (simplified content)?**

- **Mina**: Wouldn't use it (wants full content)
- **Rio**: Would love it (less overwhelming)
- **Kenji**: Might skip it (wants advanced stuff)

**Decision**: Add it! Rio gets simpler lessons, Mina can skip it, Kenji has his advanced path.

---

## 2. THE PRD STILL MENTIONS SQLITE - DO WE NEED TO UPDATE?

### Short Answer: **YES, but carefully. Read below.**

### Why the PRD Mentions SQLite

The PRD was written as a **general template** for any JLPT app. It mentions:
- "SQLite (offline-first)"
- "Bundles with Expo app"

This was **for reference**, not prescriptive.

### Your Actual Database Strategy (Better)

You're doing this **correctly**:

```
┌─────────────────────────────────────────┐
│           YOUR SETUP (RIGHT)            │
├─────────────────────────────────────────┤
│                                         │
│  Hono Backend (Vercel Edge)            │
│         ↓ (HTTP/REST API)              │
│  PostgreSQL (Neon)                     │
│  ─ userProfiles                        │
│  ─ userProgress                        │
│  ─ reviewItems (SRS)                   │
│  ─ quizResults                         │
│  ─ friendships                         │
│  ─ friendCodes                         │
│                                         │
│         ↑ (JSON responses)             │
│  Expo App (React Native)               │
│  ─ Fetch progress from API             │
│  ─ Display UI                          │
│  ─ Cache locally (in memory)           │
│                                         │
└─────────────────────────────────────────┘
```

### Where SQLite Comes In (Optional)

**SQLite is NOT for your main data** (that's Neon PostgreSQL).

**SQLite is for optional LOCAL CACHING in Expo app**:

```typescript
// Example: Cache user progress locally
// So app works if internet drops for 30 seconds

const getCachedProgress = async () => {
  // Try to get from backend first
  const progress = await fetch('/api/progress/stats');
  
  // Save to local SQLite
  await db.insert('progress_cache').values(progress);
  
  // If offline later, show cached data
  // When back online, sync with backend
};
```

**This is OPTIONAL.** You don't need SQLite if:
- Your app always has internet (likely for 3–5 users)
- You're okay with "loading..." screen if offline
- Network dropouts are rare

**You DO need SQLite if:**
- Users study on flights (no internet)
- You want offline-first experience
- You want to sync when connection returns

---

## 3. SHOULD WE UPDATE THE PRD?

### Yes, but here's the plan:

### Part A: What to Update (Minor)

Update **Section 4: Data Model & Storage** in the PRD:

**Current (in PRD)**:
```
SQLite (local storage: static content + user progress)
```

**Update to**:
```
Backend Database (Neon PostgreSQL) for all user data
├─ User profiles, progress, streaks
├─ Friends, leaderboards
├─ SRS review items
├─ Quiz results
└─ Cached DeepSeek content

Optional: Local Cache (SQLite in Expo app)
├─ Cache progress locally (UX: instant load)
├─ Sync with backend on API call
├─ Fallback if internet drops
└─ Not required for MVP
```

**Current (in PRD)**:
```
Backend: Optional, sync later
```

**Update to**:
```
Backend: Hono + Better Auth + Drizzle ORM (Neon PostgreSQL)
├─ Authentication
├─ Progress tracking
├─ Friends system
├─ SRS management
└─ All in Vercel Edge
```

### Part B: What NOT to Change

The rest of the PRD is still **100% accurate**:
- ✅ User personas (still valid)
- ✅ Features (still valid)
- ✅ Workflows (still valid)
- ✅ Rollout plan (still valid)
- ✅ Success metrics (still valid)

The PRD is about **WHAT** you're building (product).  
The architecture docs are about **HOW** you're building (tech).

---

## 4. UPDATED DATABASE ARCHITECTURE

### Production Architecture (What You Have)

```
┌──────────────────────────────────────────────────┐
│                PRODUCTION (LIVE)                │
├──────────────────────────────────────────────────┤
│                                                  │
│  Expo App (User's Phone)                        │
│  ┌──────────────────────────────────────────┐  │
│  │ React Native UI                          │  │
│  │ TanStack Query (API calls + caching)    │  │
│  │ Zustand (global state)                  │  │
│  │ SQLite (optional: local cache)          │  │
│  └──────────────────────────────────────────┘  │
│              ↓ HTTP/REST ↑                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Hono (Vercel Edge Functions)             │  │
│  │ ├─ Authentication (Better Auth)          │  │
│  │ ├─ Routes (progress, friends, lessons)  │  │
│  │ ├─ Middleware (auth validation)         │  │
│  │ └─ Error handling                       │  │
│  └──────────────────────────────────────────┘  │
│              ↓ SQL ↑                            │
│  ┌──────────────────────────────────────────┐  │
│  │ Neon PostgreSQL (Serverless)             │  │
│  │ ├─ userProfiles (JLPT data)             │  │
│  │ ├─ userProgress (lesson completion)     │  │
│  │ ├─ reviewItems (SRS scheduling)         │  │
│  │ ├─ quizResults (performance)            │  │
│  │ ├─ friendships (connections)            │  │
│  │ ├─ friendCodes (6-char discovery)       │  │
│  │ ├─ cachedContent (DeepSeek responses)   │  │
│  │ └─ Better Auth tables (auto-managed)    │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Local Cache Architecture (Optional)

```
Expo App (offline scenario)
│
├─ Main state: TanStack Query in memory
│  ├─ User session (from backend)
│  ├─ Today's lesson (from backend)
│  └─ Friends activity (polling every 30s)
│
├─ Optional: SQLite local cache
│  ├─ Save responses from backend
│  ├─ Display cached data if offline
│  └─ Re-sync when online
│
└─ No local SQLite: Just show "loading..."
   (No backend connection = app paused)
```

---

## 5. DATA FLOW EXAMPLES

### Example 1: User Completes a Lesson

```
User taps "Complete Lesson" in Expo app
         ↓
Expo app: POST /api/progress/complete-lesson
         ↓
Backend (Hono): Validate session, update database
         ↓
Neon PostgreSQL:
  - INSERT into userProgress
  - UPDATE userProfiles (currentDay, streak)
         ↓
Response: { nextDay: 2, streak: 1 }
         ↓
Expo app: Update UI, save to cache (optional)
         ↓
User sees: "Day 2 unlocked! 🔥 Streak: 1"
```

### Example 2: User Checks Friends Leaderboard

```
User opens Friends tab
         ↓
Expo app: GET /api/friends/leaderboard
         ↓
Backend (Hono): Validate session, query database
         ↓
Neon PostgreSQL: SELECT from friendships + userProfiles
         ↓
Response: [
  { userId: "mina", streak: 42 },
  { userId: "rio", streak: 3 },
  { userId: "kenji", streak: 28 }
]
         ↓
Expo app: Display sorted list, cache in TanStack Query
         ↓
User sees: Leaderboard with friends
```

### Example 3: Polling Every 30 Seconds (Friends Activity)

```
Expo app mounted on Friends screen
         ↓
Start interval: every 30 seconds
         ↓
fetch('/api/friends/activity')
         ↓
Backend: Quick query (indexed, fast)
         ↓
Response: Friends' lastStudiedAt, currentStreak
         ↓
Expo app: Update UI if changed
         ↓
"Mina studied 2 min ago! 🔥"
```

---

## 6. DO WE NEED SQLITE?

### Scenario Analysis

**NEED SQLite if**:
- Users study offline (flights, trains, subways)
- You want instant UI load (no "loading..." screen)
- Sync-on-reconnect is important
- Users expect app to work fully offline

**DON'T NEED SQLite if**:
- Your 3–5 friends always have internet
- "Loading..." screen is acceptable
- App is primarily online-first
- You want to keep it simple

### Recommendation for Your MVP

**✅ START WITHOUT SQLite** (keeps it simple)

```typescript
// Expo app
const [progress, setProgress] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const loadProgress = async () => {
    setLoading(true);
    const data = await fetch('/api/progress/stats');
    setProgress(data);
    setLoading(false);
  };
  
  loadProgress();
}, []);

// That's it! No SQLite needed yet.
```

**➕ ADD SQLite Later if Needed**

Once you launch and users ask "what if I'm offline?", then add it:

```typescript
// Future: Add SQLite caching
const cachedProgress = await db.query(
  'SELECT * FROM progressCache WHERE userId = ?',
  [userId]
);

if (cachedProgress) {
  setProgress(cachedProgress); // Show cached
  syncWithBackend(); // Sync in background
}
```

---

## 7. UPDATED SUMMARY

### Your Actual Tech Stack (Correct)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Mobile App** | React Native + Expo | Cross-platform, hot reload |
| **App State** | TanStack Query + Zustand | Caching, API calls, global state |
| **Optional Cache** | SQLite (optional) | Offline-first (Phase 2) |
| **Backend** | Hono | Lightweight, Edge Functions native |
| **Authentication** | Better Auth | Free, open-source, secure |
| **ORM** | Drizzle | Type-safe, no migration pain |
| **Main Database** | Neon PostgreSQL | Serverless, connection pool |
| **Deployment** | Vercel Edge | Fast, auto-scales |

### Database Responsibilities

**Neon PostgreSQL (Main)**:
- All user data (profiles, progress, friends, etc.)
- Persistent storage
- Shared across all devices

**SQLite in Expo (Optional)**:
- Local cache of recent API responses
- Offline fallback
- Sync when online
- **Not for user data** — just for UX

---

## 8. SHOULD WE UPDATE THE PRD?

### Minimal Update Needed

**Section to update: "5. Technical Architecture"**

Change from:
```
Frontend: React Native (Expo)
Backend: Optional, sync later
Database: SQLite (offline-first)
```

To:
```
Frontend: React Native (Expo)
├─ TanStack Query (API + caching)
├─ Zustand (global state)
└─ SQLite (optional, Phase 2 for offline)

Backend: Hono + Better Auth (Vercel Edge)
├─ Authentication
├─ Progress tracking
├─ Friends system
└─ SRS management

Database: Neon PostgreSQL
├─ User data (main store)
├─ Drizzle ORM (type-safe)
└─ 8 tables (profiles, progress, reviews, etc.)

Deployment:
├─ Backend: Vercel Edge Functions
├─ Database: Neon (serverless PostgreSQL)
└─ App: TestFlight / Google Play Internal
```

**Everything else in the PRD is still 100% valid.**

---

## 9. ACTION ITEMS

### For Now (Before Building)

- [ ] Read personas in PRD
- [ ] Identify which persona = which friend
- [ ] Understand backend is the source of truth
- [ ] Understand SQLite is optional, Phase 2

### When Building Expo App

- [ ] Use TanStack Query for API calls
- [ ] Cache responses automatically
- [ ] Don't worry about SQLite yet
- [ ] If users complain about offline: add it later

### When Deploying

- [ ] Backend: Vercel (npm run build + vercel --prod)
- [ ] Database: Neon (already set up)
- [ ] App: TestFlight / Google Play Internal

---

## 10. QUICK REFERENCE

### Data Flow (Single Source of Truth)

```
Neon PostgreSQL (truth)
    ↑
    ↓
Hono Backend (API layer)
    ↑
    ↓
Expo App (UI)
    ↑
    ↓
TanStack Query (local cache)
```

**Direction of truth**: Always Neon PostgreSQL

### Personas Quick Reference

| Persona | Study Time | Focus | Needs |
|---------|------------|-------|-------|
| **Mina** | 30 min/day | Consistent progress | Leaderboard, streaks |
| **Rio** | 10–15 min/day | Casual learning | Simple, bite-sized |
| **Kenji** | 45–60 min/day | Deep understanding | Detailed explanations |

### Database Quick Reference

| Database | Role | Owns |
|----------|------|------|
| **Neon PostgreSQL** | Source of truth | All user data |
| **TanStack Query** | Client-side cache | API responses |
| **SQLite (optional)** | Offline fallback | Recent data snapshot |

---

## FINAL ANSWER

**Do we need to update the PRD?**

✅ **Yes, but only Section 5** (Technical Architecture)

The personas and features are **still 100% accurate**. The PRD is about what you're building. The architecture docs are about how.

**Personas are NOT confusing once you realize:**
- Mina = your dedicated friend
- Rio = your casual friend
- Kenji = your deep-learning friend

**SQLite is NOT needed for MVP:**
- Start without it (simpler)
- Add in Phase 2 if users need offline mode
- Your 3–5 friends probably have internet anyway

**Your architecture is CORRECT:**
- Hono backend + Neon database = source of truth
- Expo app = UI layer (fetches from backend)
- Optional SQLite = UX improvement, not critical

---

Does this clear things up? Want me to create a simplified version of the PRD with these updates? Or shall we move to building the Expo app?
