# Graph Report - .  (2026-06-17)

## Corpus Check
- 109 files · ~71,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1067 nodes · 1180 edges · 91 communities (72 shown, 19 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Screen Layout|App Screen Layout]]
- [[_COMMUNITY_Backend Core & DB Client|Backend Core & DB Client]]
- [[_COMMUNITY_Migration v2 Access Token Fields|Migration v2 Access Token Fields]]
- [[_COMMUNITY_Migration v1 Review Items Fields|Migration v1 Review Items Fields]]
- [[_COMMUNITY_Build Planning Docs|Build Planning Docs]]
- [[_COMMUNITY_Migration v2 User Profile Fields|Migration v2 User Profile Fields]]
- [[_COMMUNITY_Migration v2 Schema Meta|Migration v2 Schema Meta]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_Migration v1 Added At Fields|Migration v1 Added At Fields]]
- [[_COMMUNITY_Migration v2 Added At Fields|Migration v2 Added At Fields]]
- [[_COMMUNITY_Migration v2 Auth User Fields|Migration v2 Auth User Fields]]
- [[_COMMUNITY_Migration v2 User Progress Fields|Migration v2 User Progress Fields]]
- [[_COMMUNITY_Migration v2 Review Items Fields|Migration v2 Review Items Fields]]
- [[_COMMUNITY_Migration v1 User Progress Fields|Migration v1 User Progress Fields]]
- [[_COMMUNITY_Project Concepts & Docs|Project Concepts & Docs]]
- [[_COMMUNITY_Migration v2 Sessions Foreign Keys|Migration v2 Sessions Foreign Keys]]
- [[_COMMUNITY_App JSON Config|App JSON Config]]
- [[_COMMUNITY_Migration v2 Accounts Foreign Keys|Migration v2 Accounts Foreign Keys]]
- [[_COMMUNITY_Backend Package Config|Backend Package Config]]
- [[_COMMUNITY_Root Layout & Auth Guard|Root Layout & Auth Guard]]
- [[_COMMUNITY_Friends & Social Routes|Friends & Social Routes]]
- [[_COMMUNITY_Migration v2 Verifications|Migration v2 Verifications]]
- [[_COMMUNITY_Database Layer|Database Layer]]
- [[_COMMUNITY_Backend TypeScript Config|Backend TypeScript Config]]
- [[_COMMUNITY_Migration v1 Schema Meta|Migration v1 Schema Meta]]
- [[_COMMUNITY_Migration v2 Friend Code Fields|Migration v2 Friend Code Fields]]
- [[_COMMUNITY_Migration v1 Friend Codes Table|Migration v1 Friend Codes Table]]
- [[_COMMUNITY_Migration v1 User Profiles Table|Migration v1 User Profiles Table]]
- [[_COMMUNITY_Migration v1 User Progress Table|Migration v1 User Progress Table]]
- [[_COMMUNITY_Lesson Routes & Static Content|Lesson Routes & Static Content]]
- [[_COMMUNITY_Project Reset Script|Project Reset Script]]
- [[_COMMUNITY_Auth Schema (Drizzle)|Auth Schema (Drizzle)]]
- [[_COMMUNITY_Frontend Build Scripts|Frontend Build Scripts]]
- [[_COMMUNITY_Frontend Dev Dependencies|Frontend Dev Dependencies]]
- [[_COMMUNITY_Migration v1 Friend Code Fields|Migration v1 Friend Code Fields]]
- [[_COMMUNITY_Migration v1 Created At Fields|Migration v1 Created At Fields]]
- [[_COMMUNITY_Migration v1 Current Day Fields|Migration v1 Current Day Fields]]
- [[_COMMUNITY_Migration v1 Current Streak Fields|Migration v1 Current Streak Fields]]
- [[_COMMUNITY_Migration v1 JLPT Level Fields|Migration v1 JLPT Level Fields]]
- [[_COMMUNITY_Migration v1 Last Studied Fields|Migration v1 Last Studied Fields]]
- [[_COMMUNITY_Migration v1 Longest Streak Fields|Migration v1 Longest Streak Fields]]
- [[_COMMUNITY_Migration v1 Total Kanji Fields|Migration v1 Total Kanji Fields]]
- [[_COMMUNITY_Migration v1 Total Vocab Fields|Migration v1 Total Vocab Fields]]
- [[_COMMUNITY_Migration v2 Created At Fields|Migration v2 Created At Fields]]
- [[_COMMUNITY_Migration v2 Identifier Fields|Migration v2 Identifier Fields]]
- [[_COMMUNITY_Migration v2 IP Address Fields|Migration v2 IP Address Fields]]
- [[_COMMUNITY_Migration v2 Updated At Fields|Migration v2 Updated At Fields]]
- [[_COMMUNITY_Claude Settings & Hooks|Claude Settings & Hooks]]
- [[_COMMUNITY_JLPT Profile Routes|JLPT Profile Routes]]
- [[_COMMUNITY_Metro & NativeWind Config|Metro & NativeWind Config]]
- [[_COMMUNITY_Frontend Package Meta|Frontend Package Meta]]
- [[_COMMUNITY_Migration v1 User ID Fields|Migration v1 User ID Fields]]
- [[_COMMUNITY_Migration v1 Unique Constraints|Migration v1 Unique Constraints]]
- [[_COMMUNITY_Migration v2 Expires At Fields|Migration v2 Expires At Fields]]
- [[_COMMUNITY_Migration v2 ID Fields|Migration v2 ID Fields]]
- [[_COMMUNITY_Migration v2 Token Fields|Migration v2 Token Fields]]
- [[_COMMUNITY_Migration v2 User Agent Fields|Migration v2 User Agent Fields]]
- [[_COMMUNITY_Migration v2 Value Fields|Migration v2 Value Fields]]
- [[_COMMUNITY_VSCode Settings|VSCode Settings]]
- [[_COMMUNITY_Android App Icons|Android App Icons]]
- [[_COMMUNITY_Project Completion Docs|Project Completion Docs]]
- [[_COMMUNITY_Migration v1 Schema Tables|Migration v1 Schema Tables]]
- [[_COMMUNITY_Migration Journal|Migration Journal]]
- [[_COMMUNITY_External Link Component|External Link Component]]
- [[_COMMUNITY_Frontend ESLint Config|Frontend ESLint Config]]
- [[_COMMUNITY_Expo Devices Config|Expo Devices Config]]
- [[_COMMUNITY_App JSON & Babel Config|App JSON & Babel Config]]
- [[_COMMUNITY_Expo Router Type Declarations|Expo Router Type Declarations]]
- [[_COMMUNITY_VSCode Extensions|VSCode Extensions]]
- [[_COMMUNITY_Root Layout File|Root Layout File]]
- [[_COMMUNITY_Favicon Asset|Favicon Asset]]
- [[_COMMUNITY_Splash Icon Asset|Splash Icon Asset]]
- [[_COMMUNITY_Hono Server Config|Hono Server Config]]
- [[_COMMUNITY_Backend Workspace Config|Backend Workspace Config]]
- [[_COMMUNITY_Backend Deployment Docs|Backend Deployment Docs]]
- [[_COMMUNITY_Backend TS Config Root|Backend TS Config Root]]
- [[_COMMUNITY_Expo App Readme|Expo App Readme]]
- [[_COMMUNITY_Frontend Workspace Config|Frontend Workspace Config]]
- [[_COMMUNITY_Frontend Readme|Frontend Readme]]
- [[_COMMUNITY_Data Flow Clarifications|Data Flow Clarifications]]
- [[_COMMUNITY_Auth Router|Auth Router]]
- [[_COMMUNITY_Claude Settings Root|Claude Settings Root]]

