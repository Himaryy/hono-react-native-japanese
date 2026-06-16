# PROJECT SETUP GUIDE - rules/knowledge Folder

**For**: JLPT App Frontend Development  
**Your Workflow**: AI gives code → You analyze → You copy-paste if good → Ask for changes if needed  
**Storage**: All files go in `rules/knowledge/` folder

---

## 📁 FOLDER STRUCTURE

```
~/projects/jlpt-app-frontend/
├── src/                           (Your code - you'll create)
│   ├── screens/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── store/
│   └── types/
├── static-content/               (Your content - you'll create)
│   ├── kanji/
│   ├── vocab/
│   ├── grammar/
│   ├── audio/
│   └── lessons/
├── rules/
│   └── knowledge/               (📚 YOUR DOCUMENTATION - ALL FILES GO HERE)
│       ├── 00_START_HERE.txt
│       ├── CLAUDE_CONTEXT.md         ⭐ MOST IMPORTANT (use for every AI question)
│       ├── BUILD_ORDER.md             ⭐ YOUR ROADMAP (numbered steps 0.1-5.2)
│       ├── JLPT_App_PRD.md
│       ├── CODE_REVIEW_WORKFLOW.md    ⭐ HOW TO REVIEW CODE (analyze before copy)
│       ├── JLPT_Backend_BetterAuth.md
│       ├── CLARIFICATIONS.md
│       ├── JLPT_COMPLETE_CHECKLIST.md
│       ├── QUICK_REFERENCE.md
│       ├── FINAL_SUMMARY.md
│       ├── KNOWLEDGE_README.md
│       └── JLPT_Backend_Setup.md
├── App.tsx                       (Your Expo entry point)
├── package.json
└── tsconfig.json
```

---

## 📋 FILES DESCRIPTION (13 Total)

### 🌟 MUST READ & USE

#### 1. **00_START_HERE.txt** (Plain text guide)
- What to do first
- Which files to read in what order
- Quick start 5 steps
- Checklist before starting

**When to use**: First thing - read this file!

---

#### 2. **CLAUDE_CONTEXT.md** ⭐⭐⭐ MOST IMPORTANT
**Size**: 15 KB  
**When to use**: EVERY TIME you ask Claude for code

**How to use**:
```
1. Open CLAUDE_CONTEXT.md
2. Copy entire content
3. Paste into Claude before your question
4. THEN ask your coding question
5. Claude has full context of your project
```

**Contains**:
- Tech stack (React Native, Expo, TanStack Query, Zustand)
- Coding standards (TypeScript, no `any`, functional components)
- API endpoints (all 14 endpoints)
- File naming conventions
- DO's and DON'Ts
- Folder structure

**Example usage**:
```
[Paste CLAUDE_CONTEXT.md content here]

Now I'm building the Auth screens for JLPT app.
From BUILD_ORDER.md step 3.2, requirements are:
- Email input
- Password input
- Username input (signup only)
- Sign up / Sign in buttons

Can you generate AuthScreen.tsx component?
```

---

#### 3. **BUILD_ORDER.md** ⭐⭐⭐ YOUR ROADMAP
**Size**: 22 KB  
**When to use**: Every time you start a new feature

**How to use**:
```
1. Find your current phase (0, 1, 2, 3, 4, or 5)
2. Read the numbered step (0.1, 0.2, 1.1, 1.2, etc.)
3. Follow effort estimate
4. Check off when complete
5. Move to next step
```

**Contains**:
- Phase 0: Setup (45 min)
- Phase 1: Static content (125 hours) - kanji, vocab, grammar, audio
- Phase 2: Backend API (8 hours) - lesson delivery
- Phase 3: Expo screens (100 hours) - 6 screens to build
- Phase 4: Testing & Deploy (20 hours)
- Phase 5: Post-MVP (95 hours)
- Summary table with effort, timeline, status

**Example**:
```
Currently at Phase 3.2 (Auth Screens)?
Open BUILD_ORDER.md, scroll to:

### 3.2: Build Authentication Screens 🔴 HIGH PRIORITY
Effort: 15 hours
Output: Functional auth flow

Screens:
1. Splash/Auth Screen (initial)
2. Sign Up Screen
3. Sign In Screen

Connected to backend:
[code examples]
```

---

#### 4. **CODE_REVIEW_WORKFLOW.md** ⭐⭐⭐ HOW TO REVIEW
**Size**: 17 KB  
**When to use**: After Claude gives you code, before you copy-paste

**How to use**:
```
1. Claude provides code
2. You open CODE_REVIEW_WORKFLOW.md
3. You go through the checklist
4. You decide: ✅ Good? Copy-paste / ⚠️ Needs changes? Ask Claude / ❌ Bad? Start over
5. You respond to Claude with feedback
```

**Contains**:
- 4-step workflow (Ask → Review → Decide)
- Comprehensive checklist
- Common issues to look for
- Examples of bad code vs good code
- How to give feedback to Claude

