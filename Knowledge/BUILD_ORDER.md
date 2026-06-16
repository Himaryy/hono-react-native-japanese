# JLPT App - Numbered Build Order (1, 2, 3...)

**Based on**: JLPT_App_PRD.md + Backend Architecture  
**Goal**: Clear priority of what to build first  
**Timeline**: 6 weeks to MVP

---

## PHASE 0: SETUP (Week 1 - Days 1–2)

### 0.1: Create Neon Database ✅ (Already in your docs)
**Files needed**: None (from PRD)
**Effort**: 15 minutes
**Output**: DATABASE_URL connection string

**Steps**:
1. Create Neon account (neon.tech)
2. Create database: `jlpt_db`
3. Copy connection string
4. Add to `.env.local`: `DATABASE_URL=postgresql://...`

**From PRD Reference**: Section 4 - Database Setup

---

### 0.2: Deploy Backend to Vercel ✅ (Already in your docs)
**Files needed**: jlpt-app-backend/ folder
**Effort**: 30 minutes
**Output**: Backend API running on Vercel (e.g., https://jlpt-app.vercel.app)

**Steps**:
1. `npm install`
2. `npm run db:generate`
3. `npm run db:migrate`
4. Push to GitHub
5. Deploy: `vercel --prod`
6. Add env vars to Vercel dashboard

**From PRD Reference**: Section 6 - Deployment

---

## PHASE 1: STATIC CONTENT (Week 1–3)

These are the building blocks. Everything else depends on this.

---

### 1.1: Create Kanji JSON Files (N5) 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/kanji/n5-kanji.json`

**Effort**: 40 hours
**Output**: JSON file with 100 kanji (N5 level)

**Structure**:
```json
[
  {
    "id": "kanji_001",
    "kanji": "日",
    "jlptLevel": "N5",
    "strokeCount": 4,
    "readings": {
      "on": ["にち", "じつ"],
      "kun": ["ひ"]
    },
    "meanings": ["day", "sun"],
    "strokeOrder": ["M10,10 L10,100...", ...4 total],
    "examples": [
      {
        "sentence": "今日は月曜日です。",
        "reading": "きょうはげつようびです。",
        "english": "Today is Monday.",
        "audioUrl": "audio/example_001.mp3"
      }
    ]
  },
  ...99 more kanji
]
```

**Data sources**:
- Kanji strokes: KanjiVG (kanjivg.com)
- Meanings: Jisho.org API
- Examples: Tatoeba.org

**From PRD Reference**: Section 4.1 - N5 Curriculum (Days 61–80)

---

### 1.2: Create Vocabulary JSON Files (N5) 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/vocab/n5-vocab.json`

**Effort**: 30 hours
**Output**: JSON file with 400 vocabulary words

**Structure**:
```json
[
  {
    "id": "vocab_001",
    "word": "猫",
    "reading": "ねこ",
    "jlptLevel": "N5",
    "partOfSpeech": "noun",
    "meanings": ["cat"],
    "audioUrl": "audio/vocab_cat.mp3",
    "examples": [
      {
        "sentence": "私の猫は黒いです。",
        "reading": "わたしのねこはくろいです。",
        "english": "My cat is black."
      }
    ],
    "pitchAccent": {
      "type": "atamadaka",
      "diagram": "●-●-●",
      "explanation": "First mora is high, then drops"
    }
  },
  ...399 more words
]
```

**Data sources**:
- Vocab: Jisho.org API + Tatoeba
- Audio: Forvo.com (crowdsourced)
- Pitch accent: Study guides

**From PRD Reference**: Section 4.1 - N5 Curriculum (Days 21–60)

---

### 1.3: Create Grammar JSON Files (N5) 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/grammar/n5-grammar.json`

**Effort**: 20 hours
**Output**: JSON file with 20 grammar patterns

**Structure**:
```json
[
  {
    "id": "grammar_001",
    "pattern": "です",
    "jlptLevel": "N5",
    "meaning": "Polite form (to be)",
    "explanation": "Used to make sentences polite and formal.",
    "examples": [
      {
        "sentence": "私は学生です。",
        "reading": "わたしはがくせいです。",
        "english": "I am a student."
      }
    ],
    "relatedPatterns": ["ます", "だ"],
    "notes": "Most common ending in formal speech"
  },
  ...19 more patterns
]
```

**Data sources**:
- Grammar: Tae Kim's guide (guidetojapanese.org)
- Examples: Study guides

**From PRD Reference**: Section 4.1 - N5 Curriculum (Days 81–100)

---

### 1.4: Create Hiragana/Katakana JSON Files 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/hiragana/n5-hiragana.json`
- `static-content/katakana/n5-katakana.json`

**Effort**: 10 hours
**Output**: JSON files with character mappings

**Structure**:
```json
[
  {
    "id": "hiragana_001",
    "character": "あ",
    "romaji": "a",
    "strokeOrder": ["M10,10 L20,20...", ...strokes],
    "audioUrl": "audio/hiragana_a.mp3"
  },
  ...45 more hiragana, then 46 katakana
]
```

**From PRD Reference**: Section 4.1 - N5 Curriculum (Days 1–20)

---

### 1.5: Download/Record Audio Files 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/audio/` (all MP3 files)
  - Hiragana pronunciations
  - Katakana pronunciations
  - Kanji example sentences
  - Vocabulary words
  - Grammar examples

**Effort**: 20 hours
**Output**: ~500 MP3 files (organized by type)

**Sources**:
- Forvo.com (download native speaker audio)
- Record yourself (with native speaker review)
- YouTube (extract audio from JLPT tutors)

**From PRD Reference**: Section 4 - Content Structure

---

### 1.6: Create Lesson Curriculum JSON 🔴 HIGH PRIORITY
**Files needed**:
- `static-content/lessons/n5-lessons.json`

**Effort**: 5 hours
**Output**: 100-day lesson plan

**Structure**:
```json
[
  {
    "day": 1,
    "level": "N5",
    "title": "Hiragana (あ行)",
    "contentType": "hiragana",
    "items": ["hiragana_001", "hiragana_002", ...],
    "estimatedMinutes": 10,
    "phases": ["learn", "recognize", "write"]
  },
  {
    "day": 2,
    "level": "N5",
    "title": "Hiragana (か行)",
    "contentType": "hiragana",
    "items": ["hiragana_006", "hiragana_007", ...],
    "estimatedMinutes": 10,
    "phases": ["learn", "recognize", "write"]
  },
  ...100 days total
]
```

**From PRD Reference**: Section 4.1 - N5 Curriculum (Days 1–100)

---

## PHASE 2: BACKEND API (Week 1–2 in parallel)

### 2.1: Implement Lesson Delivery API 🔴 HIGH PRIORITY
**Files to edit**:
- `src/routes/lessons.ts` (currently has TODO)

**Effort**: 8 hours
**Output**: 3 working endpoints

**Endpoints to implement**:
```
GET /api/lessons/today
  → Returns: today's lesson based on user's currentDay
  → Loads from static JSON (n5-lessons.json)

GET /api/lessons/:day
  → Returns: specific day's lesson

GET /api/lessons/content/:contentId
  → Returns: full details of a kanji/vocab/grammar
```

**Code structure**:
```typescript
// src/routes/lessons.ts
import { static_lessons } from '../data/n5-lessons.json';
import { static_kanji } from '../data/kanji/n5-kanji.json';

lessonsRouter.get('/today', async (c) => {
  const userId = c.get('userId');
  const profile = await db.select().from(userProfiles)
    .where(eq(userProfiles.userId, userId));
  
  const day = profile[0].currentDay;
  const lesson = static_lessons.find(l => l.day === day);
  
  return c.json(lesson);
});
```

**From PRD Reference**: Section 3.3 - Daily Lesson Screen

---

### 2.2: Test All Backend Endpoints ✅ ALREADY DONE
**Files**: Already complete in jlpt-app-backend/
**Effort**: Already in your code

**Endpoints to verify**:
- ✅ `/auth/sign-up`
- ✅ `/auth/sign-in`
- ✅ `/api/auth/profile`
- ✅ `/api/progress/stats`
- ✅ `/api/progress/complete-lesson`
- ✅ `/api/friends/code`
- ✅ `/api/friends/add`
- ✅ `/api/friends/activity`
- ✅ `/api/friends/leaderboard`
- ⚠️ `/api/lessons/today` (needs implementation from 2.1)

---

## PHASE 3: EXPO APP - UI LAYER (Week 2–5)

### 3.1: Set Up Expo Project 🟡 MEDIUM PRIORITY
**Files to create**:
- `App.tsx` (main entry)
- `package.json` (dependencies)

**Effort**: 1 hour
**Output**: Blank Expo app with navigation

**Steps**:
```bash
npx create-expo-app jlpt-app
cd jlpt-app
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @tanstack/react-query zustand
```

**From PRD Reference**: Section 3 - Features

---

### 3.2: Build Authentication Screens 🔴 HIGH PRIORITY
**Files to create**:
- `screens/AuthScreen.tsx`
- `screens/SignUpScreen.tsx`
- `screens/LoginScreen.tsx`
- `services/authService.ts`

**Effort**: 15 hours
**Output**: Functional auth flow

**Screens**:
1. **Splash/Auth Screen** (initial)
   - "Sign up" button
   - "Sign in" button

2. **Sign Up Screen**
   - Email input
   - Password input
   - Username input
   - Sign up button
   - Link to sign in

3. **Sign In Screen**
   - Email input
   - Password input
   - Sign in button
   - Link to sign up

**Connected to backend**:
```typescript
// authService.ts
export const signUp = async (email, password, username) => {
  const response = await fetch(
    'https://your-backend.vercel.app/auth/sign-up',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, name: username })
    }
  );
  return response.json();
};

export const signIn = async (email, password) => {
  const response = await fetch(
    'https://your-backend.vercel.app/auth/sign-in',
    {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }
  );
  return response.json();
};
```

**From PRD Reference**: Section 3.1 - Authentication & Onboarding

---

### 3.3: Build Dashboard Screen 🔴 HIGH PRIORITY
**Files to create**:
- `screens/DashboardScreen.tsx`
- `components/StreakCounter.tsx`
- `components/ProgressBar.tsx`
- `components/QuickStats.tsx`

**Effort**: 10 hours
**Output**: Home screen with user stats

**Layout**:
```
┌────────────────────┐
│ Profile badge      │ (name, level)
├────────────────────┤
│ Streak: 🔥 7 days  │
├────────────────────┤
│ Progress bar       │ 4/10 items today
├────────────────────┤
│ [Start Today]      │ (big button)
├────────────────────┤
│ Quick Stats        │
│ • 42 kanji learned │
│ • 128 vocab words  │
├────────────────────┤
│ Friends Activity   │
│ Mina: 25 min today │
└────────────────────┘
```

**Connected to backend**:
```typescript
const { data: stats } = useQuery({
  queryKey: ['progress'],
  queryFn: () => fetch('/api/progress/stats').then(r => r.json())
});
```

**From PRD Reference**: Section 3.2 - Dashboard (Home Screen)

---

### 3.4: Build Lesson Screen 🔴 HIGH PRIORITY
**Files to create**:
- `screens/LessonScreen.tsx`
- `components/LessonCard.tsx`
- `components/QuizQuestion.tsx`
- `components/LessonSummary.tsx`

**Effort**: 25 hours
**Output**: Daily lesson delivery

**Flow** (4 phases):
1. **Learn** (2 min)
   - Show 5 characters/words
   - Stroke animation
   - Audio playback
   - Swipe to next

2. **Recognize** (3 min)
   - Multiple choice quiz
   - 4 options
   - Immediate feedback
   - Show answer if wrong

3. **Write** (optional, 3 min)
   - Canvas for stroke practice
   - Auto-check stroke order
   - Can skip

4. **Summary** (1 min)
   - Items mastered
   - Time spent
   - Streak update
   - Next day unlock

**Connected to backend**:
```typescript
// Load lesson
const { data: lesson } = useQuery({
  queryKey: ['lesson', 'today'],
  queryFn: () => fetch('/api/lessons/today').then(r => r.json())
});

// Complete lesson
const completeMutation = useMutation({
  mutationFn: () => fetch('/api/progress/complete-lesson', {
    method: 'POST',
    body: JSON.stringify({
      day: lesson.day,
      timeSpentMinutes: 8,
      itemsMasteredCount: 5
    })
  })
});
```

**From PRD Reference**: Section 3.3 - Daily Lesson Screen

---

### 3.5: Build Review Screen 🔴 HIGH PRIORITY
**Files to create**:
- `screens/ReviewScreen.tsx`
- `components/FlashCard.tsx`
- `components/ReviewStack.tsx`

**Effort**: 12 hours
**Output**: SRS flashcard review

**Layout**:
```
┌──────────────────────┐
│ Kanji Review         │
│ 7 items due today    │
├──────────────────────┤
│   ┌──────────────┐   │
│   │   日         │   │ (kanji)
│   └──────────────┘   │
│   [Tap to reveal]    │
├──────────────────────┤
│ [✓ Got it] [✗ Wrong]│
├──────────────────────┤
│ Progress: 4/7 ✓     │
└──────────────────────┘
```

**Connected to backend**:
```typescript
// Get review items
const { data: items } = useQuery({
  queryKey: ['review'],
  queryFn: () => fetch('/api/progress/review-items').then(r => r.json())
});

// Submit review
const submitReview = useMutation({
  mutationFn: (contentId, isCorrect) => 
    fetch('/api/progress/review-item', {
      method: 'POST',
      body: JSON.stringify({ contentId, isCorrect })
    })
});
```

**From PRD Reference**: Section 3.4 - Review Screen (Spaced Repetition)

---

### 3.6: Build Profile Screen 🟡 MEDIUM PRIORITY
**Files to create**:
- `screens/ProfileScreen.tsx`
- `components/StatCard.tsx`
- `components/SettingsPanel.tsx`

**Effort**: 8 hours
**Output**: User stats + settings

**Tabs**:
1. **Stats**
   - Total hours studied
   - Total kanji learned
   - Total vocab learned
   - Current level (N5/N4/N3)
   - Longest streak
   - Weak areas

2. **Settings**
   - Daily reminder (time + sound)
   - Timezone
   - Language preference
   - Logout button

**From PRD Reference**: Section 3.5 - Profile Screen

---

### 3.7: Build Friends Screen 🟡 MEDIUM PRIORITY
**Files to create**:
- `screens/FriendsScreen.tsx`
- `components/FriendCard.tsx`
- `components/Leaderboard.tsx`
- `components/AddFriendModal.tsx`

**Effort**: 12 hours
**Output**: Friends list + leaderboards

**Screens**:
1. **Friends List**
   - Add friend button (with friend code input)
   - List of current friends
   - Remove friend option

2. **Leaderboard**
   - Sort by streak (most popular)
   - Show: name, streak, kanji learned
   - You highlighted

3. **Activity Feed**
   - Real-time polling (every 30s)
   - "Mina studied 25 min ago!"
   - Friend streaks

**Connected to backend**:
```typescript
// Get friend code
const { data: code } = useQuery({
  queryKey: ['friendCode'],
  queryFn: () => fetch('/api/friends/code').then(r => r.json())
});

// Add friend
const addFriend = useMutation({
  mutationFn: (code) => fetch('/api/friends/add', {
    method: 'POST',
    body: JSON.stringify({ code })
  })
});

// Get leaderboard (poll every 30s)
const { data: leaderboard } = useQuery({
  queryKey: ['leaderboard'],
  queryFn: () => fetch('/api/friends/leaderboard').then(r => r.json()),
  refetchInterval: 30000  // Poll every 30 seconds
});
```

**From PRD Reference**: Section 3.6 - Friends & Leaderboards

---

### 3.8: Wire Up Navigation 🟡 MEDIUM PRIORITY
**Files to edit**:
- `App.tsx`

**Effort**: 3 hours
**Output**: Bottom tab navigation working

**Navigation structure**:
```
App
├─ AuthStack (if not logged in)
│  ├─ SignUp
│  └─ Login
└─ MainStack (if logged in)
   ├─ Dashboard (home icon) 🏠
   ├─ Lesson (book icon) 📖
   ├─ Review (refresh icon) 🔄
   ├─ Profile (user icon) 👤
   └─ Friends (people icon) 👥
```

**From PRD Reference**: Section 3 - Features

---

## PHASE 4: TESTING & DEPLOYMENT (Week 5–6)

### 4.1: Test Auth Flow End-to-End 🔴 HIGH PRIORITY
**Test**: Sign up → Login → See dashboard

**Steps**:
1. Sign up with test email
2. Check Neon database (user created)
3. Login with same credentials
4. See dashboard with 0 streaks
5. Sign out

**From PRD Reference**: Section 3.1 - Authentication & Onboarding

---

### 4.2: Test Lesson Flow End-to-End 🔴 HIGH PRIORITY
**Test**: Learn → Recognize → Summary → Backend updated

**Steps**:
1. Open lesson screen
2. Learn phase: see kanji/vocab/audio ✓
3. Recognize phase: answer quiz
4. Write phase: practice strokes
5. Summary: see "Day 1 complete! 🎉"
6. Check backend: currentDay incremented

**From PRD Reference**: Section 3.3 - Daily Lesson Screen

---

### 4.3: Test Friends System 🟡 MEDIUM PRIORITY
**Test**: Add friend → See in leaderboard

**Steps**:
1. Sign up as "Mina"
2. Get friend code (e.g., AB3F7Q)
3. Sign up as "Rio"
4. Add Mina using code
5. Both see each other in leaderboard
6. Complete lesson as Mina
7. Rio's app (30s poll): see Mina's streak updated

**From PRD Reference**: Section 3.6 - Friends & Leaderboards

---

### 4.4: Deploy to TestFlight (iOS) / Play Store Internal Testing (Android) 🟡 MEDIUM PRIORITY
**Files**: Expo project
**Effort**: 2 hours
**Output**: App on your phone

**Steps**:
```bash
# Build for iOS
eas build --platform ios

# Or Android
eas build --platform android

# Submit to TestFlight
eas submit --platform ios
```

**From PRD Reference**: Section 6 - Deployment

---

### 4.5: QA with Your Friends 🟡 MEDIUM PRIORITY
**Test**: Have Mina, Rio, Kenji use the app

**Test cases**:
- ✅ Sign up
- ✅ Complete lesson
- ✅ Add friends
- ✅ Check leaderboard
- ✅ Review items

**Gather feedback**:
- Is it too confusing?
- Is Rio overwhelmed?
- Does Kenji want more info?

---

## PHASE 5: POST-MVP (Week 7+)

### 5.1: Implement Lesson Delivery API (If not done in 2.1) 🟡 MEDIUM PRIORITY
See **2.1** above

---

### 5.2: Add N4 Content 🟡 MEDIUM PRIORITY
Same as Phase 1 but for N4:
- 300+ kanji
- 1500 vocabulary
- 40+ grammar rules

**Effort**: 60–80 hours
**Timeline**: Week 7–10

---

### 5.3: Integrate DeepSeek 🟡 MEDIUM PRIORITY
**Files to create**:
- `src/routes/deepseek.ts`
- `services/deepseekService.ts`

**Endpoints**:
- `POST /api/deepseek/explain-error` (user got it wrong)
- `POST /api/deepseek/generate-examples` (contextual examples)
- `POST /api/deepseek/generate-quiz` (personalized quizzes)

**Effort**: 20–30 hours
**Timeline**: Week 7–8

**From PRD Reference**: Section 3.7 - Error Explanations (DeepSeek)

---

## SUMMARY TABLE

| # | Task | Priority | Hours | Week | Status |
|---|------|----------|-------|------|--------|
| 0.1 | Create Neon DB | 🔴 High | 0.25 | 1 | ✅ |
| 0.2 | Deploy Backend | 🔴 High | 0.5 | 1 | ✅ |
| 1.1 | Kanji JSON (N5) | 🔴 High | 40 | 1–2 | ⏳ |
| 1.2 | Vocab JSON (N5) | 🔴 High | 30 | 1–2 | ⏳ |
| 1.3 | Grammar JSON (N5) | 🔴 High | 20 | 1–2 | ⏳ |
| 1.4 | Hiragana/Katakana | 🔴 High | 10 | 1–2 | ⏳ |
| 1.5 | Download Audio | 🔴 High | 20 | 1–2 | ⏳ |
| 1.6 | Lesson Curriculum | 🔴 High | 5 | 1–2 | ⏳ |
| 2.1 | Lesson API | 🔴 High | 8 | 1–2 | ⏳ |
| 3.1 | Expo Setup | 🟡 Med | 1 | 2 | ⏳ |
| 3.2 | Auth Screens | 🔴 High | 15 | 2–3 | ⏳ |
| 3.3 | Dashboard | 🔴 High | 10 | 2–3 | ⏳ |
| 3.4 | Lesson Screen | 🔴 High | 25 | 3–4 | ⏳ |
| 3.5 | Review Screen | 🔴 High | 12 | 3–4 | ⏳ |
| 3.6 | Profile Screen | 🟡 Med | 8 | 4–5 | ⏳ |
| 3.7 | Friends Screen | 🟡 Med | 12 | 4–5 | ⏳ |
| 3.8 | Navigation | 🟡 Med | 3 | 4 | ⏳ |
| 4.1 | Test Auth | 🔴 High | 2 | 5 | ⏳ |
| 4.2 | Test Lessons | 🔴 High | 2 | 5 | ⏳ |
| 4.3 | Test Friends | 🟡 Med | 2 | 5 | ⏳ |
| 4.4 | Deploy Mobile | 🟡 Med | 2 | 5–6 | ⏳ |
| 4.5 | QA with Friends | 🟡 Med | 5 | 5–6 | ⏳ |
| 5.1 | N4 Content | 🟡 Med | 70 | 7–10 | ⏳ |
| 5.2 | DeepSeek | 🟡 Med | 25 | 7–8 | ⏳ |

---

## EXECUTION TIMELINE

### Week 1 (Setup + Start Content)
- [ ] 0.1: Create Neon DB (15 min)
- [ ] 0.2: Deploy backend (30 min)
- [ ] 1.4: Hiragana/Katakana JSON (5 hours)
- [ ] 1.5: Start downloading audio (10 hours)
- [ ] 1.1: Start curating kanji (20 hours)
- **Total**: ~35 hours

### Week 2 (Content + Expo Start)
- [ ] 1.1: Finish kanji JSON (20 hours)
- [ ] 1.2: Finish vocab JSON (30 hours)
- [ ] 1.3: Finish grammar JSON (20 hours)
- [ ] 1.6: Create lesson curriculum (5 hours)
- [ ] 2.1: Implement lesson API (8 hours)
- [ ] 3.1: Setup Expo (1 hour)
- [ ] 3.2: Start auth screens (5 hours)
- **Total**: ~89 hours

### Week 3 (Expo Screens)
- [ ] 3.2: Finish auth screens (10 hours)
- [ ] 3.3: Build dashboard (10 hours)
- [ ] 3.4: Build lesson screen (15 hours)
- [ ] 3.5: Build review screen (8 hours)
- **Total**: ~43 hours

### Week 4 (More Expo + Navigation)
- [ ] 3.5: Finish review screen (4 hours)
- [ ] 3.6: Build profile screen (8 hours)
- [ ] 3.7: Build friends screen (12 hours)
- [ ] 3.8: Wire up navigation (3 hours)
- **Total**: ~27 hours

### Week 5 (Testing + Refinement)
- [ ] 4.1: Test auth flow (2 hours)
- [ ] 4.2: Test lesson flow (2 hours)
- [ ] 4.3: Test friends system (2 hours)
- [ ] Bug fixes & refinement (10 hours)
- **Total**: ~16 hours

### Week 6 (Deployment + Launch)
- [ ] 4.4: Deploy to mobile (2 hours)
- [ ] 4.5: QA with friends (5 hours)
- [ ] Final tweaks (3 hours)
- **Total**: ~10 hours

### Weeks 7–8 (Post-MVP)
- [ ] 5.1: N4 content (70 hours)
- [ ] 5.2: DeepSeek integration (25 hours)
- **Total**: ~95 hours

---

## KEY INSIGHTS

### Start With Content (Phase 1)
- **Why**: Lesson screen can't display if no JSON files exist
- **Duration**: Weeks 1–2
- **Effort**: ~125 hours (but can be DIY to save money)

### Build Backend + Expo in Parallel
- Backend (Phase 2): Week 1–2 (mostly 2.1: Lesson API)
- Expo screens (Phase 3): Week 2–5

### Test Early & Often
- After each screen, test it works
- By week 5, have full working app

### Deploy at Week 6
- TestFlight/Play Store
- Soft launch to 3–5 friends
- Gather feedback

### Add Bells & Whistles Post-MVP
- N4 content (optional if MVP success)
- DeepSeek (nice-to-have, not required)

---

## THE ANSWER TO YOUR QUESTION

**If you had to number them (1, 2, 3...):**

1. **Setup backend + database** (0.1, 0.2) — 45 min
2. **Curate N5 content** (1.1–1.6) — 125 hours
3. **Implement lesson API** (2.1) — 8 hours
4. **Build Expo screens** (3.1–3.8) — ~100 hours
5. **Test everything** (4.1–4.5) — ~20 hours
6. **Deploy mobile app** (4.4) — 2 hours
7. **Post-MVP: N4 content** (5.1) — 70 hours
8. **Post-MVP: DeepSeek** (5.2) — 25 hours

**Simple version**: Content → Backend API → Expo UI → Test → Deploy

---

**Ready to start with #1 (Setup)?** Or skip to #2 (Content curation) if backend is done?
