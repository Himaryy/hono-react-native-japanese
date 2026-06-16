# CODE REVIEW WORKFLOW - Analyze Before Copy-Paste

**Purpose**: Guide for reviewing AI-generated code before implementing  
**For**: JLPT App Frontend Development  
**Workflow**: AI gives code → You analyze → You copy-paste if good → Ask for changes if needed  

---

## 🔄 THE WORKFLOW (4 STEPS)

### Step 1️⃣: ASK CLAUDE FOR CODE
```
Before asking:
1. Open CLAUDE_CONTEXT.md
2. Copy entire content
3. Paste into Claude's context window
4. Then ask your question

Your question format:
---
I'm building [SCREEN/COMPONENT] for the JLPT app.

From BUILD_ORDER.md step [X.X]:
[Copy the requirement from BUILD_ORDER.md]

From PRD Section [X]:
[Copy relevant requirement from PRD]

Can you generate code for [specific component/service]?

Structure expected:
- [List what you need]
- TypeScript types
- TanStack Query hooks
- Zustand integration (if global state)

Please provide code that I can review before copy-paste.
---
```

---

### Step 2️⃣: CLAUDE PROVIDES CODE

Claude will give you code like:

```typescript
// authService.ts
import { useQuery, useMutation } from '@tanstack/react-query';

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Sign in failed');
      return response.json();
    }
  });
};
```

---

### Step 3️⃣: YOU ANALYZE THE CODE

**Checklist for reviewing:**

#### ✅ SYNTAX & STRUCTURE
- [ ] Code compiles (no syntax errors)
- [ ] Imports are correct
- [ ] File structure matches your folder layout
- [ ] Comments are minimal and useful (only "why", not "what")

#### ✅ TYPESCRIPT
- [ ] All functions have return types: `useSignIn(): UseMutationResult<...>`
- [ ] All parameters have types: `(credentials: { email: string; password: string })`
- [ ] No `any` types used
- [ ] Interfaces defined if needed
- [ ] Types exported and reusable

Example of BAD (has `any`):
```typescript
const signIn = (creds: any) => { ... }  // ❌ BAD
```

Example of GOOD:
```typescript
interface SignInCredentials {
  email: string;
  password: string;
}

const signIn = (creds: SignInCredentials) => { ... }  // ✅ GOOD
```

#### ✅ REACT NATIVE / EXPO
- [ ] Uses functional components (no class components)
- [ ] Uses hooks (useState, useEffect, etc.)
- [ ] Uses TanStack Query hooks (useQuery, useMutation)
- [ ] No React.FC generic (just function)
- [ ] Proper error handling with try-catch or error callbacks

#### ✅ STATE MANAGEMENT
- [ ] Uses TanStack Query for server state (API calls)
- [ ] Uses Zustand for global state (if needed)
- [ ] No Redux
- [ ] No AsyncStorage without TanStack Query

#### ✅ API CALLS
- [ ] Uses `process.env.EXPO_PUBLIC_API_URL` (not hardcoded)
- [ ] Uses `credentials: 'include'` (for Better Auth cookies)
- [ ] Includes proper error handling
- [ ] Response types match backend (check JLPT_Backend_BetterAuth.md)
- [ ] Matches API endpoint format

#### ✅ FILE NAMING & ORGANIZATION
- [ ] Components: `PascalCase.tsx` (e.g., `DashboardScreen.tsx`)
- [ ] Services: `camelCase.ts` (e.g., `authService.ts`)
- [ ] Hooks: `camelCase.ts` with `use` prefix (e.g., `useProgress.ts`)
- [ ] Screens: `PascalCase.tsx` + `Screen` suffix (e.g., `LessonScreen.tsx`)
- [ ] Types: in `src/types/index.ts`

#### ✅ PERFORMANCE
- [ ] Uses `useCallback` for memoization (if needed)
- [ ] Doesn't cause unnecessary re-renders
- [ ] API calls cached via TanStack Query
- [ ] Loading states handled

