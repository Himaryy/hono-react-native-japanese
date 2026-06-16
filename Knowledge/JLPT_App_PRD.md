# JLPT Learning App - Product Requirements Document (PRD)

**Project**: Japanese Language Learning App (JLPT Focused)  
**Platform**: React Native (Expo)  
**Target Users**: Friends studying for JLPT test (N5 → N3)  
**Status**: PRD Draft  
**Last Updated**: June 2026  

---

## 1. Product Overview

### Vision
A mobile-first JLPT learning companion that combines expert-curated static content with AI-powered personalization to help users systematically progress from N5 to N3 level, with built-in social accountability (friend leaderboards, group streaks).

### Success Metrics
- **Retention**: 70%+ weekly active users after 4 weeks
- **Progression**: Users complete N5 level within 8 weeks
- **Engagement**: Average 20+ min/day, 6+ days/week
- **Group Sync**: 80%+ of friend groups have ≥2 members studying together
- **Accuracy**: 90%+ user satisfaction with explanations (5-star system)

### Core Pillars
1. **Structured Learning** — JLPT-aligned content (not chaotic)
2. **Daily Habit** — 15–30 min sessions, low friction
3. **Smart Feedback** — DeepSeek explains why you got it wrong
4. **Social Motivation** — Visible progress vs friends
5. **Offline-First** — Static content works without internet

---

## 2. User Personas

### Persona 1: Mina (The Committed Learner)
- **Goal**: Pass JLPT N3 in 6 months
- **Study Style**: Consistent, 30 min every evening
- **Pain Points**: Confuses similar grammar patterns, loses motivation if alone
- **Needs**: Clear progression path, error explanations, group leaderboards

### Persona 2: Rio (The Casual Enthusiast)
- **Goal**: "Get decent at Japanese, maybe take N4 next year"
- **Study Style**: Sporadic, 10–15 min when bored
- **Pain Points**: Unclear what to focus on, too much content feels overwhelming
- **Needs**: Bite-sized lessons, reminders, not judged by leaderboard

### Persona 3: Kenji (The Perfectionist)
- **Goal**: Master N3 grammar nuances
- **Study Style**: 45–60 min, deep dives into tricky topics
- **Pain Points**: Wants detailed explanations, not simplified versions
- **Needs**: Advanced content, etymology, related patterns, native explanations

---

## 3. Feature Set (MVP → Post-Launch)

### Phase 1: MVP (Weeks 1–6)
Launch with N5 only. Core features only.