**Checklist items**:
- ✅ TypeScript (no `any` types)
- ✅ TanStack Query (for API calls)
- ✅ Zustand (for global state)
- ✅ Functional components (no class components)
- ✅ Credentials included (for auth)
- ✅ Env vars used (not hardcoded URLs)
- ✅ Error handling
- ✅ Matches requirements

---

### 📖 PRODUCT & ARCHITECTURE

#### 5. **JLPT_App_PRD.md** (Product Spec)
**Size**: 28 KB  
**When to use**: When building a feature, to understand requirements

**Contains**:
- 13 sections covering everything
- User personas (Mina, Rio, Kenji)
- Feature breakdown
- Screen workflows
- 100-day N5 curriculum
- Success metrics

**How to use**:
```
Building lesson screen?
→ Go to PRD Section 3.3
→ Read what lesson screen should do
→ Pass that section to Claude
```

---

#### 6. **JLPT_Backend_BetterAuth.md** (API Reference)
**Size**: 23 KB  
**When to use**: When making API calls from Expo app

**Contains**:
- All 14 API endpoints
- Request/response formats
- Better Auth integration
- Database schema
- Example code

**How to use**:
```
Need to call /api/progress/stats?
→ Open JLPT_Backend_BetterAuth.md
→ Search for endpoint
→ See response format
→ Use in your API call
```

---

#### 7. **CLARIFICATIONS.md** (Architecture Explained)
**Size**: 17 KB  
**When to use**: When confused about architecture, personas, or database

**Contains**:
- Persona explanations (who is Mina, Rio, Kenji)
- SQLite decision (optional, Phase 2)
- Database architecture (Neon = truth, Expo = UI)
- Data flow diagrams
- Architecture updated

**How to use**:
```
Confused about SQLite?
→ Open CLARIFICATIONS.md
→ Read "SQLite Explanation"
→ Understand it's optional, not needed for MVP
```

---

### 📊 REFERENCE & TRACKING

#### 8. **JLPT_COMPLETE_CHECKLIST.md** (What's Done/TODO)
**Size**: 15 KB  
**When to use**: To track progress, know what's complete

**Contains**:
- Feature breakdown (MVP vs Phase 2)
- Implementation status
- Launch roadmap (week by week)
- Testing checklist
- Risks & solutions

---

#### 9. **QUICK_REFERENCE.md** (TL;DR)
**Size**: 11 KB  
**When to use**: For quick stats, effort estimates, timeline

**Contains**:
- Effort breakdown (hours per task)
- Cost analysis ($0 infrastructure)
- Timeline summary
- Database quick reference
- Support resources

---

#### 10. **FINAL_SUMMARY.md** (Project Status)
**Size**: 15 KB  
**When to use**: For project overview, to share with others

**Contains**:
- What you received
- What's implemented
- What you're building
- Success criteria
- Quick start

---

### 🔧 SETUP & REFERENCE

#### 11. **KNOWLEDGE_README.md** (Navigation Guide)
**Size**: 9.2 KB  
**When to use**: To navigate between files, know which file to use

**Contains**:
- Description of all 10 files
- How to organize folder
- Quick lookup table

---

#### 12. **JLPT_Backend_Setup.md** (Reference)
**Size**: 7.7 KB  
**When to use**: Reference only (backend is already done)

**Contains**:
- Backend architecture
- Setup instructions
- Polling strategy

---

#### 13. **FILE_INDEX.txt** (Plain text index)
**Size**: 12 KB  
**When to use**: Plain text reference

---

## 🚀 HOW TO SET UP YOUR PROJECT

### Step 1: Create Folder Structure
```bash
cd ~/projects
mkdir -p jlpt-app-frontend/rules/knowledge
cd jlpt-app-frontend
```

### Step 2: Copy All Files
Download all 13 files from `/mnt/user-data/outputs/` and put them in:
```
rules/knowledge/
├── 00_START_HERE.txt
├── CLAUDE_CONTEXT.md
├── BUILD_ORDER.md
├── CODE_REVIEW_WORKFLOW.md
├── JLPT_App_PRD.md
├── JLPT_Backend_BetterAuth.md
├── CLARIFICATIONS.md
├── JLPT_COMPLETE_CHECKLIST.md
├── QUICK_REFERENCE.md
├── FINAL_SUMMARY.md
├── KNOWLEDGE_README.md
├── JLPT_Backend_Setup.md
└── FILE_INDEX.txt
```

### Step 3: Initialize Expo
```bash
npx create-expo-app .
npm install @react-navigation/native @tanstack/react-query zustand
```

### Step 4: Create Src Structure
```bash
mkdir -p src/{screens,components,services,hooks,store,types}
mkdir -p static-content/{kanji,vocab,grammar,audio,lessons}
```