## God Nodes (most connected - your core abstractions)
1. `columns` - 14 edges
2. `expo` - 14 edges
3. `JLPT App PRD (Product Requirements Document)` - 14 edges
4. `public.friend_codes` - 11 edges
5. `public.friendships` - 11 edges
6. `public.review_items` - 11 edges
7. `public.user_profiles` - 11 edges
8. `public.user_progress` - 11 edges
9. `public.accounts` - 11 edges
10. `created_at` - 11 edges

## Surprising Connections (you probably didn't know these)
- `User Type (id, name, email)` --semantically_similar_to--> `Auth Strategy (Better Auth, HttpOnly cookies, credentials:include)`  [INFERRED] [semantically similar]
  Frontend/store/session.store.ts → CLAUDE.md
- `JlptProfile Type (jlptLevel, currentDay)` --conceptually_related_to--> `JLPT N5 Curriculum (100 kanji, 400 vocab, 20 grammar, lessons)`  [INFERRED]
  Frontend/store/session.store.ts → CLAUDE.md
- `useSessionStore - Zustand Store Instance` --implements--> `Zustand Global State Pattern (session, profile, no Redux)`  [INFERRED]
  Frontend/store/session.store.ts → CLAUDE.md
- `App Color System (primary, accent, bg, surface, ink, muted)` --implements--> `App Theming (light/dark, OKLCH color tokens, WCAG AA)`  [INFERRED]
  Frontend/tailwind.config.js → PRODUCT.md
