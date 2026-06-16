# JLPT App Backend with Better Auth + Hono + Drizzle

**Stack**: Hono + Better Auth + Drizzle ORM + Neon PostgreSQL  
**Deployment**: Vercel Edge Functions  
**Auth Flow**: Better Auth (email/password + optional OAuth)  

---

## 1. Why Better Auth for This Project

**Advantages you'll love**:
- ✅ Free, open-source (MIT license)
- ✅ Built for TypeScript-first apps
- ✅ Works perfectly with Hono
- ✅ Session management out-of-the-box
- ✅ Drizzle ORM integration (no manual queries)
- ✅ HttpOnly cookies (secure for mobile)
- ✅ Already tested in production (Rubeek)
- ✅ Handles password hashing securely (argon2)

**What you don't need to build**:
- Password hashing ✅ (Better Auth does it)
- Session tokens ✅ (Better Auth does it)
- CSRF protection ✅ (Better Auth handles it)
- Email verification ✅ (optional, you can add later)

---

## 2. Installation & Setup

```bash
# Install Better Auth + dependencies
npm install better-auth @better-auth/drizzle-adapter
npm install @hono/node-server  # For local dev
npm install crypto-js  # For secure token generation

# Dev dependencies
npm install -D drizzle-kit
```

---

## 3. Drizzle Schema with Better Auth Adapter

Better Auth automatically creates its own tables (users, sessions, accounts). You just need to configure the adapter.

```typescript
// src/db/schema.ts
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  real,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// BETTER AUTH TABLES (auto-managed)
// ============================================
// Better Auth creates these automatically:
// - users (id, email, name, image, emailVerified, createdAt, updatedAt)
// - sessions (id, userId, expiresAt, createdAt, updatedAt)
// - accounts (id, userId, accountId, provider, createdAt, updatedAt)
// - verifications (id, identifier, value, expiresAt, createdAt)
//
// You don't need to define them — just use the adapter!

// ============================================
// CUSTOM TABLES (Your App Data)
// ============================================

// User Profile Extension (stores JLPT-specific data)
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey().references(() => users.id),  // Foreign key to Better Auth users
  jlptLevel: text("jlpt_level").default("N5"),  // N5, N4, N3, N2, N1
  currentDay: integer("current_day").default(1),  // Day in curriculum
  totalKanjiLearned: integer("total_kanji_learned").default(0),
  totalVocabLearned: integer("total_vocab_learned").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastStudiedAt: timestamp("last_studied_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Progress (per day completed)
export const userProgress = pgTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  day: integer("day").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpentMinutes: integer("time_spent_minutes"),
  itemsMasteredCount: integer("items_mastered_count"),
});

// SRS Review Items (Spaced Repetition)
export const reviewItems = pgTable("review_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  contentId: text("content_id").notNull(),  // Kanji/vocab ID from static data
  nextReviewDate: timestamp("next_review_date").notNull(),
  repetitions: integer("repetitions").default(0),
  interval: integer("interval").default(1),  // Days
  easyFactor: real("easy_factor").default(2.5),  // SM-2 algorithm
  lastReviewedAt: timestamp("last_reviewed_at"),
});

// Quiz Results
export const quizResults = pgTable("quiz_results", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  quizId: text("quiz_id").notNull(),
  questionId: text("question_id").notNull(),
  userAnswer: text("user_answer").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Friendships
export const friendships = pgTable(
  "friendships",
  {
    userId1: text("user_id_1").references(() => users.id).notNull(),
    userId2: text("user_id_2").references(() => users.id).notNull(),
    addedAt: timestamp("added_at").defaultNow(),
    status: text("status").default("active"),  // "pending", "active", "blocked"
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId1, table.userId2] }),
  })
);

// Cached DeepSeek Content
export const cachedContent = pgTable("cached_content", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),  // "error_explanation", "example", "quiz"
  contentHash: text("content_hash").unique().notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Friend Codes (simple way to add friends without searching)
export const friendCodes = pgTable("friend_codes", {
  code: text("code").primaryKey(),  // 6-char code like "AB3F7Q"
  userId: text("user_id").references(() => users.id).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),  // Optional, codes can expire
});

// ============================================
// RELATIONS (for type safety)
// ============================================

export const userProfilesRelations = relations(userProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
  progress: many(userProgress),
  reviewItems: many(reviewItems),
  quizResults: many(quizResults),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

export const reviewItemsRelations = relations(reviewItems, ({ one }) => ({
  user: one(users, {
    fields: [reviewItems.userId],
    references: [users.id],
  }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
}));

export const friendCodesRelations = relations(friendCodes, ({ one }) => ({
  user: one(users, {
    fields: [friendCodes.userId],
    references: [users.id],
  }),
}));

// Import users table from Better Auth adapter (if needed for direct queries)
export { users };
```