#### 3.1 Authentication & Onboarding
**Feature**: User signup + goal selection  
**User Flow**:
1. Signup (email + password, or Google/Apple sign-in)
2. Select goal: "Learn casual Japanese" / "Pass N5" / "Pass N4" / "Pass N3"
3. Confirm timezone (for daily reset, streaks)
4. Tutorial: Tap through 3 screens (why JLPT structure, what you'll learn, streak system)
5. Enter first friend's code (optional but encouraged) → add to friends list
6. Dashboard → empty state with "Start your first lesson" CTA

**Success Criteria**: <2 min onboarding, 95%+ completion rate

---

#### 3.2 Dashboard (Home Screen)
**Purpose**: Daily entry point. Show status at a glance.

**Layout** (top to bottom):
```
[Profile badge: name + level (N5)]
[Streak counter: 🔥 7 days — "Keep it up!"]
[Daily progress bar: ████░░░░ 4/10 items learned today]

[Big CTA button: "Start Today's Lesson" or "Continue"]

[Quick Stats Card]
├─ Total kanji learned: 42
├─ Total vocab: 128
└─ Current streak: 7 days

[Friends Activity Card]
├─ Mina: 🔥 12 days, studied 25 min today
├─ Rio: 🔥 3 days, studied 8 min today
└─ [See all friends]

[Navigation Tabs at bottom]
├─ Dashboard (home icon, active)
├─ Learn (book icon)
├─ Review (refresh icon)
├─ Profile (user icon)
└─ Friends (people icon)
```

**Interactions**:
- Tap "Start Today's Lesson" → Daily Lesson screen
- Tap friend's name → Friend's profile (see their stats, compare)
- Streak indicator → tooltip explaining streak rules (study every day to keep it alive)

**Data to Display**:
- `user.currentStreak` (days)
- `user.totalKanjiLearned` (count)
- `user.totalVocabLearned` (count)
- `todayProgress` (items studied / daily target = 10)
- `friends[].lastStudiedAt` (to show "studied X min ago")

---

#### 3.3 Daily Lesson Screen
**Purpose**: Structured, guided learning session.

**Lesson Structure** (fixed daily, same for all N5 users):
```
Day 1: Hiragana introduction (あ行 — a-row)
├─ Content: 5 hiragana characters
├─ Duration: 10 min (expected)
└─ Activities: recognition + stroke practice

Day 2: Hiragana (か行 — k-row)
Day 3: Hiragana (さ行 — s-row)
...
Day 20: First vocabulary batch (days of week: 月火水木金土日)
Day 21: First grammar rule (です for polite form)
...
```

**Lesson Flow**:
```
[Header: "Day 15: Hiragana (た行)" + progress: 15/100]

[Phase 1: Learn (2 min)]
├─ Card 1: た (ta) — stroke animation, reading
├─ Card 2: ち (chi) — stroke animation, reading
├─ Card 3: つ (tsu) — stroke animation, reading
├─ Card 4: て (te) — stroke animation, reading
└─ Card 5: と (to) — stroke animation, reading

[Swipe or tap "Next" to advance]

[Phase 2: Recognize (3 min)]
├─ Quiz: "Tap the hiragana for 'ta'" → options: [た] [ち] [か] [さ]
├─ Correct ✓ → next question
└─ Wrong ✗ → "This is たです. Try again." → retry

[Phase 3: Write Practice (optional, 3 min)]
├─ Canvas: trace stroke order (1→2→3)
├─ Auto-check if strokes match reference
└─ Skip option (for users on-the-go)

[Phase 4: Summary]
├─ "You learned 5 characters today! 🎉"
├─ Items mastered: 5
├─ Time spent: 8 min
├─ Streak: 🔥 15 days
└─ [Button: "Study More" or "Save & Exit"]
```

**Key Details**:
- **Stroke animations**: Pre-built SVG animations using `KanjiVG` data
- **Audio**: Native speaker pronunciation (Forvo or recorded)
- **Difficulty**: Static progression (same lesson for all users on Day 15)
- **Offline**: All content bundled with app; no API calls needed

**Data Model**:
```typescript
type Lesson = {
  day: number;  // 1–100 (100-day N5 course)
  level: "N5" | "N4" | "N3";
  title: string;  // "Hiragana (た行)"
  contentType: "hiragana" | "kanji" | "vocab" | "grammar";
  items: Array<{
    id: string;
    content: string;  // the character/word
    reading: string;
    meaning?: string;
    strokeOrder?: SVGPath[];
    audioUrl: string;
    examples?: Array<{ sentence: string; english: string }>;
  }>;
  estimatedMinutes: number;
  phases: Array<"learn" | "recognize" | "write">;
};

type UserProgress = {
  userId: string;
  day: number;  // 1–100 (where they are in N5)
  completedDays: string[];  // ["day_1", "day_2", ...]
  currentStreak: number;
  itemsMastered: number;  // kanji + vocab
  lastStudiedAt: Date;
};
```

---

#### 3.4 Review Screen
**Purpose**: Spaced repetition of items user has learned.

**Logic**: SRS (Spaced Repetition System)
- Items due for review every 1, 3, 7, 14, 30 days based on Leitner algorithm
- If user gets it right → push back review date
- If user gets it wrong → reset to 1-day gap

**UI**:
```
[Header: "Kanji Review" + "7 items due today"]

[Review Stack (card-flipping interface)]
├─ Card 1: Front (kanji: 日), Back (meaning: sun, reading: にち)
│  ├─ User taps → flip
│  ├─ "Did you get it right?"
│  ├─ [Button: "✓ Got it"] → card moves to "done"
│  └─ [Button: "✗ Wrong"] → card moves to "retry"
├─ Card 2: ...
└─ Card 7: ...

[Progress: ████░░░░ 4/7 completed]

[Optional: "Tap to hear pronunciation"]
```

**Data Tracking**:
```typescript
type ReviewItem = {
  id: string;
  userId: string;
  contentId: string;  // kanji/vocab card ID
  nextReviewDate: Date;
  repetitions: number;
  interval: number;  // days (1, 3, 7, 14, 30)
  easyFactor: number;  // SM-2 algorithm parameter
  lastReviewedAt: Date;
};
```

---

#### 3.5 Profile Screen
**Purpose**: View personal stats, settings, manage friends.

**Tabs**:
1. **Stats**
   - Total study time (hours)
   - Total items learned (kanji + vocab)
   - Current level (N5 100% complete? → N4 ready)
   - Longest streak
   - Weakest areas (grammar, kanji, vocab)

2. **Settings**
   - Daily study reminder (time + sound)
   - Timezone
   - Languages (ja/en/id)
   - Delete account
   - API key setup (optional, advanced users)

3. **Friends**
   - List of friends + their stats
   - Add friend (by code or search)
   - Remove friend
   - Friend leaderboard (see below)

---

#### 3.6 Friends & Leaderboards
**Purpose**: Social accountability + motivation.

**Friend Codes**:
- Each user gets a unique 6-char code (e.g., `AB3F7Q`)
- Share via copy button → friend enters code → friendship confirmed

**Leaderboard Tiers** (weekly reset):
```
[Tier 1: Streaks]
🔥 Mina: 42 days (42 🔥)
🔥 Kenji: 28 days
🔥 You: 7 days

[Tier 2: Items Learned This Week]
📚 Rio: 84 items
📚 Mina: 70 items
📚 You: 42 items

[Tier 3: Time Spent This Week]
⏱️ Kenji: 312 min (5.2 hours)
⏱️ Mina: 298 min
⏱️ You: 140 min
```

**Motivation Mechanics**:
- If you break a streak → small notification (not shaming, just reminder)
- Friend passes your streak → subtle notification ("Mina just matched your 7-day streak! 🎯")
- Weekly summary email (opt-in): "You studied 140 min this week. Mina: 298 min. Keep it up!"

---

### Phase 2: Post-MVP (Weeks 7–12)
Add N4 content, AI explanations, advanced features.

#### 3.7 Error Explanations (DeepSeek)
**Trigger**: User gets quiz question wrong.

**Flow**:
```
[Question: "Choose the correct particle: 私は公園__行きます"]
[Options: A) に  B) へ  C) で  D) の]

[User selects: D) の → WRONG]

[Feedback Screen]
"❌ The correct answer is A) に

Why? The particle に shows destination (the place you're going to).
へ also means direction, but に is more direct (you arrive there).
を marks the direct object (what you do something to).
の shows possession/relationship.

Example: 私は公園に行く (I go to the park)
        私は学校へ行く (I go to school)
Both work, but に is most common for "arriving at."

Try again? [Retry] [Skip]"

[Behind the scenes]:
1. Detect wrong answer (A or B)
2. Check if explanation cached locally
3. If not cached:
   - Call DeepSeek: "User chose answer D (の) for particle choice question. Correct answer is A (に). Generate a brief, encouraging explanation..."
   - Cache result: { questionId, userId, explanation }
   - Display
```

**DeepSeek Prompt Design**:
```
System: "You are a Japanese JLPT tutor. Explain grammar mistakes in 2–3 sentences, then give an example."

User: "User chose the wrong particle (に vs へ). They selected の instead. Explain why the correct answer is に in simple terms."

Response: "[Generated explanation]"
```

**Caching Strategy**:
- Cache key: `${questionId}_explanation`
- TTL: 30 days (re-use explanation for all users)
- Store in local SQLite + optional cloud sync

---

#### 3.8 Contextual Example Generation
**Trigger**: User studies a grammar pattern and wants more examples.

**Flow**:
```
[User viewing grammar rule: 〜ている (ongoing action)]

[Example 1 from static content]:
私は本を読んでいます。(I am reading a book.)

[Button: "Get more examples"]

[DeepSeek generates 3 more examples]:
Example 2: 猫は寝ている。(The cat is sleeping.)
Example 3: 兄は大学に行っている。(My older brother is attending university.)
Example 4: 雨が降っている。(It is raining.)
```

**Backend**:
```typescript
async function generateContextualExamples(
  grammarRuleId: string,
  userLevel: "N5" | "N4" | "N3"
): Promise<string[]> {
  const rule = staticGrammarData[grammarRuleId];
  
  const prompt = `Generate 3 example Japanese sentences using the grammar pattern "${rule.pattern}". 
  Each sentence should:
  - Be appropriate for JLPT ${userLevel} level
  - Use only vocabulary from the N5/N4 core list
  - Include the reading in hiragana and English translation
  - Show a different context (daily life, nature, family, etc.)
  
  Format: 
  1. 日本語。(Reading.) (English translation.)
  2. ...`;
  
  const response = await deepseekAPI.generateText(prompt);
  cache.set(`examples_${grammarRuleId}`, response);
  return response;
}
```

---

#### 3.9 Personalized Quiz Generation
**Trigger**: User finishes weekly lesson batch.

**Flow**:
```
[End of Week 1]
"You've completed 15 lessons. Let's quiz you on the week's content!"

[DeepSeek generates 10 questions]:
1. Hiragana recognition (3 questions)
2. Vocab matching (3 questions)
3. Mixed hiragana + vocab (4 questions)

[User takes quiz]
8/10 correct ✓

[Results Screen]:
"Great work! 80%
Weak areas: Hiragana recognition (2 mistakes)
Next week, you'll get extra hiragana drills."
```

**Algorithm**:
1. Detect weak areas (hiragana, kanji, grammar, vocab)
2. Generate quiz weighted toward weak areas (60% weak, 40% strong)
3. Cache quiz for future use
4. Track results → adjust future lesson difficulty

---

#### 3.10 Pronunciation Feedback
**Phase**: After N4 launch, add optional audio recording.

**Flow**:
```
[User taps microphone icon on vocab card]
[Records: "こんにちは"]
[DeepSeek analyzes]:
"✓ Pronunciation is good!
Pitch accent: You said it as atamadaka (high-low). 
Correct! This word is indeed atamadaka.
Great job on the rhythm."

Or:

"❌ Pitch accent slightly off.
You said: こんにちは (high-high-high)
Correct: こんにちは (high-low-low)
The first mora is high, then drops. Try again!"
```

**Technical**:
- Record audio → send to DeepSeek Speech-to-Text
- Analyze pitch contour (DeepSeek can infer from transcription + user input)
- Generate feedback

---

### Phase 3: Advanced Features (Post-Launch)
- **Spaced repetition optimization** (per-user difficulty curve)
- **Community corrections** (flag bad explanations, suggest edits)
- **Anki export** (download flashcards for advanced users)
- **Reading comprehension** (JLPT-style short passages, timed)
- **Listening practice** (JLPT-style audio snippets, multiple choice)
- **Writing practice** (fill in blanks with keyboard + handwriting canvas)

---

## 4. Content Structure

### 4.1 N5 Curriculum (100 days)

**Days 1–10**: Hiragana (46 characters)
- Day 1–2: あ行, か行, さ行, た行, な行 (25 chars)
- Day 3–5: は行, ま行, や行, ら行, わを行 (21 chars)
- Day 6–10: Hiragana combinations (小文字: ぁぃぅぇぉ, ゃゅょ, etc.)

**Days 11–20**: Katakana (46 characters)
- Same structure as hiragana
- Each day: 5 characters + recognition quiz + stroke practice

**Days 21–60**: Core Vocabulary (400 words)
- Days 21–30: Daily items (曜日, 月, 日, 時間)
- Days 31–40: Family (父, 母, 兄, 妹, 子供)
- Days 41–50: Food (ご飯, 水, 肉, 野菜, パン)
- Days 51–60: Numbers & counters (一, 二, 三, ..., 百, 千; 人, 冊, 杯)

**Days 61–80**: Kanji (100 characters)
- Days 61–65: Basic strokes + 日, 月, 火, 水, 木
- Days 66–80: Nature kanji + frequency kanji (人, 大, 小, 上, 下, 中, 左, 右, 前, 後)

**Days 81–100**: Grammar Fundamentals (20 patterns)
- Day 81: です, ます (polite forms)
- Day 82: か (question marker)
- Day 83: は (topic marker)
- Day 84: が (subject marker)
- Days 85–100: Other particles (を, に, へ, で, から, まで, まで)

**Output**: 100 days → user is N5 ready (can read hiragana/katakana, know 400 words, basic grammar)

---

### 4.2 Static Content Schema

**Kanji Card** (example):
```json
{
  "id": "kanji_007",
  "kanji": "日",
  "jlptLevel": "N5",
  "strokeCount": 4,
  "readings": {
    "on": ["にち", "じつ"],
    "kun": ["ひ", "ひ."]
  },
  "meanings": ["day", "sun"],
  "strokeOrder": [
    "M10,10 L10,100 M10,40 L100,40 M10,70 L100,70 M100,10 L100,100",
    "...(4 total paths)"
  ],
  "etymology": "Derived from a drawing of the sun",
  "examples": [
    {
      "sentence": "今日は月曜日です。",
      "reading": "きょうはげつようびです。",
      "english": "Today is Monday.",
      "audioUrl": "audio/example_001.mp3"
    }
  ],
  "mnemonics": "A box = the sun in a window"
}
```

**Vocabulary Card** (example):
```json
{
  "id": "vocab_042",
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
}
```

**Grammar Rule Card** (example):
```json
{
  "id": "grammar_008",
  "pattern": "〜ています",
  "jlptLevel": "N4",
  "meaning": "Ongoing action or state",
  "explanation": "Indicates an action in progress or a state that results from a completed action.",
  "examples": [
    {
      "sentence": "私は今、本を読んでいます。",
      "reading": "わたしはいま、ほんをよんでいます。",
      "english": "I am reading a book right now."
    }
  ],
  "relatedPatterns": ["〜た", "〜ている"],
  "notes": "For state: 結婚している (I am married / I have gotten married)"
}
```

---

## 5. Data Model & Storage

### 5.1 Database Schema (SQLite Local + Cloud Sync)

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT,
  passwordHash TEXT,
  jlptLevel TEXT,  -- N5, N4, N3, N2, N1, None
  currentDay INT,  -- Where they are in the curriculum
  totalKanjiLearned INT,
  totalVocabLearned INT,
  currentStreak INT,
  lastStudiedAt TIMESTAMP,
  createdAt TIMESTAMP
);

