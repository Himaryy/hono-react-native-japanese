# Graph Report - .  (2026-06-16)

## Corpus Check
- Corpus is ~44,851 words - fits in a single context window. You may not need a graph.

## Summary
- 821 nodes · 908 edges · 48 communities (43 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth Migration Snapshot v2|Auth Migration Snapshot v2]]
- [[_COMMUNITY_Database Layer|Database Layer]]
- [[_COMMUNITY_Planning Docs|Planning Docs]]
- [[_COMMUNITY_User Profile Migration v1|User Profile Migration v1]]
- [[_COMMUNITY_User Profile Migration v2|User Profile Migration v2]]
- [[_COMMUNITY_Schema Migration v2|Schema Migration v2]]
- [[_COMMUNITY_Review Items Migration v1|Review Items Migration v1]]
- [[_COMMUNITY_User Progress Migration v1|User Progress Migration v1]]
- [[_COMMUNITY_Friendships Migration v2|Friendships Migration v2]]
- [[_COMMUNITY_Auth Users Migration v2|Auth Users Migration v2]]
- [[_COMMUNITY_User Progress Migration v2|User Progress Migration v2]]
- [[_COMMUNITY_Friendships Migration v1|Friendships Migration v1]]
- [[_COMMUNITY_Review Items Migration v2|Review Items Migration v2]]
- [[_COMMUNITY_Friend Codes Migration v1|Friend Codes Migration v1]]
- [[_COMMUNITY_Sessions Foreign Keys|Sessions Foreign Keys]]
- [[_COMMUNITY_Accounts Foreign Keys|Accounts Foreign Keys]]
- [[_COMMUNITY_Backend Dependencies|Backend Dependencies]]
- [[_COMMUNITY_Friendships Migration v1b|Friendships Migration v1b]]
- [[_COMMUNITY_Backend Config|Backend Config]]
- [[_COMMUNITY_Friends & Social|Friends & Social]]
- [[_COMMUNITY_Verifications Migration|Verifications Migration]]
- [[_COMMUNITY_Schema Migration v1|Schema Migration v1]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Friend Codes Migration v2|Friend Codes Migration v2]]
- [[_COMMUNITY_Lesson Routes|Lesson Routes]]
- [[_COMMUNITY_Auth Schema|Auth Schema]]
- [[_COMMUNITY_Timestamps Migration|Timestamps Migration]]
- [[_COMMUNITY_Verifications Identifiers|Verifications Identifiers]]
- [[_COMMUNITY_Session IP Fields|Session IP Fields]]
- [[_COMMUNITY_Updated At Fields|Updated At Fields]]
- [[_COMMUNITY_JLPT Profile Routes|JLPT Profile Routes]]
- [[_COMMUNITY_Session Expiry|Session Expiry]]
- [[_COMMUNITY_ID Fields|ID Fields]]
- [[_COMMUNITY_Token Fields|Token Fields]]
- [[_COMMUNITY_User Agent Fields|User Agent Fields]]
- [[_COMMUNITY_Value Fields|Value Fields]]
- [[_COMMUNITY_Knowledge Summary|Knowledge Summary]]
- [[_COMMUNITY_Migration Journal|Migration Journal]]
- [[_COMMUNITY_Claude Settings|Claude Settings]]
- [[_COMMUNITY_Deployment Docs|Deployment Docs]]
- [[_COMMUNITY_TS Config Root|TS Config Root]]
- [[_COMMUNITY_Data Flow Clarifications|Data Flow Clarifications]]
- [[_COMMUNITY_Auth Router|Auth Router]]

## God Nodes (most connected - your core abstractions)
1. `columns` - 14 edges
2. `JLPT App PRD (Product Requirements Document)` - 14 edges
3. `public.friend_codes` - 11 edges
4. `public.friendships` - 11 edges
5. `public.review_items` - 11 edges
6. `public.user_profiles` - 11 edges
7. `public.user_progress` - 11 edges
8. `public.accounts` - 11 edges
9. `created_at` - 11 edges
10. `public.sessions` - 11 edges