---

## 4. Better Auth Setup

```typescript
// src/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db/client";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,  // All tables including Better Auth auto-generated ones
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/auth",  // Routes will be /auth/sign-up, /auth/sign-in, etc
  
  emailAndPassword: {
    enabled: true,
    autoSignUpCallback: async (user) => {
      // Create user profile extension when user signs up
      await db.insert(schema.userProfiles).values({
        userId: user.id,
        jlptLevel: "N5",  // Default to N5
        currentDay: 1,
      });
      return user;
    },
  },
  
  session: {
    expiresIn: 30 * 24 * 60 * 60,  // 30 days
    updateAge: 24 * 60 * 60,  // Refresh after 24 hours of activity
    cookieCache: {
      enabled: true,
    },
  },
  
  // Optional: Add OAuth providers later
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },
});

export type Session = typeof auth.$Infer.Session;
```

---

## 5. Drizzle Client Setup

```typescript
// src/db/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });

export type Database = typeof db;
```

---

## 6. Hono Setup with Better Auth

```typescript
// src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";
import authRoutes from "./routes/auth";
import lessonRoutes from "./routes/lessons";
import progressRoutes from "./routes/progress";
import friendsRoutes from "./routes/friends";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: ["http://localhost:8081", "exp://localhost:8081"],  // Expo dev
  credentials: true,  // Allow cookies
}));

// ============================================
// BETTER AUTH ROUTES (automatic)
// ============================================
// These are created by Better Auth automatically:
// POST   /auth/sign-up        (email + password)
// POST   /auth/sign-in        (email + password)
// POST   /auth/sign-out       (end session)
// GET    /auth/session        (get current session)
// POST   /auth/change-password
// POST   /auth/forgot-password
// POST   /auth/reset-password
//
// You don't need to implement these!

const authRoutes = auth.handler();
app.route("/auth", authRoutes);

// ============================================
// CUSTOM AUTH ROUTES (if needed)
// ============================================
app.route("/auth", authRoutes);  // Better Auth handler

// ============================================
// PROTECTED ROUTES (require valid session)
// ============================================
// Middleware to check if user is authenticated
app.use("/api/*", authMiddleware);

app.route("/api/lessons", lessonRoutes);
app.route("/api/progress", progressRoutes);
app.route("/api/friends", friendsRoutes);

// Health check
app.get("/health", (c) => c.json({ ok: true }));

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

export default app;
```

---

## 7. Auth Middleware (Check Session)

```typescript
// src/middleware/auth.ts
import { Context, MiddlewareHandler } from "hono";
import { auth } from "../auth";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: c.req.header(),
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Store user info in context for use in routes
    c.set("userId", session.user.id);
    c.set("user", session.user);
    c.set("session", session);

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

// Extend Hono context types for TypeScript
declare global {
  namespace HonoRequest {
    interface HonoRequest {
      userId?: string;
      user?: typeof auth.$Infer.Session.user;
      session?: typeof auth.$Infer.Session;
    }
  }
}
```

---

## 8. Routes Using Better Auth

### Progress Route
```typescript
// src/routes/progress.ts
import { Hono } from "hono";
import { db } from "../db/client";
import { userProfiles, userProgress } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const progress = new Hono();

// Get user stats (profile + progress)
progress.get("/stats", async (c) => {
  const userId = c.get("userId");
  
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId));
  
  if (profile.length === 0) {
    return c.json({ error: "Profile not found" }, 404);
  }
  
  return c.json({
    currentDay: profile[0].currentDay,
    totalKanjiLearned: profile[0].totalKanjiLearned,
    totalVocabLearned: profile[0].totalVocabLearned,
    currentStreak: profile[0].currentStreak,
    longestStreak: profile[0].longestStreak,
    jlptLevel: profile[0].jlptLevel,
    lastStudiedAt: profile[0].lastStudiedAt,
  });
});

// Complete a lesson
progress.post("/complete-lesson", async (c) => {
  const userId = c.get("userId");
  const { day, timeSpentMinutes, itemsMasteredCount } = await c.req.json();
  
  // Record progress
  const progressId = crypto.randomUUID();
  await db.insert(userProgress).values({
    id: progressId,
    userId,
    day,
    completed: true,
    completedAt: new Date(),
    timeSpentMinutes,
    itemsMasteredCount,
  });
  
  // Update user profile
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId));
  
  if (profile.length === 0) {
    return c.json({ error: "Profile not found" }, 404);
  }
  
  const currentDay = profile[0].currentDay;
  const newDay = Math.max(currentDay, day + 1);
  const newKanjiCount = profile[0].totalKanjiLearned + itemsMasteredCount;
  
  await db
    .update(userProfiles)
    .set({
      currentDay: newDay,
      totalKanjiLearned: newKanjiCount,
      lastStudiedAt: new Date(),
    })
    .where(eq(userProfiles.userId, userId));
  
  return c.json({ success: true, nextDay: newDay });
});

export default progress;
```

