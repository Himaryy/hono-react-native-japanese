# JLPT App - Knowledge/Rules Directory Structure

**Location**: `rules/knowledge/` (in your project root)

**Purpose**: All documentation files that guide development and AI context

---

## 📚 FILES TO COPY TO `rules/knowledge/`

### 1. **CLAUDE_CONTEXT.md** (MOST IMPORTANT FOR AI)
**Size**: ~15 KB  
**Purpose**: Your AI context file - ALWAYS paste this before asking Claude coding questions

**What it contains**:
- Project overview and tech stack
- Architecture decisions (backend is source of truth)
- Coding standards (TypeScript, React Native, Zustand)
- API endpoints reference
- Screen requirements from PRD
- Workflow for code review (how to interact with AI)
- Important DO's and DON'Ts

**How to use**:
```
1. Open CLAUDE_CONTEXT.md
2. Copy entire content
3. Paste in Claude's context window
4. Ask your coding question
5. Claude will understand your project
```

---

### 2. **BUILD_ORDER.md** (YOUR ROADMAP)
**Size**: ~22 KB  
**Purpose**: Numbered steps of exactly what to build in order (1, 2, 3...)

**What it contains**:
- Phase 0: Setup (0.1, 0.2) — 45 min
- Phase 1: Static content (1.1–1.6) — 125 hours
- Phase 2: Backend API (2.1) — 8 hours
- Phase 3: Expo screens (3.1–3.8) — 100 hours
- Phase 4: Testing & deploy (4.1–4.5) — 20 hours
- Phase 5: Post-MVP (5.1–5.2) — 95 hours
- Detailed effort breakdown per task
- Timeline per week
- Summary table

**How to use**:
```
1. Read which phase you're in
2. Follow numbered steps in order
3. Don't skip ahead
4. Check off as you complete each
```

**Example**: Currently at Phase 3.1? Read BUILD_ORDER.md Section 3.1 for exact requirements.

---

### 3. **JLPT_App_PRD.md** (PRODUCT SPECIFICATION)
**Size**: ~28 KB  
**Purpose**: Complete product specification with all features, workflows, content structure

**What it contains**:
- User personas (Mina, Rio, Kenji)
- Feature breakdown (MVP + post-launch)
- User workflows (day-in-the-life)
- Content structure (100-day N5 curriculum)
- Success metrics
- Rollout plan
- Risk mitigation
- Appendix with glossary

**How to use**:
```
1. When building a screen, read the PRD section for it
2. Example: Building lesson screen? Read Section 3.3
3. Understand what features are needed
4. Pass relevant section to Claude for code generation
```

---

### 4. **JLPT_Backend_BetterAuth.md** (BACKEND ARCHITECTURE)
**Size**: ~23 KB  
**Purpose**: Backend setup, API endpoints, Better Auth integration, database schema

**What it contains**:
- Better Auth setup (already done)
- Drizzle schema (8 tables)
- API endpoints (all 14 of them)
- Frontend integration examples
- Deployment instructions
- DeepSeek integration guide

**How to use**:
```
1. Reference when building API calls from Expo
2. When calling backend, check endpoints here
3. Check response formats
4. See example code for API calls
```

---

### 5. **CLARIFICATIONS.md** (CONFUSIONS CLEARED)
**Size**: ~17 KB  
**Purpose**: Answers to common questions (personas, SQLite, PRD updates)

**What it contains**:
- Persona explanations (who Mina, Rio, Kenji are)
- SQLite clarification (optional, Phase 2)
- Database architecture (Neon = truth, Expo = UI)
- Data flow diagrams
- When NOT to use SQLite
- Updated architecture section

**How to use**:
```
1. Read if confused about architecture
2. Reference when deciding on features
3. Use to understand personas better
```

---