- `App Color System (primary, accent, bg, surface, ink, muted)` --rationale_for--> `Brand Personality (playful, energetic, social - not Duolingo-green)`  [INFERRED]
  Frontend/tailwind.config.js → PRODUCT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Database Schema Layer (all Drizzle schemas re-exported through index)** — db_index_schemas, schema_auth, schema_userprofiles, schema_userprogress, schema_reviewitems, schema_friendships, schema_friendcodes [EXTRACTED 1.00]
- **Migration History (journal tracks both SQL migrations)** — db_migration_journal, db_migration_0000, db_migration_0001 [EXTRACTED 1.00]
- **Auth Subsystem (Better Auth + middleware + schema)** — lib_auth_betterauth, middleware_auth_middleware, schema_auth, db_client_drizzle [INFERRED 0.90]
- **Auth-Protected Route Handlers** — routes_friends_friends_route, routes_lessons_lessons_route, routes_profile_profile_route, routes_progress_progress_route [EXTRACTED 1.00]
- **Zod Request Validation Schemas** — schemas_friends_add_friend_schema, schemas_profile_update_profile_schema, schemas_progress_complete_lesson_schema, schemas_progress_review_items_schema [EXTRACTED 1.00]
- **N5 JLPT Static Content Bundle** — static_lessons_n5_lessons, static_kanji_n5_kanji, static_vocab_n5_vocab, static_grammar_n5_grammar, static_hiragana_n5_hiragana, static_katakana_n5_katakana [EXTRACTED 0.95]
- **MVP Build Triad (Static Content + Lesson API + Expo Screens must all complete for MVP)** — knowledge_build_order_phase1_static_content, knowledge_build_order_phase2_lesson_api, knowledge_build_order_phase3_expo_screens [EXTRACTED 1.00]
- **Full Stack Data Pipeline (Neon -> Hono -> TanStack Query -> Expo UI)** — claude_md_neon_postgresql, claude_md_hono_backend, claude_md_tanstack_query, claude_md_expo_frontend_stack [EXTRACTED 1.00]
- **Persona-Driven Feature Design (Mina / Rio / Kenji inform all feature decisions)** — knowledge_clarifications_persona_mina, knowledge_clarifications_persona_rio, knowledge_clarifications_persona_kenji, knowledge_jlpt_app_prd_friends_leaderboards, knowledge_jlpt_app_prd_lesson_screen [INFERRED 0.85]
- **Authentication Flow: Login, SignUp, AuthGuard, authClient** — auth_login, auth_sign_up, app__layout_authguard, lib_auth_client [INFERRED 0.95]
- **Root Layout Providers: QueryClient, ThemeProvider, AuthGuard, SessionSync** — app__layout_rootlayout, app__layout_authguard, app__layout_sessionsync, store_session_store [EXTRACTED 1.00]
- **Backend Route Composition: authRouter, progressRoute, profileRoute, friendsRoute, lessonsRoute** — src_index, src_index_authrouter, src_index_progressroute, src_index_profileroute, src_index_friendsroute, src_index_lessonsroute [EXTRACTED 1.00]
- **Theme Resolution Pipeline: Colors → useThemeColor → ThemedText/ThemedView** — constants_theme, hooks_use_theme_color, components_themed_text, components_themed_view [INFERRED 0.95]
- **Platform-Adaptive Icon: SF Symbols (iOS) vs Material Icons (Android/Web)** — ui_icon_symbol_ios, ui_icon_symbol, concept_platform_adaptive_icon [INFERRED 0.95]
- **Color Scheme Hooks: native re-export + web hydration-safe variant** — hooks_use_color_scheme, hooks_use_color_scheme_web, concept_web_hydration_colorscheme [INFERRED 0.90]
- **Session Store Zustand Pattern (User + JlptProfile + SessionState + useSessionStore)** — store_user_type, store_jlptprofile_type, store_sessionstate_type, store_usesessionstore [EXTRACTED 1.00]
- **Frontend Configuration Trio (TypeScript + Tailwind + NativeWind)** — frontend_tsconfig, frontend_tailwind_config, frontend_color_system [INFERRED 0.85]
- **Project Documentation Triad (CLAUDE.md + PRODUCT.md + README.md)** — root_claude_md, root_product_md, root_readme [EXTRACTED 1.00]