### Friends Route
```typescript
// src/routes/friends.ts
import { Hono } from "hono";
import { db } from "../db/client";
import { userProfiles, friendships, friendCodes } from "../db/schema";
import { eq, or, and } from "drizzle-orm";
import crypto from "crypto";

const friends = new Hono();

// Generate friend code (one per user)
friends.post("/generate-code", async (c) => {
  const userId = c.get("userId");
  
  // Check if code already exists
  const existing = await db
    .select()
    .from(friendCodes)
    .where(eq(friendCodes.userId, userId));
  
  if (existing.length > 0) {
    return c.json({ code: existing[0].code });
  }
  
  // Generate unique 6-char code
  const code = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
  
  await db.insert(friendCodes).values({
    code,
    userId,
    createdAt: new Date(),
  });
  
  return c.json({ code });
});

// Add friend by code
friends.post("/add-by-code", async (c) => {
  const userId = c.get("userId");
  const { code } = await c.req.json();
  
  // Find user with this code
  const friendCodeRecord = await db
    .select()
    .from(friendCodes)
    .where(eq(friendCodes.code, code));
  
  if (friendCodeRecord.length === 0) {
    return c.json({ error: "Friend code not found" }, 404);
  }
  
  const friendId = friendCodeRecord[0].userId;
  
  if (friendId === userId) {
    return c.json({ error: "Cannot add yourself as friend" }, 400);
  }
  
  // Check if already friends
  const existing = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(
          eq(friendships.userId1, userId),
          eq(friendships.userId2, friendId)
        ),
        and(
          eq(friendships.userId1, friendId),
          eq(friendships.userId2, userId)
        )
      )
    );
  
  if (existing.length > 0) {
    return c.json({ error: "Already friends" }, 409);
  }
  
  // Add friendship (sorted for consistency)
  const [id1, id2] = [userId, friendId].sort();
  await db.insert(friendships).values({
    userId1: id1,
    userId2: id2,
    status: "active",
    addedAt: new Date(),
  });
  
  return c.json({ success: true });
});

// Get friends' activity (for polling every 30s)
friends.get("/activity", async (c) => {
  const userId = c.get("userId");
  
  // Get all friends
  const friendList = await db
    .select()
    .from(friendships)
    .where(
      or(
        eq(friendships.userId1, userId),
        eq(friendships.userId2, userId)
      )
    );
  
  const friendIds = friendList.map((f) =>
    f.userId1 === userId ? f.userId2 : f.userId1
  );
  
  if (friendIds.length === 0) {
    return c.json({ friends: [] });
  }
  
  // Get friends' stats
  const friendStats = await db
    .select({
      userId: userProfiles.userId,
      currentStreak: userProfiles.currentStreak,
      totalKanjiLearned: userProfiles.totalKanjiLearned,
      lastStudiedAt: userProfiles.lastStudiedAt,
      jlptLevel: userProfiles.jlptLevel,
    })
    .from(userProfiles)
    .where(
      or(...friendIds.map((id) => eq(userProfiles.userId, id)))
    );
  
  return c.json({ friends: friendStats });
});

// Get leaderboard (weekly)
friends.get("/leaderboard", async (c) => {
  const userId = c.get("userId");
  
  // Get user's friends
  const friendList = await db
    .select()
    .from(friendships)
    .where(
      or(
        eq(friendships.userId1, userId),
        eq(friendships.userId2, userId)
      )
    );
  
  const friendIds = friendList.map((f) =>
    f.userId1 === userId ? f.userId2 : f.userId1
  );
  
  friendIds.push(userId);  // Include self
  
  // Get all stats, sort by streak
  const leaderboard = await db
    .select({
      userId: userProfiles.userId,
      currentStreak: userProfiles.currentStreak,
      totalKanjiLearned: userProfiles.totalKanjiLearned,
      jlptLevel: userProfiles.jlptLevel,
    })
    .from(userProfiles)
    .where(
      or(...friendIds.map((id) => eq(userProfiles.userId, id)))
    );
  
  const sorted = leaderboard.sort((a, b) => 
    (b.currentStreak || 0) - (a.currentStreak || 0)
  );
  
  return c.json({ leaderboard: sorted });
});

export default friends;
```