## Surprising Connections (you probably didn't know these)
- `GET /lessons/today — Today's Lesson` --references--> `N5 Lessons Data (100-day plan JSON)`  [EXTRACTED]
  Backend/src/routes/lessons.route.ts → static-content/lessons/n5-lessons.json
- `GET /lessons/:day — Lesson by Day` --references--> `N5 Lessons Data (100-day plan JSON)`  [EXTRACTED]
  Backend/src/routes/lessons.route.ts → static-content/lessons/n5-lessons.json
- `Complete Project Checklist` --semantically_similar_to--> `Final Delivery Summary`  [INFERRED] [semantically similar]
  D:/Working Place/My Project/expo-japanese/Knowledge/JLPT_COMPLETE_CHECKLIST.md → D:/Working Place/My Project/expo-japanese/Knowledge/FINAL_SUMMARY.md
- `Backend Setup Guide` --semantically_similar_to--> `Backend with Better Auth + Hono + Drizzle Guide`  [INFERRED] [semantically similar]
  D:/Working Place/My Project/expo-japanese/Knowledge/JLPT_Backend_Setup.md → D:/Working Place/My Project/expo-japanese/Knowledge/JLPT_Backend_BetterAuth.md
- `N5 Lessons Data (100-day plan JSON)` --references--> `N5 Grammar Patterns (20 patterns JSON)`  [INFERRED]
  static-content/lessons/n5-lessons.json → static-content/grammar/n5-grammar.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MVP Build Triad (Static Content + Lesson API + Expo Screens must all complete for MVP)** — knowledge_build_order_phase1_static_content, knowledge_build_order_phase2_lesson_api, knowledge_build_order_phase3_expo_screens [EXTRACTED 1.00]
- **Full Stack Data Pipeline (Neon -> Hono -> TanStack Query -> Expo UI)** — claude_md_neon_postgresql, claude_md_hono_backend, claude_md_tanstack_query, claude_md_expo_frontend_stack [EXTRACTED 1.00]
- **Persona-Driven Feature Design (Mina / Rio / Kenji inform all feature decisions)** — knowledge_clarifications_persona_mina, knowledge_clarifications_persona_rio, knowledge_clarifications_persona_kenji, knowledge_jlpt_app_prd_friends_leaderboards, knowledge_jlpt_app_prd_lesson_screen [INFERRED 0.85]
- **Database Schema Layer (all Drizzle schemas re-exported through index)** — db_index_schemas, schema_auth, schema_userprofiles, schema_userprogress, schema_reviewitems, schema_friendships, schema_friendcodes [EXTRACTED 1.00]
- **Auth Subsystem (Better Auth + middleware + schema)** — lib_auth_betterauth, middleware_auth_middleware, schema_auth, db_client_drizzle [INFERRED 0.90]
- **Migration History (journal tracks both SQL migrations)** — db_migration_journal, db_migration_0000, db_migration_0001 [EXTRACTED 1.00]
- **Hono App with Auth, Progress, Profile, Friends, Lessons routes** — src_index_app, lib_auth_betterauth, concept_hono_framework [EXTRACTED 1.00]
- **Auth-Protected Route Handlers** — routes_friends_friends_route, routes_lessons_lessons_route, routes_profile_profile_route, routes_progress_progress_route [EXTRACTED 1.00]
- **N5 JLPT Static Content Bundle** — static_lessons_n5_lessons, static_kanji_n5_kanji, static_vocab_n5_vocab, static_grammar_n5_grammar, static_hiragana_n5_hiragana, static_katakana_n5_katakana [EXTRACTED 0.95]
- **Zod Request Validation Schemas** — schemas_friends_add_friend_schema, schemas_profile_update_profile_schema, schemas_progress_complete_lesson_schema, schemas_progress_review_items_schema [EXTRACTED 1.00]

## Communities (48 total, 5 thin omitted)

### Community 0 - "Auth Migration Snapshot v2"
Cohesion: 0.04
Nodes (46): name, notNull, primaryKey, type, name, notNull, primaryKey, type (+38 more)

### Community 1 - "Database Layer"
Cohesion: 0.10
Nodes (22): client, db, auth, AuthType, Variables, authMiddleware, authRouter, friendsRoute (+14 more)