### 6. **QUICK_REFERENCE.md** (TL;DR)
**Size**: ~11 KB  
**Purpose**: Quick reference guide (effort, cost, timeline, what's done vs TODO)

**What it contains**:
- What's done vs what's TODO
- Effort breakdown (60–80 hours for content, 100–150 for Expo)
- Cost breakdown ($0 infrastructure)
- Timeline (6 weeks to MVP)
- Database quick reference
- Support resources

**How to use**:
```
1. Quick lookup when you need stats
2. Reference effort estimates
3. Check cost breakdown
4. Find support resources
```

---

### 7. **JLPT_COMPLETE_CHECKLIST.md** (TRACKING)
**Size**: ~15 KB  
**Purpose**: Complete status checklist and feature breakdown

**What it contains**:
- Feature breakdown (MVP vs Phase 2)
- Implementation status (what's done, what's TODO)
- Launch roadmap (week by week)
- Testing checklist
- Risks & solutions
- Phase-by-phase plan

**How to use**:
```
1. Track what's complete
2. Know what's left to do
3. Follow launch timeline
4. Check testing requirements
```

---

### 8. **FINAL_SUMMARY.md** (PROJECT STATUS)
**Size**: ~15 KB  
**Purpose**: Executive summary (what you have, what you're building, timeline, cost)

**What it contains**:
- What you received (docs, code)
- What's fully implemented (backend ready)
- What you need to build (Expo app)
- Effort breakdown
- Cost analysis
- Success criteria
- Quick start (5 steps)

**How to use**:
```
1. Read when you want project overview
2. Share with collaborators
3. Check success criteria
4. Reference timeline
```

---

### 9. **JLPT_Backend_Setup.md** (REFERENCE)
**Size**: ~7.7 KB  
**Purpose**: Additional backend reference (setup guide, polling strategy)

**How to use**:
```
1. Reference only (backend is done)
2. Understand architecture
3. See polling every 30s explanation
```

---

## 📋 HOW TO ORGANIZE YOUR `rules/knowledge/` FOLDER

```
~/projects/jlpt-app-frontend/
└── rules/
    └── knowledge/
        ├── CLAUDE_CONTEXT.md           (READ FIRST FOR AI)
        ├── BUILD_ORDER.md              (YOUR ROADMAP)
        ├── JLPT_App_PRD.md             (PRODUCT SPEC)
        ├── JLPT_Backend_BetterAuth.md  (API REFERENCE)
        ├── CLARIFICATIONS.md           (ARCHITECTURE CLARIFIED)
        ├── QUICK_REFERENCE.md          (TL;DR)
        ├── JLPT_COMPLETE_CHECKLIST.md  (TRACKING)
        ├── FINAL_SUMMARY.md            (PROJECT STATUS)
        ├── JLPT_Backend_Setup.md       (REFERENCE)
        └── README.md                   (This file)
```

---

## 🔄 WORKFLOW: How to Use These Files

### When Starting a New Feature:

1. **Check BUILD_ORDER.md**
   - Find your current step (e.g., 3.2 Auth Screens)
   - Read what's needed
   - See effort estimate

2. **Read PRD section**
   - Go to JLPT_App_PRD.md
   - Find the relevant section (e.g., Section 3.1 for Auth)
   - Understand the feature requirements

3. **Prepare to ask Claude**
   - Open CLAUDE_CONTEXT.md
   - Copy entire content
   - Paste into Claude's context window
   - Ask your coding question referencing the PRD section

4. **Review Claude's code**
   - Read the code Claude provides
   - Check against requirements
   - Ask for changes if needed
   - Copy-paste when approved

5. **Track completion**
   - Check off in BUILD_ORDER.md
   - Move to next numbered step

---

## ✅ QUICK CHECKLIST

Before starting to code:

- [ ] All 9 files are in `rules/knowledge/`
- [ ] You've read BUILD_ORDER.md (know what to build)
- [ ] You've read CLAUDE_CONTEXT.md (understand how to ask AI)
- [ ] Backend is deployed (you have API URL)
- [ ] Neon database is set up
- [ ] You understand the 6 screens to build
- [ ] You know Mina, Rio, Kenji personas

---

## 🎯 THE GOLDEN RULE

**When asking Claude for help:**

```
1. Copy CLAUDE_CONTEXT.md content
2. Paste it into Claude first
3. THEN ask your coding question
4. Claude will have full project context
5. Code will be tailored to your stack
6. You review and copy-paste when ready
```

**Without this context:**
- Claude might suggest Redux (wrong, use Zustand)
- Claude might suggest AsyncStorage (wrong, use TanStack Query)
- Claude might rebuild auth (wrong, use Better Auth)

**With this context:**
- Claude knows your stack perfectly
- Suggestions match your architecture
- Code is copy-paste ready

---

## 📞 FILE REFERENCE QUICK LOOKUP

**"How do I build X?"**
→ See BUILD_ORDER.md (numbered steps)

**"What features does X need?"**
→ See JLPT_App_PRD.md (detailed spec)

**"How do I call the API?"**
→ See JLPT_Backend_BetterAuth.md (endpoints)

**"I'm confused about architecture"**
→ See CLARIFICATIONS.md

**"What's the timeline?"**
→ See QUICK_REFERENCE.md or FINAL_SUMMARY.md

**"How do I ask Claude for code?"**
→ See CLAUDE_CONTEXT.md (communication protocol)

**"What's complete vs TODO?"**
→ See JLPT_COMPLETE_CHECKLIST.md

**"Quick project overview?"**
→ See FINAL_SUMMARY.md

---

## 💾 DOWNLOADS

All files are available in `/mnt/user-data/outputs/`:
- CLAUDE_CONTEXT.md
- BUILD_ORDER.md
- JLPT_App_PRD.md
- JLPT_Backend_BetterAuth.md
- CLARIFICATIONS.md
- QUICK_REFERENCE.md
- JLPT_COMPLETE_CHECKLIST.md
- FINAL_SUMMARY.md
- JLPT_Backend_Setup.md

---

## 🚀 NEXT STEPS

1. **Copy all 9 .md files** to your `rules/knowledge/` folder
2. **Read BUILD_ORDER.md** to understand what to build
3. **Read JLPT_App_PRD.md** to understand your product
4. **Use CLAUDE_CONTEXT.md** for all AI code generation
5. **Start building** following BUILD_ORDER.md steps

---

**Status**: Ready to build! 🎉

**Last updated**: June 15, 2026  
**Files**: 9 markdown documents  
**Total size**: ~157 KB  
**For**: JLPT Learning App (React Native + Expo)

---

## 📖 SUGGESTED READING ORDER

1. **First**: FINAL_SUMMARY.md (project overview)
2. **Second**: BUILD_ORDER.md (what you're building)
3. **Third**: CLAUDE_CONTEXT.md (how to work with AI)
4. **Then**: JLPT_App_PRD.md (detailed spec)
5. **As needed**: Other files for specific lookups

---

**All files ready. Let's build! 🚀**