---

## 9. Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:password@...neon.tech/jlpt_db?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000  # Change to your domain in production
```

For Vercel, add these in the dashboard.

---

## 10. Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 11. Migration & Deployment

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations (creates tables)
npm run db:migrate

# Local dev
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 12. Frontend Integration (Expo)

### Setup Better Auth Client

```typescript
// app/api/auth.ts (or wherever you manage auth state)
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  baseURL: "http://your-backend-url",  // Vercel URL in production
});

export const { signUp, signIn, signOut, useSession } = client;
```

### Sign Up
```typescript
const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await signUp({
    email,
    password,
    name: username,
    redirectTo: "/dashboard",
  });
  
  if (error) {
    console.error(error);
    return;
  }
  
  // Better Auth automatically creates user profile via autoSignUpCallback
  navigation.navigate("Dashboard");
};
```

### Sign In
```typescript
const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await signIn({
    email,
    password,
    redirectTo: "/dashboard",
  });
  
  if (error) {
    console.error(error);
    return;
  }
  
  navigation.navigate("Dashboard");
};
```

### Get Session
```typescript
const { data: session } = useSession();

return (
  <Text>Welcome, {session?.user?.name}!</Text>
);
```

### Sign Out
```typescript
const handleSignOut = async () => {
  await signOut({
    fetchOptions: { redirect: false },
  });
  navigation.navigate("Login");
};
```

---

## 13. Key Better Auth Features

| Feature | How to Use | Notes |
|---------|-----------|-------|
| **Sign Up** | `signUp({ email, password, name })` | Auto-creates user + calls autoSignUpCallback |
| **Sign In** | `signIn({ email, password })` | Returns session token |
| **Sign Out** | `signOut()` | Invalidates session |
| **Get Session** | `useSession()` | Reactive hook, auto-updates |
| **Change Password** | `changePassword({ oldPassword, newPassword })` | Built-in |
| **Password Reset** | `forgotPassword({ email })` | Sends email link (optional) |
| **HttpOnly Cookies** | Automatic | Secure by default, no XSS risk |
| **Session Refresh** | Automatic | Refreshes after 24h of activity |

---

## 14. Why This Setup Rocks

✅ **Zero boilerplate** — Better Auth handles 90% of auth logic  
✅ **Secure by default** — HttpOnly cookies, argon2 hashing, CSRF protection  
✅ **Type-safe** — Full TypeScript integration  
✅ **Drizzle integration** — Adapter manages all DB queries  
✅ **Session management** — Auto-expiry, refresh, user context  
✅ **Auto-profile creation** — `autoSignUpCallback` creates user profile on signup  
✅ **Works offline** — Mobile app can cache session data  
✅ **Free & open-source** — No vendor lock-in  

---

## 15. Common Gotchas & Solutions

### Issue: "Session is null after sign-up"
**Solution**: Wait for session to hydrate
```typescript
const { data: session, isPending } = useSession();

if (isPending) return <LoadingScreen />;
if (!session) return <LoginScreen />;
```

### Issue: "CORS error when signing in from Expo"
**Solution**: Ensure `credentials: true` in CORS middleware
```typescript
app.use("*", cors({
  origin: ["http://localhost:8081", "exp://localhost:8081"],
  credentials: true,  // Allow cookies
}));
```

### Issue: "Better Auth routes 404"
**Solution**: Make sure you're calling `auth.handler()` and routing it
```typescript
const authRoutes = auth.handler();
app.route("/auth", authRoutes);  // Must be before other routes
```

### Issue: "autoSignUpCallback not firing"
**Solution**: Make sure it's defined in `betterAuth()` config, not in route handler

---

## Summary

**You now have**:
- ✅ Better Auth integration with Hono
- ✅ Drizzle schema ready to use
- ✅ Auto user profile creation on signup
- ✅ Friend system with friend codes
- ✅ Leaderboards + activity polling
- ✅ Session management
- ✅ Ready to deploy to Vercel

**Next steps**:
1. Copy schema + auth setup
2. Generate migrations: `npm run db:generate`
3. Apply migrations: `npm run db:migrate`
4. Start dev server: `npm run dev`
5. Test auth endpoints with Postman or your Expo app
6. Deploy to Vercel: `vercel --prod`

Questions on the Better Auth setup?