#### ✅ MATCHES REQUIREMENTS
- [ ] Meets BUILD_ORDER.md step requirements
- [ ] Matches PRD section requirements
- [ ] Has all features mentioned
- [ ] No extra features (don't add scope creep)

---

### Step 4️⃣: DECIDE

#### ✅ CODE IS GOOD
```
Response to Claude:

"Code looks good! I'm copying this now."

Then:
- Copy code to your project
- Check it compiles
- Test it works
- Move to next step in BUILD_ORDER.md
```

#### ⚠️ CODE NEEDS CHANGES
```
Response to Claude:

"The code looks mostly good, but please fix:

1. [Specific issue 1] - why it's wrong
2. [Specific issue 2] - what should be different
3. [Specific issue 3] - expected behavior

Can you revise?"

Then:
- Claude revises the code
- You review again
- If good, copy-paste
- If more changes needed, repeat
```

#### ❌ CODE IS BAD - START OVER
```
Response to Claude:

"This code doesn't match the requirements. Let me re-ask with more detail.

I need [specific thing] because [reason].
The code should [specific behavior]."

Then:
- Ask again with clearer requirements
- Or ask a simpler question first
- Break down the feature into smaller pieces
```

---

## 📋 COMMON ISSUES TO LOOK FOR

### Issue 1: Wrong State Management
❌ **BAD**: Using Redux
```typescript
import { useDispatch, useSelector } from 'react-redux';
```

✅ **GOOD**: Using TanStack Query + Zustand
```typescript
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/appStore';
```

**Fix**: Ask Claude to replace Redux with TanStack Query

---

### Issue 2: Hardcoded URLs
❌ **BAD**: Hardcoded backend URL
```typescript
const response = await fetch('https://jlpt-app.vercel.app/api/progress/stats');
```

✅ **GOOD**: Environment variable
```typescript
const response = await fetch(
  `${process.env.EXPO_PUBLIC_API_URL}/api/progress/stats`
);
```

**Fix**: Ask Claude to use env variable

---

### Issue 3: Missing Credentials
❌ **BAD**: No cookies sent
```typescript
const response = await fetch(`${API_URL}/api/progress/stats`);
```

✅ **GOOD**: Credentials included
```typescript
const response = await fetch(`${API_URL}/api/progress/stats`, {
  credentials: 'include'  // For Better Auth cookies
});
```

**Fix**: Ask Claude to add `credentials: 'include'`

---

### Issue 4: Class Components
❌ **BAD**: Class component
```typescript
class DashboardScreen extends React.Component {
  render() {
    return <View>...</View>;
  }
}
```

✅ **GOOD**: Functional component
```typescript
export const DashboardScreen = () => {
  return <View>...</View>;
};
```

**Fix**: Ask Claude to convert to functional component with hooks

---

### Issue 5: Using `any` Type
❌ **BAD**: Using `any`
```typescript
const handleData = (data: any) => {
  // ...
}
```

✅ **GOOD**: Proper typing
```typescript
interface ProgressData {
  currentDay: number;
  streak: number;
}

const handleData = (data: ProgressData) => {
  // ...
}
```

**Fix**: Ask Claude to define proper types

---

### Issue 6: AsyncStorage
❌ **BAD**: Using AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
const data = await AsyncStorage.getItem('progress');
```

✅ **GOOD**: Using TanStack Query + Backend
```typescript
const { data } = useQuery({
  queryKey: ['progress'],
  queryFn: () => fetch('/api/progress/stats')
});
```

**Fix**: Ask Claude to use TanStack Query instead

---

## 🎯 QUICK CHECKLIST

Before copy-pasting, verify:

### Must Have ✅
- [ ] TypeScript (no `any`)
- [ ] TanStack Query for API calls
- [ ] Functional components
- [ ] No Redux
- [ ] No AsyncStorage
- [ ] Env vars for backend URL
- [ ] Proper error handling
- [ ] Credentials for auth

### Should Have ✅
- [ ] Clear variable names
- [ ] Type exports
- [ ] Comments (only "why")
- [ ] Matches PRD requirements
- [ ] Matches BUILD_ORDER.md step

### Nice to Have ✅
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Performance optimizations

---

## 📚 REFERENCES WHILE REVIEWING

**Tech Stack**:
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- TanStack Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand
- TypeScript: https://www.typescriptlang.org

**Your Documentation**:
- JLPT_App_PRD.md - What features should do
- JLPT_Backend_BetterAuth.md - API endpoints/formats
- BUILD_ORDER.md - Current step requirements
- CLAUDE_CONTEXT.md - Tech stack details

---

## 🔄 EXAMPLE WORKFLOW

### You Ask Claude:

```
I'm building the Dashboard screen for JLPT app.

From BUILD_ORDER.md step 3.3:
Build Dashboard Screen (10 hours)
- Profile badge (name, level)
- Streak counter (🔥 X days)
- Daily progress bar (X/10 items)
- "Start Today's Lesson" button
- Quick stats (kanji count, vocab count)
- Friends activity feed

From PRD Section 3.2:
Dashboard shows user stats and today's lesson start button.

Can you generate:
1. DashboardScreen.tsx component
2. Custom hook useProgressStats for fetching stats
3. StreakCounter.tsx component

Please use TypeScript strictly and TanStack Query for API calls.
```

### Claude Responds:

```typescript
// useProgressStats.ts
import { useQuery } from '@tanstack/react-query';

interface ProgressStats {
  currentDay: number;
  totalKanjiLearned: number;
  currentStreak: number;
  jlptLevel: string;
}

export const useProgressStats = () => {
  return useQuery<ProgressStats>({
    queryKey: ['progress', 'stats'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/progress/stats`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });
};

// StreakCounter.tsx
import { View, Text } from 'react-native';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  return (
    <View className="p-4 bg-orange-100 rounded-lg">
      <Text className="text-2xl font-bold">🔥 {streak}</Text>
      <Text className="text-sm text-gray-600">Day streak</Text>
    </View>
  );
};

// DashboardScreen.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useProgressStats } from '../hooks/useProgressStats';
import { StreakCounter } from '../components/StreakCounter';

export const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useProgressStats();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!stats) return <Text>No data</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Welcome!</Text>
      
      <StreakCounter streak={stats.currentStreak} />
      
      <View className="mt-4">
        <Text className="font-semibold">Stats:</Text>
        <Text>Kanji: {stats.totalKanjiLearned}</Text>
        <Text>Level: {stats.jlptLevel}</Text>
      </View>
      
      <TouchableOpacity className="mt-6 bg-green-500 p-4 rounded-lg">
        <Text className="text-white text-center font-bold">Start Lesson</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

### You Review (Checklist):

✅ TypeScript: Yes (all types defined)  
✅ TanStack Query: Yes (useQuery hook)  
✅ Functional components: Yes  
✅ Credentials: Yes (`credentials: 'include'`)  
✅ Error handling: Yes (error, loading states)  
✅ Matches BUILD_ORDER.md: Mostly (but no friends activity feed)  
✅ File structure: Good (hooks, components, screens)  

⚠️ Missing: Friends activity feed from PRD  

### You Response to Claude:

```
Code looks good! But I notice friends activity feed is missing from the requirements.

Can you add:
- FriendsActivity.tsx component
- Shows last 3 friends who studied
- Fetches from /api/friends/activity
- Updates every 30 seconds

Otherwise, code is ready to copy!
```

### Claude Revises:

```typescript
// FriendsActivity.tsx
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';

interface FriendActivity {
  userId: string;
  lastStudiedAt: string;
  currentStreak: number;
}

export const FriendsActivity = () => {
  const { data: friends } = useQuery({
    queryKey: ['friends', 'activity'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/friends/activity`,
        { credentials: 'include' }
      );
      return response.json();
    },
    refetchInterval: 30000  // Poll every 30 seconds
  });

  return (
    <View className="mt-6">
      <Text className="font-semibold mb-2">Friends Activity</Text>
      {friends?.friends.slice(0, 3).map(friend => (
        <Text key={friend.userId}>
          {friend.userId}: 🔥 {friend.currentStreak} days
        </Text>
      ))}
    </View>
  );
};

// Add to DashboardScreen:
<FriendsActivity />
```

### You Review Again:

✅ Polling every 30 seconds: Good  
✅ Matches PRD: Yes  
✅ Uses TanStack Query: Yes  
✅ Ready!

### You Copy-Paste:

```
Perfect! Copying all three files now. Thanks!
```

---

## 🚀 SUMMARY

**Your workflow:**

1. **Ask Claude** with CLAUDE_CONTEXT.md pasted first
2. **Claude provides** code with explanation
3. **You review** using the checklist above
4. **You decide**:
   - ✅ Good? Copy-paste
   - ⚠️ Needs changes? Ask for specific edits
   - ❌ Bad? Ask again with clearer requirements
5. **Repeat** for next step in BUILD_ORDER.md

---

**Key principle:** YOU control the code. Claude generates, YOU decide. Never copy code you don't understand.

This ensures:
- Code quality stays high
- You learn the codebase
- Issues get fixed before copying
- No technical debt

Happy coding! 🚀