### Community 2 - "Planning Docs"
Cohesion: 0.06
Nodes (42): JLPT App Build Order & Timeline, DeepSeek Integration, Phase 0: Setup (Neon DB + Backend Deploy), Phase 1: Static Content Curation, Phase 2: Lesson Delivery API, Phase 3: Expo App Screens, Phase 4: Testing & Deployment, Phase 5: Post-MVP (N4 + DeepSeek) (+34 more)

### Community 3 - "User Profile Migration v1"
Cohesion: 0.05
Nodes (42): current_day, current_streak, jlpt_level, last_studied_at, longest_streak, total_kanji_learned, total_vocab_learned, default (+34 more)

### Community 4 - "User Profile Migration v2"
Cohesion: 0.05
Nodes (42): current_day, current_streak, jlpt_level, last_studied_at, longest_streak, total_kanji_learned, total_vocab_learned, default (+34 more)

### Community 5 - "Schema Migration v2"
Cohesion: 0.05
Nodes (39): dialect, columns, name, nullsNotDistinct, id, prevId, checkConstraints, compositePrimaryKeys (+31 more)

### Community 6 - "Review Items Migration v1"
Cohesion: 0.05
Nodes (39): content_id, easy_factor, id, interval, last_reviewed_at, next_review_date, repetitions, name (+31 more)

### Community 7 - "User Progress Migration v1"
Cohesion: 0.05
Nodes (37): completed, completed_at, day, items_mastered_count, time_spent_minutes, name, notNull, primaryKey (+29 more)

### Community 8 - "Friendships Migration v2"
Cohesion: 0.06
Nodes (36): default, name, notNull, primaryKey, type, added_at, status, user_id_1 (+28 more)

### Community 9 - "Auth Users Migration v2"
Cohesion: 0.06
Nodes (36): email, email_verified, image, name, name, notNull, primaryKey, type (+28 more)

### Community 10 - "User Progress Migration v2"
Cohesion: 0.06
Nodes (35): completed, completed_at, day, items_mastered_count, time_spent_minutes, name, notNull, primaryKey (+27 more)

### Community 11 - "Friendships Migration v1"
Cohesion: 0.06
Nodes (34): friendships_user_id_1_user_id_2_pk, columns, name, checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled (+26 more)

### Community 12 - "Review Items Migration v2"
Cohesion: 0.06
Nodes (34): content_id, easy_factor, interval, last_reviewed_at, next_review_date, repetitions, name, notNull (+26 more)

### Community 13 - "Friend Codes Migration v1"
Cohesion: 0.06
Nodes (31): name, notNull, primaryKey, type, code, created_at, user_id, default (+23 more)

### Community 14 - "Sessions Foreign Keys"
Cohesion: 0.07
Nodes (29): sessions_user_id_users_id_fk, sessions_userId_idx, checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name (+21 more)

### Community 15 - "Accounts Foreign Keys"
Cohesion: 0.08
Nodes (25): columnsFrom, columnsTo, name, onDelete, onUpdate, tableFrom, tableTo, columns (+17 more)

### Community 16 - "Backend Dependencies"
Cohesion: 0.08
Nodes (23): dependencies, better-auth, dotenv, drizzle-orm, hono, @hono/node-server, @hono/zod-validator, pg (+15 more)

### Community 17 - "Friendships Migration v1b"
Cohesion: 0.09
Nodes (23): default, name, notNull, primaryKey, type, added_at, status, user_id_1 (+15 more)

### Community 18 - "Backend Config"
Cohesion: 0.18
Nodes (19): Backend Package (Hono Server), Better Auth (auth library), Drizzle ORM, Hono Web Framework, Neon PostgreSQL (serverless DB), Spaced Repetition System (SM-2-like: interval, easeFactor, repetitions), Drizzle DB Client, DB Schema Index (re-exports all schemas) (+11 more)

### Community 19 - "Friends & Social"
Cohesion: 0.15
Nodes (17): Friend Code System (6-char random code), Streak Tracking (currentStreak, longestStreak), DELETE /friends/:friendId — Remove Friend, Friends Route Handler, GET /friends/code — Get or Create Friend Code, GET /friends/leaderboard — Streak Leaderboard, GET /friends/list-friends — List Friends, POST /friends/add-friend — Add Friend by Code (+9 more)