## Communities (91 total, 19 thin omitted)

### Community 0 - "App Screen Layout"
Cohesion: 0.06
Nodes (30): RootLayout(), styles, Auth Layout (Stack Navigator), HapticTab(), ParallaxScrollView(), Props, styles, styles (+22 more)

### Community 1 - "Backend Core & DB Client"
Cohesion: 0.07
Nodes (31): Hono RPC Type Sharing Pattern, client, db, api, auth, AuthType, Variables, authMiddleware (+23 more)

### Community 2 - "Migration v2 Access Token Fields"
Cohesion: 0.04
Nodes (46): name, notNull, primaryKey, type, name, notNull, primaryKey, type (+38 more)

### Community 3 - "Migration v1 Review Items Fields"
Cohesion: 0.05
Nodes (44): content_id, easy_factor, interval, last_reviewed_at, next_review_date, repetitions, name, notNull (+36 more)

### Community 4 - "Build Planning Docs"
Cohesion: 0.06
Nodes (42): JLPT App Build Order & Timeline, DeepSeek Integration, Phase 0: Setup (Neon DB + Backend Deploy), Phase 1: Static Content Curation, Phase 2: Lesson Delivery API, Phase 3: Expo App Screens, Phase 4: Testing & Deployment, Phase 5: Post-MVP (N4 + DeepSeek) (+34 more)

### Community 5 - "Migration v2 User Profile Fields"
Cohesion: 0.05
Nodes (42): current_day, current_streak, jlpt_level, last_studied_at, longest_streak, total_kanji_learned, total_vocab_learned, default (+34 more)

### Community 6 - "Migration v2 Schema Meta"
Cohesion: 0.05
Nodes (39): dialect, columns, name, nullsNotDistinct, id, prevId, checkConstraints, compositePrimaryKeys (+31 more)

### Community 7 - "Frontend Dependencies"
Cohesion: 0.06
Nodes (36): dependencies, better-auth, expo, expo-constants, expo-font, expo-haptics, expo-image, expo-linking (+28 more)

### Community 8 - "Migration v1 Added At Fields"
Cohesion: 0.06
Nodes (36): default, name, notNull, primaryKey, type, added_at, status, user_id_1 (+28 more)