-- User Progress (per lesson/day)
CREATE TABLE user_progress (
  id TEXT PRIMARY KEY,
  userId TEXT FOREIGN KEY,
  day INT,
  completed BOOLEAN,
  completedAt TIMESTAMP,
  timeSpentMinutes INT,
  itemsMasteredCount INT
);

-- Review Items (Leitner SRS)
CREATE TABLE review_items (
  id TEXT PRIMARY KEY,
  userId TEXT,
  contentId TEXT,  -- kanji/vocab ID
  nextReviewDate TIMESTAMP,
  repetitions INT,
  interval INT,  -- 1, 3, 7, 14, 30 days
  easyFactor REAL,  -- SM-2 algorithm
  lastReviewedAt TIMESTAMP
);

-- Quiz Results
CREATE TABLE quiz_results (
  id TEXT PRIMARY KEY,
  userId TEXT,
  quizId TEXT,
  questionId TEXT,
  userAnswer TEXT,
  correctAnswer TEXT,
  isCorrect BOOLEAN,
  timeSpentSeconds INT,
  createdAt TIMESTAMP
);

-- Friends
CREATE TABLE friendships (
  id TEXT PRIMARY KEY,
  userId1 TEXT,
  userId2 TEXT,
  addedAt TIMESTAMP,
  status TEXT  -- "pending", "active", "blocked"
);