### Community 20 - "Verifications Migration"
Cohesion: 0.12
Nodes (17): verifications_identifier_idx, checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name, policies (+9 more)

### Community 21 - "Schema Migration v1"
Cohesion: 0.13
Nodes (14): dialect, enums, id, _meta, columns, schemas, tables, policies (+6 more)

### Community 22 - "TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, jsx, jsxImportSource, module, moduleResolution, outDir, resolveJsonModule, skipLibCheck (+4 more)

### Community 23 - "Friend Codes Migration v2"
Cohesion: 0.18
Nodes (11): name, notNull, primaryKey, type, code, user_id, columns, name (+3 more)

### Community 24 - "Lesson Routes"
Cohesion: 0.28
Nodes (9): GET /lessons/:day — Lesson by Day, GET /lessons/today — Today's Lesson, Lessons Route Handler, N5 Grammar Patterns (20 patterns JSON), N5 Hiragana Characters (46 chars JSON), N5 Kanji Data (100 kanji JSON), N5 Katakana Characters (46 chars JSON), N5 Lessons Data (100-day plan JSON) (+1 more)

### Community 25 - "Auth Schema"
Cohesion: 0.25
Nodes (7): accounts, accountsRelations, sessions, sessionsRelations, users, usersRelations, verifications

### Community 26 - "Timestamps Migration"
Cohesion: 0.33
Nodes (6): created_at, default, name, notNull, primaryKey, type

### Community 27 - "Verifications Identifiers"
Cohesion: 0.33
Nodes (6): identifier, name, notNull, primaryKey, type, columns

### Community 28 - "Session IP Fields"
Cohesion: 0.33
Nodes (6): ip_address, name, notNull, primaryKey, type, columns

### Community 29 - "Updated At Fields"
Cohesion: 0.33
Nodes (6): updated_at, default, name, notNull, primaryKey, type

### Community 30 - "JLPT Profile Routes"
Cohesion: 0.60
Nodes (5): JLPT Level (N5-N1 enum), GET /profile — Fetch User Profile, PATCH /profile — Update JLPT Level, Profile Route Handler, updateProfileSchema (Zod — jlptLevel enum)

### Community 31 - "Session Expiry"
Cohesion: 0.40
Nodes (5): expires_at, name, notNull, primaryKey, type

### Community 32 - "ID Fields"
Cohesion: 0.40
Nodes (5): id, name, notNull, primaryKey, type

### Community 33 - "Token Fields"
Cohesion: 0.40
Nodes (5): token, name, notNull, primaryKey, type

### Community 34 - "User Agent Fields"
Cohesion: 0.40
Nodes (5): user_agent, name, notNull, primaryKey, type

### Community 35 - "Value Fields"
Cohesion: 0.40
Nodes (5): value, name, notNull, primaryKey, type

### Community 36 - "Knowledge Summary"
Cohesion: 0.50
Nodes (4): Backend Implementation Status (Complete), Final Delivery Summary, Complete Project Checklist, Technology Decisions Made

### Community 37 - "Migration Journal"
Cohesion: 0.50
Nodes (3): dialect, entries, version

## Knowledge Gaps
- **567 isolated node(s):** `PreToolUse`, `name`, `type`, `dev`, `build` (+562 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tables` connect `Schema Migration v2` to `Friendships Migration v2`, `Auth Users Migration v2`, `User Progress Migration v2`, `Sessions Foreign Keys`, `Accounts Foreign Keys`, `Verifications Migration`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `columns` connect `Auth Migration Snapshot v2` to `ID Fields`, `Accounts Foreign Keys`, `Friend Codes Migration v2`, `Timestamps Migration`, `Updated At Fields`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `columns` connect `User Profile Migration v2` to `Timestamps Migration`, `Schema Migration v2`, `Friend Codes Migration v2`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `name`, `type` to the rest of the system?**
  _570 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth Migration Snapshot v2` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `Database Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.10104529616724739 - nodes in this community are weakly interconnected._
- **Should `Planning Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.0627177700348432 - nodes in this community are weakly interconnected._