### Community 9 - "Migration v2 Added At Fields"
Cohesion: 0.06
Nodes (36): default, name, notNull, primaryKey, type, added_at, status, user_id_1 (+28 more)

### Community 10 - "Migration v2 Auth User Fields"
Cohesion: 0.06
Nodes (36): email, email_verified, image, name, name, notNull, primaryKey, type (+28 more)

### Community 11 - "Migration v2 User Progress Fields"
Cohesion: 0.06
Nodes (35): completed, completed_at, day, items_mastered_count, time_spent_minutes, name, notNull, primaryKey (+27 more)

### Community 12 - "Migration v2 Review Items Fields"
Cohesion: 0.06
Nodes (34): content_id, easy_factor, interval, last_reviewed_at, next_review_date, repetitions, name, notNull (+26 more)

### Community 13 - "Migration v1 User Progress Fields"
Cohesion: 0.06
Nodes (32): completed, completed_at, day, id, items_mastered_count, time_spent_minutes, name, notNull (+24 more)

### Community 14 - "Project Concepts & Docs"
Cohesion: 0.08
Nodes (27): REST API Endpoint Contract (auth, profile, lessons, progress, friends), Auth Strategy (Better Auth, HttpOnly cookies, credentials:include), Brand Personality (playful, energetic, social - not Duolingo-green), Build Status (Backend done, Frontend scaffolded, Vercel pending), Coding Rules (TypeScript, no any, TanStack Query, Zustand, no Redux), Data Flow Architecture (Expo UI → TanStack Query → Hono → Neon), JLPT N5 Curriculum (100 kanji, 400 vocab, 20 grammar, lessons), Navigation Structure (expo-router file-based, auth + tabs) (+19 more)

### Community 15 - "Migration v2 Sessions Foreign Keys"
Cohesion: 0.07
Nodes (29): sessions_user_id_users_id_fk, sessions_userId_idx, checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name (+21 more)

### Community 16 - "App JSON Config"
Cohesion: 0.07
Nodes (26): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, reactCompiler (+18 more)

### Community 17 - "Migration v2 Accounts Foreign Keys"
Cohesion: 0.08
Nodes (25): columnsFrom, columnsTo, name, onDelete, onUpdate, tableFrom, tableTo, columns (+17 more)

### Community 18 - "Backend Package Config"
Cohesion: 0.08
Nodes (23): dependencies, better-auth, dotenv, drizzle-orm, hono, @hono/node-server, @hono/zod-validator, pg (+15 more)

### Community 19 - "Root Layout & Auth Guard"
Cohesion: 0.13
Nodes (14): AuthGuard Component, RootLayout Component, SessionSync Component, queryClient, SessionSync(), unstable_settings, Auth Guard / Session-Based Route Guard Pattern, authClient (+6 more)

### Community 20 - "Friends & Social Routes"
Cohesion: 0.15
Nodes (17): Friend Code System (6-char random code), Streak Tracking (currentStreak, longestStreak), DELETE /friends/:friendId — Remove Friend, Friends Route Handler, GET /friends/code — Get or Create Friend Code, GET /friends/leaderboard — Streak Leaderboard, GET /friends/list-friends — List Friends, POST /friends/add-friend — Add Friend by Code (+9 more)

### Community 21 - "Migration v2 Verifications"
Cohesion: 0.12
Nodes (17): verifications_identifier_idx, checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name, policies (+9 more)

### Community 22 - "Database Layer"
Cohesion: 0.32
Nodes (12): Drizzle DB Client, DB Schema Index (re-exports all schemas), Migration 0000: Initial Tables (friend_codes, friendships, review_items, user_profiles, user_progress), Migration 0001: Auth Tables (accounts, sessions, users, verifications), Drizzle Migration Journal, Better Auth Instance (email+password, drizzle adapter, 30-day sessions), Auth Schema (users, sessions, accounts, verifications), FriendCodes Schema (+4 more)