-- Cached DeepSeek Content
CREATE TABLE cached_content (
  id TEXT PRIMARY KEY,
  type TEXT,  -- "error_explanation", "example", "quiz", "feedback"
  contentHash TEXT,  -- hash of prompt
  content TEXT,  -- DeepSeek output
  createdAt TIMESTAMP,
  expiresAt TIMESTAMP
);
```

---

## 6. Technical Architecture

### 6.1 Frontend (Expo)

**Tech Stack**:
- React Native + Expo
- React Navigation (bottom tabs + stack navigation)
- TanStack Query (data fetching + caching)
- Zustand (global state: user profile, session, friends)
- SQLite (local storage: static content + user progress)
- SVG (animations for stroke order)
- NativeWind / Tailwind (styling)

**File Structure**:
```
/src
  /components
    /common
      TabBar.tsx
      LessonCard.tsx
      KanjiCard.tsx
      VocabCard.tsx
    /screens
      DashboardScreen.tsx
      LessonScreen.tsx
      ReviewScreen.tsx
      ProfileScreen.tsx
      FriendsScreen.tsx
  /hooks
    useLesson.ts
    useReview.ts
    useDeepSeek.ts  (with caching)
  /services
    staticContent.ts  (load bundled data)
    deepseekService.ts
    srsEngine.ts  (spaced repetition)
    authService.ts
  /store
    userStore.ts  (Zustand)
    lessonStore.ts
  /types
    index.ts  (TypeScript interfaces)
  /data
    /static
      kanji-n5.json
      vocab-n5.json
      grammar-n5.json