### Step 5: Read Documentation
1. Open `rules/knowledge/00_START_HERE.txt`
2. Read in order: FINAL_SUMMARY → BUILD_ORDER → CLAUDE_CONTEXT
3. Ready to code!

---

## 💻 YOUR CODING WORKFLOW

### For Each Feature:

```
1. PLAN
   └─ Open BUILD_ORDER.md
   └─ Find your current numbered step
   └─ Read requirements

2. UNDERSTAND REQUIREMENTS
   └─ Open JLPT_App_PRD.md
   └─ Go to relevant section
   └─ Understand what feature should do

3. ASK CLAUDE
   └─ Open CLAUDE_CONTEXT.md
   └─ Copy entire content
   └─ Paste into Claude's context window
   └─ Ask for code for your specific component

4. REVIEW CODE
   └─ Open CODE_REVIEW_WORKFLOW.md
   └─ Go through checklist
   └─ Review Claude's code

5. DECIDE
   └─ Code is good? → Copy-paste
   └─ Code needs changes? → Ask Claude for specific fixes
   └─ Code is bad? → Ask again with clearer requirements

6. IMPLEMENT
   └─ Paste code into your project
   └─ Check it compiles
   └─ Test it works

7. TRACK
   └─ Open BUILD_ORDER.md
   └─ Check off current step
   └─ Move to next step
```

---

## 🎯 QUICK REFERENCE - WHICH FILE FOR WHAT

| Question | File to Open |
|----------|--------------|
| "What do I build first?" | BUILD_ORDER.md |
| "How do I ask Claude for code?" | CLAUDE_CONTEXT.md |
| "How do I review code before copying?" | CODE_REVIEW_WORKFLOW.md |
| "What should this screen do?" | JLPT_App_PRD.md |
| "What does this API endpoint return?" | JLPT_Backend_BetterAuth.md |
| "Why SQLite optional?" | CLARIFICATIONS.md |
| "How long will this take?" | QUICK_REFERENCE.md or BUILD_ORDER.md |
| "What's done vs TODO?" | JLPT_COMPLETE_CHECKLIST.md |
| "Project overview?" | FINAL_SUMMARY.md |
| "Need quick stats?" | QUICK_REFERENCE.md |

---

## ✅ CHECKLIST BEFORE YOU START CODING

- [ ] Created `rules/knowledge/` folder
- [ ] Copied all 13 files
- [ ] Read 00_START_HERE.txt
- [ ] Read FINAL_SUMMARY.md
- [ ] Read BUILD_ORDER.md
- [ ] Read CLAUDE_CONTEXT.md
- [ ] Read CODE_REVIEW_WORKFLOW.md
- [ ] Created Expo project (`npx create-expo-app`)
- [ ] Created src/ folder structure
- [ ] Created static-content/ folder structure
- [ ] Ready to start with step 0.1 (Setup) or step 1.1 (Content)

---

## 🔄 DAILY WORKFLOW EXAMPLE

```
9:00 AM - Start coding
├─ Open BUILD_ORDER.md
├─ Current step: 3.2 (Auth Screens)
└─ Read requirements

9:15 AM - Get Claude to generate code
├─ Open CLAUDE_CONTEXT.md
├─ Copy entire content
├─ Paste into Claude
├─ Ask for AuthScreen.tsx component
└─ Claude provides code

9:45 AM - Review Claude's code
├─ Open CODE_REVIEW_WORKFLOW.md
├─ Go through checklist (TypeScript, TanStack Query, etc.)
├─ Code is good!
└─ Copy-paste to your project

10:15 AM - Implement
├─ Check code compiles
├─ Test in Expo
├─ Works!

10:30 AM - Move to next step
├─ Update BUILD_ORDER.md (check off 3.2)
├─ Start step 3.3
└─ Repeat

5:00 PM - End of day
└─ Done with multiple features!
```

---

## 📞 HELP & SUPPORT

**Stuck on something?**
1. Check the relevant .md file first
2. Most answers are in one of these 13 files
3. If not found, ask Claude (with CLAUDE_CONTEXT.md pasted first)

**Code not working?**
1. Open CODE_REVIEW_WORKFLOW.md
2. Check "Common Issues" section
3. Fix the issue
4. Or ask Claude for help

**Confused about requirements?**
1. Open JLPT_App_PRD.md
2. Find relevant section
3. Read description
4. Understand what's needed

---

## 🎉 YOU'RE READY!

All 13 files are in `/mnt/user-data/outputs/` ready to download.

Put them in `rules/knowledge/` folder and start building!

**Remember the golden rule:**
```
Every time you ask Claude for code:
1. Open CLAUDE_CONTEXT.md
2. Copy it
3. Paste it in Claude first
4. Then ask your question
5. Claude will generate perfect code
```

Happy coding! 🚀🎌

---

**Last updated**: June 15, 2026  
**Files**: 13 markdown + txt documents  
**Total size**: ~224 KB  
**For**: JLPT Learning App (React Native + Expo)