### Community 23 - "Backend TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, jsx, jsxImportSource, module, moduleResolution, outDir, resolveJsonModule, skipLibCheck (+4 more)

### Community 24 - "Migration v1 Schema Meta"
Cohesion: 0.18
Nodes (10): dialect, enums, id, policies, prevId, roles, schemas, sequences (+2 more)

### Community 25 - "Migration v2 Friend Code Fields"
Cohesion: 0.18
Nodes (11): name, notNull, primaryKey, type, code, user_id, columns, name (+3 more)

### Community 26 - "Migration v1 Friend Codes Table"
Cohesion: 0.20
Nodes (10): checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name, policies, schema (+2 more)

### Community 27 - "Migration v1 User Profiles Table"
Cohesion: 0.20
Nodes (10): checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name, policies, schema (+2 more)

### Community 28 - "Migration v1 User Progress Table"
Cohesion: 0.20
Nodes (10): checkConstraints, compositePrimaryKeys, foreignKeys, indexes, isRLSEnabled, name, policies, schema (+2 more)

### Community 29 - "Lesson Routes & Static Content"
Cohesion: 0.28
Nodes (9): GET /lessons/:day — Lesson by Day, GET /lessons/today — Today's Lesson, Lessons Route Handler, N5 Grammar Patterns (20 patterns JSON), N5 Hiragana Characters (46 chars JSON), N5 Kanji Data (100 kanji JSON), N5 Katakana Characters (46 chars JSON), N5 Lessons Data (100-day plan JSON) (+1 more)

### Community 30 - "Project Reset Script"
Cohesion: 0.22
Nodes (7): exampleDirPath, fs, oldDirs, path, readline, rl, root

### Community 31 - "Auth Schema (Drizzle)"
Cohesion: 0.25
Nodes (7): accounts, accountsRelations, sessions, sessionsRelations, users, usersRelations, verifications

### Community 32 - "Frontend Build Scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 33 - "Frontend Dev Dependencies"
Cohesion: 0.33
Nodes (6): devDependencies, eslint, eslint-config-expo, @types/node, @types/react, typescript

### Community 34 - "Migration v1 Friend Code Fields"
Cohesion: 0.33
Nodes (6): name, notNull, primaryKey, type, code, columns

### Community 35 - "Migration v1 Created At Fields"
Cohesion: 0.33
Nodes (6): created_at, default, name, notNull, primaryKey, type

### Community 36 - "Migration v1 Current Day Fields"
Cohesion: 0.33
Nodes (6): current_day, default, name, notNull, primaryKey, type

### Community 37 - "Migration v1 Current Streak Fields"
Cohesion: 0.33
Nodes (6): current_streak, default, name, notNull, primaryKey, type

### Community 38 - "Migration v1 JLPT Level Fields"
Cohesion: 0.33
Nodes (6): jlpt_level, default, name, notNull, primaryKey, type

### Community 39 - "Migration v1 Last Studied Fields"
Cohesion: 0.33
Nodes (6): last_studied_at, name, notNull, primaryKey, type, columns

### Community 40 - "Migration v1 Longest Streak Fields"
Cohesion: 0.33
Nodes (6): longest_streak, default, name, notNull, primaryKey, type

### Community 41 - "Migration v1 Total Kanji Fields"
Cohesion: 0.33
Nodes (6): total_kanji_learned, default, name, notNull, primaryKey, type

### Community 42 - "Migration v1 Total Vocab Fields"
Cohesion: 0.33
Nodes (6): total_vocab_learned, default, name, notNull, primaryKey, type

### Community 43 - "Migration v2 Created At Fields"
Cohesion: 0.33
Nodes (6): created_at, default, name, notNull, primaryKey, type

### Community 44 - "Migration v2 Identifier Fields"
Cohesion: 0.33
Nodes (6): identifier, name, notNull, primaryKey, type, columns