```

---

### 6.2 Backend (Node.js + Express) — Optional but Recommended

**Endpoints**:

```
Auth
POST /auth/signup
POST /auth/login
POST /auth/refresh-token

User
GET /user/profile
PATCH /user/profile
GET /user/stats

Friends
GET /user/friends
POST /user/friends/add
DELETE /user/friends/:friendId
GET /leaderboard  (weekly stats)

Content Generation
POST /deepseek/explain-error
  { questionId, userAnswer, correctAnswer }
  → { explanation }

POST /deepseek/generate-examples
  { grammarRuleId }
  → { examples: string[] }

POST /deepseek/generate-quiz
  { weekNumber, userId }
  → { questions: Quiz[] }

Progress Sync
POST /sync/progress  (upload local SQLite data)
GET /sync/progress  (download latest)
```

**Stack**:
- Node.js + Express (or Fastify)
- PostgreSQL (cloud: Supabase, Neon, etc.)
- Prisma (ORM)
- Zod (validation)
- JWT (auth)

---

### 6.3 DeepSeek Integration

**API Setup**:
```typescript
// deepseekService.ts
import Anthropic from "@anthropic-sdk/sdk";

const deepseek = new Anthropic({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

async function explainError(
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  questionContext: string
): Promise<string> {
  const cacheKey = `explain_${questionId}_${userAnswer}`;
  
  // Check local cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  const response = await deepseek.messages.create({
    model: "deepseek-chat",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `User answered "${userAnswer}" to a Japanese grammar question. 
        The correct answer is "${correctAnswer}". 
        Context: ${questionContext}
        
        Give a brief, encouraging explanation (2–3 sentences max) 
        of why the correct answer is better, then one example sentence.
        Format: "❌ The correct answer is X. Why? ... Example: ..."
        `
      }
    ]
  });
  
  const explanation = response.content[0].type === "text" ? response.content[0].text : "";
  
  // Cache for future use
  await cache.set(cacheKey, explanation, { ttl: 2592000 });  // 30 days
  
  return explanation;
}
```

**Cost Estimation**:
- Assume 1000 users
- Each user makes 5 API calls/day (error explanations, example generation)
- 5,000 calls/day × 30 days = 150,000 calls/month
- DeepSeek pricing: ~$0.14 per 1M input tokens, $0.28 per 1M output tokens
- Average 300 tokens per request = $0.0042/request
- **Monthly cost**: ~$630–$800 (plus caching reduces repeat calls by 70%, so ~$200–$250 effective)

**Cost Optimization**:
- Cache heavily (same question doesn't regenerate explanation)
- Batch requests where possible
- Use cheaper model for simple tasks (summarization)
- Implement user quota (e.g., 20 AI calls/day before upgrade)

---

## 7. User Workflows (Day-in-the-Life)

### Workflow 1: New User (Mina)
```
1. Download app from App Store
2. Tap "Sign up"
3. Email: mina@example.com, password
4. Goal: "Pass JLPT N3 in 6 months"
5. Timezone: Asia/Jakarta
6. Friend code: [optional] AB3F7Q (adds Rio as friend)
7. Tutorial: 3-screen walkthrough
8. → Dashboard (shows "Day 1: Hiragana (あ行)")
9. Tap "Start Today's Lesson"
10. Learns 5 hiragana, does recognition quiz (4/5 correct)
11. Completes lesson in 8 min
12. Streak: 🔥 1 day
13. Exit → dashboard