### Community 45 - "Migration v2 IP Address Fields"
Cohesion: 0.33
Nodes (6): ip_address, name, notNull, primaryKey, type, columns

### Community 46 - "Migration v2 Updated At Fields"
Cohesion: 0.33
Nodes (6): updated_at, default, name, notNull, primaryKey, type

### Community 47 - "Claude Settings & Hooks"
Cohesion: 0.40
Nodes (4): enabledPlugins, expo@claude-plugins-official, hooks, PreToolUse

### Community 48 - "JLPT Profile Routes"
Cohesion: 0.60
Nodes (5): JLPT Level (N5-N1 enum), GET /profile — Fetch User Profile, PATCH /profile — Update JLPT Level, Profile Route Handler, updateProfileSchema (Zod — jlptLevel enum)

### Community 49 - "Metro & NativeWind Config"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, { withNativeWind }, Frontend package.json

### Community 50 - "Frontend Package Meta"
Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 51 - "Migration v1 User ID Fields"
Cohesion: 0.40
Nodes (5): user_id, name, notNull, primaryKey, type

### Community 52 - "Migration v1 Unique Constraints"
Cohesion: 0.40
Nodes (5): columns, name, nullsNotDistinct, uniqueConstraints, friend_codes_user_id_unique

### Community 53 - "Migration v2 Expires At Fields"
Cohesion: 0.40
Nodes (5): expires_at, name, notNull, primaryKey, type

### Community 54 - "Migration v2 ID Fields"
Cohesion: 0.40
Nodes (5): id, name, notNull, primaryKey, type

### Community 55 - "Migration v2 Token Fields"
Cohesion: 0.40
Nodes (5): token, name, notNull, primaryKey, type

### Community 56 - "Migration v2 User Agent Fields"
Cohesion: 0.40
Nodes (5): user_agent, name, notNull, primaryKey, type

### Community 57 - "Migration v2 Value Fields"
Cohesion: 0.40
Nodes (5): value, name, notNull, primaryKey, type

### Community 58 - "VSCode Settings"
Cohesion: 0.40
Nodes (4): editor.codeActionsOnSave, source.fixAll, source.organizeImports, source.sortMembers

### Community 59 - "Android App Icons"
Cohesion: 0.50
Nodes (4): Android Icon Background, Android Icon Foreground, Android Icon Monochrome, App Icon (icon.png)

### Community 60 - "Project Completion Docs"
Cohesion: 0.50
Nodes (4): Backend Implementation Status (Complete), Final Delivery Summary, Complete Project Checklist, Technology Decisions Made

### Community 61 - "Migration v1 Schema Tables"
Cohesion: 0.50
Nodes (4): _meta, columns, schemas, tables

### Community 62 - "Migration Journal"
Cohesion: 0.50
Nodes (3): dialect, entries, version

## Knowledge Gaps
- **701 isolated node(s):** `expo@claude-plugins-official`, `PreToolUse`, `name`, `type`, `dev` (+696 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tables` connect `Migration v2 Schema Meta` to `Migration v2 Added At Fields`, `Migration v2 Auth User Fields`, `Migration v2 User Progress Fields`, `Migration v2 Sessions Foreign Keys`, `Migration v2 Accounts Foreign Keys`, `Migration v2 Verifications`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `columns` connect `Migration v2 Access Token Fields` to `Migration v2 Created At Fields`, `Migration v2 Updated At Fields`, `Migration v2 Accounts Foreign Keys`, `Migration v2 ID Fields`, `Migration v2 Friend Code Fields`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `columns` connect `Migration v2 Review Items Fields` to `Migration v2 Friend Code Fields`, `Migration v2 ID Fields`, `Migration v2 Schema Meta`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `PreToolUse`, `name` to the rest of the system?**
  _708 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Screen Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Backend Core & DB Client` be split into smaller, more focused modules?**
  _Cohesion score 0.07390648567119155 - nodes in this community are weakly interconnected._
- **Should `Migration v2 Access Token Fields` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._