Next day:
1. Open app → dashboard shows "Day 2: Hiragana (か行)"
2. Sees Rio also studied today (notification: "Rio studied 12 min today!")
3. Studies for 10 min
4. Streak: 🔥 2 days
```

### Workflow 2: Returning User (Kenji) — Weak in Grammar
```
1. Open app → dashboard
2. Sees streak: 🔥 15 days
3. Sees weekly leaderboard:
   - Streaks: Mina 42, Rio 28, Kenji 15
   - Time: Kenji 312 min (leader for this week)
4. Taps "Start Today's Lesson"
5. Completes Day 25 (grammar: particles)
6. Gets a question wrong: "Choose particle: 私は公園へ行きます"
7. Selects wrong answer (の)
8. DeepSeek explanation appears:
   "❌ The correct answer is へ.
   へ shows direction/destination (where you're going).
   に shows location (where you arrive).
   Example: 私は公園へ行く (I go to the park, direction focused)"
9. Taps "Retry" → gets it right this time
10. Continues with review items (5 kanji due for review)
11. Gets all right → SRS pushes them back 7–14 days
12. Session: 28 min. Streak: 🔥 16 days
```

### Workflow 3: Friend Catch-Up (Rio) — Casual Learner
```
1. Open app → dashboard
2. Sees Mina & Kenji both have longer streaks
3. Notification: "You'll lose your 3-day streak if you don't study today!"
4. Taps "Start Today's Lesson"
5. Does quick 10-min lesson (Day 12)
6. Doesn't do review — just quits
7. Streak: 🔥 4 days (safe)

Later (evening):
1. App sends reminder: "Rio, have you studied today? 🎯"
2. Rio taps notification
3. Does review (3 vocab due)
4. Quits

Study time: 12 min total. Streak: 🔥 4 days
```

---

## 8. Rollout Plan

### Week 1–2: Development Sprint
- [ ] Auth system (signup, login, JWT)
- [ ] Dashboard screen (basic layout)
- [ ] Lesson screen (hiragana only)
- [ ] Static data loader (load kanji/vocab JSON)
- [ ] Review screen (basic SRS)

### Week 3–4: Feature Completion
- [ ] Profile screen
- [ ] Friends system (friend codes, list)
- [ ] Leaderboards
- [ ] Push notifications
- [ ] Offline-first with SQLite

### Week 5: Testing & Refinement
- [ ] QA with your friends
- [ ] Bug fixes
- [ ] Content audit (kanji stroke order, audio)
- [ ] Performance optimization

### Week 6: Soft Launch
- [ ] Release to TestFlight / Google Play Internal Testing
- [ ] Beta: 5–10 friends (2 weeks)
- [ ] Gather feedback

### Week 7+: DeepSeek Integration
- [ ] Error explanation API
- [ ] Example generation
- [ ] Quiz generation
- [ ] Caching strategy
- [ ] Full launch

---

## 9. Success Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Daily Active Users (DAU)** | 70%+ of users | Firebase Analytics / Mixpanel |
| **Session Duration** | 20+ min/day avg | App event logging |
| **Study Streak Avg** | 14+ days | User table |
| **N5 Completion Rate** | 60%+ finish N5 | progress table, day=100 |
| **Error Rate (DeepSeek explanations)** | <10% "unhelpful" ratings | In-app 5-star ratings |
| **Friends Retention** | 80%+ of friends stay connected | friendships table |
| **App Crash Rate** | <0.1% | Sentry / Firebase Crashlytics |
| **API Response Time** | <500ms avg | DeepSeek caching + local-first design |

---

## 10. Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Users get bored after N5 | High | Launch N4 content week 6–8. Plan content roadmap early. |
| DeepSeek API costs spiral | Medium | Implement aggressive caching (70% hit rate). Add user quotas. |
| Content accuracy issues | High | Have native speaker review all static content before launch. |
| Poor social engagement | Medium | Gamify streaks, leaderboards, badges early. Test with friends first. |
| Offline failures | Medium | Comprehensive static data. Graceful degradation if API fails. |
| User churn due to difficulty jump N5→N4 | High | Smooth difficulty curve. Celebrate N5 completion with badge. |

---

## 11. Success Criteria for MVP

**Must Have**:
- ✅ N5 curriculum complete (100 days of content)
- ✅ Offline functionality (no internet needed)
- ✅ Streaks + basic leaderboards
- ✅ Friends system
- ✅ User can complete N5 in 8–12 weeks
- ✅ <0.5% crash rate

**Should Have**:
- ✅ DeepSeek error explanations
- ✅ Push notifications (daily reminder)
- ✅ Profile stats (kanji, vocab count)
- ✅ Beautiful UI (Figma mockups done)

**Nice to Have**:
- ⚠️ N4 content (post-launch)
- ⚠️ Community corrections
- ⚠️ Reading/listening practice

---

## 12. Post-Launch Roadmap

**Month 2**:
- N4 content (300+ kanji, 1500 vocab, 40+ grammar rules)
- Full DeepSeek integration (error explanations, example generation, quizzes)

**Month 3**:
- Reading comprehension module
- Listening practice (JLPT-style audio)

**Month 4**:
- N3 content launch
- Writing practice (fill-in-blank + handwriting)

**Month 6**:
- Web version (React)
- Desktop study app (Electron)
- Community features (forums, study groups)

---

## 13. Appendix: Glossary

- **JLPT**: Japanese Language Proficiency Test (N1–N5, N5 easiest)
- **SRS**: Spaced Repetition System (Leitner algorithm used here)
- **Kanji**: Chinese characters used in Japanese
- **Hiragana/Katakana**: Two phonetic alphabets
- **Pitch accent**: Tonal variation in Japanese (critical for listening)
- **N5/N4/N3**: JLPT difficulty levels
- **Streak**: Consecutive days of study (motivational)

---

**Document Version**: 1.0  
**Last Updated**: June 15, 2026  
**Next Review**: After 2-week soft launch
