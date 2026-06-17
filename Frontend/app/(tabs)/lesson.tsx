import { lessonsApi, progressApi, type Lesson } from "@/api";
import { LessonItem } from "@/api/lessons";
import { SkeletonBlock } from "@/components/skeleton-block";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Shared ───────────────────────────────────────────────────────────────────

const FILL = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const TYPE_LABEL: Record<LessonItem["contentType"], string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  kanji: "Kanji",
  vocab: "Vocabulary",
  grammar: "Grammar",
};

// ─── Learn card ───────────────────────────────────────────────────────────────

function LearnCard({ item }: { item: LessonItem }) {
  return (
    <View
      className="rounded-3xl bg-surface-light dark:bg-surface-dark px-8 py-10 items-center gap-4"
      style={{ minHeight: 280 }}
    >
      <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
        {TYPE_LABEL[item.contentType]}
      </Text>
      <Text
        style={{
          fontSize: item.contentType === "grammar" ? 28 : 72,
          fontWeight: "700",
        }}
        className="text-ink-light dark:text-ink-dark text-center leading-tight"
        adjustsFontSizeToFit
        numberOfLines={2}
      >
        {item.question}
      </Text>
      {item.reading ? (
        <Text className="text-xl text-muted text-center">{item.reading}</Text>
      ) : null}
      <View className="h-px w-16 bg-muted/20" />
      <Text className="text-base font-semibold text-ink-light dark:text-ink-dark text-center">
        {item.meaning}
      </Text>
      {item.example ? (
        <View className="items-center gap-1">
          <Text className="text-sm text-muted text-center">{item.example}</Text>
          <Text className="text-xs text-muted/60 text-center">
            {item.exampleTranslation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Recognize card (flip) ────────────────────────────────────────────────────

function RecognizeCard({
  item,
  onFlip,
  isFlipped,
}: {
  item: LessonItem;
  onFlip: () => void;
  isFlipped: boolean;
}) {
  const flip = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 90])}deg` },
    ],
    opacity: interpolate(
      flip.value,
      [0, 0.45, 0.5],
      [1, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0.5, 1], [-90, 0])}deg` },
    ],
    opacity: interpolate(
      flip.value,
      [0.5, 0.55, 1],
      [0, 1, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const handlePress = useCallback(() => {
    if (isFlipped) return;
    flip.value = withTiming(1, {
      duration: 450,
      easing: Easing.inOut(Easing.cubic),
    });
    onFlip();
  }, [isFlipped, flip, onFlip]);

  return (
    <Pressable
      onPress={handlePress}
      style={{ height: 280, position: "relative" }}
    >
      {/* Front */}
      <Animated.View
        style={[FILL, frontStyle]}
        className="rounded-3xl bg-surface-light dark:bg-surface-dark items-center justify-center px-8"
      >
        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
          {TYPE_LABEL[item.contentType]}
        </Text>
        <Text
          style={{
            fontSize: item.contentType === "grammar" ? 26 : 72,
            fontWeight: "700",
          }}
          className="text-ink-light dark:text-ink-dark text-center"
          adjustsFontSizeToFit
          numberOfLines={2}
        >
          {item.question}
        </Text>
        <View className="mt-6 flex-row items-center gap-1.5 opacity-40">
          <Ionicons name="finger-print-outline" size={14} color="#87817B" />
          <Text className="text-xs text-muted">Tap to reveal</Text>
        </View>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[FILL, backStyle]}
        className="rounded-3xl bg-surface-light dark:bg-surface-dark items-center justify-center px-8 gap-3"
      >
        {item.reading ? (
          <Text className="text-lg text-muted text-center">{item.reading}</Text>
        ) : null}
        <Text
          style={{ fontSize: 28, fontWeight: "700" }}
          className="text-ink-light dark:text-ink-dark text-center"
        >
          {item.meaning}
        </Text>
        {item.example ? (
          <View className="mt-1 items-center gap-1">
            <Text className="text-sm text-muted text-center">
              {item.example}
            </Text>
            <Text className="text-xs text-muted/60 text-center">
              {item.exampleTranslation}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

// ─── Learn phase ──────────────────────────────────────────────────────────────

function LearnPhase({
  items,
  onComplete,
}: {
  items: LessonItem[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const isAnimating = useRef(false);
  const cardOpacity = useSharedValue(1);
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const resetAnimating = useCallback(() => {
    isAnimating.current = false;
  }, []);

  const advance = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const nextIndex = index + 1;
    const isLast = nextIndex >= items.length;
    cardOpacity.value = withTiming(0, { duration: 150 }, () => {
      if (isLast) {
        scheduleOnRN(onComplete);
      } else {
        scheduleOnRN(setIndex, nextIndex);
      }
      cardOpacity.value = withTiming(1, { duration: 150 });
      scheduleOnRN(resetAnimating);
    });
  }, [index, items.length, onComplete, cardOpacity, resetAnimating]);

  const progress = (index + 1) / items.length;

  return (
    <View className="flex-1">
      <View className="px-6 pt-4 pb-5 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            {index + 1}
            <Text className="text-muted font-normal"> / {items.length}</Text>
          </Text>
          <Text className="text-xs text-muted uppercase tracking-widest">
            Learn
          </Text>
        </View>
        <View className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <View
            className="h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      <Animated.View style={[{ paddingHorizontal: 24 }, cardAnimStyle]}>
        <LearnCard item={items[index]!} />
      </Animated.View>

      <View className="px-6 mt-6">
        <Pressable
          onPress={advance}
          className="h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center flex-row gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className="text-white text-sm font-semibold">
            {index + 1 >= items.length ? "Start Quiz" : "Next"}
          </Text>
          <Ionicons
            name={
              index + 1 >= items.length ? "arrow-forward" : "chevron-forward"
            }
            size={16}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Recognize phase ──────────────────────────────────────────────────────────

function RecognizePhase({
  items,
  onComplete,
}: {
  items: LessonItem[];
  onComplete: (correctCount: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isAnimating = useRef(false);
  const cardOpacity = useSharedValue(1);
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const resetAnimating = useCallback(() => {
    isAnimating.current = false;
  }, []);

  const advance = useCallback(
    (isCorrect: boolean) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      const nextIndex = index + 1;
      const isLast = nextIndex >= items.length;
      const nextCorrect = isCorrect ? correct + 1 : correct;

      cardOpacity.value = withTiming(0, { duration: 150 }, () => {
        if (isLast) {
          scheduleOnRN(onComplete, nextCorrect);
        } else {
          if (isCorrect) scheduleOnRN(setCorrect, nextCorrect);
          scheduleOnRN(setIndex, nextIndex);
          scheduleOnRN(setIsFlipped, false);
        }
        cardOpacity.value = withTiming(1, { duration: 150 });
        scheduleOnRN(resetAnimating);
      });
    },
    [index, correct, items.length, onComplete, cardOpacity, resetAnimating],
  );

  const progress = (index + 1) / items.length;

  return (
    <View className="flex-1">
      <View className="px-6 pt-4 pb-5 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            {index + 1}
            <Text className="text-muted font-normal"> / {items.length}</Text>
          </Text>
          <Text className="text-xs text-muted uppercase tracking-widest">
            Quiz
          </Text>
        </View>
        <View className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <View
            className="h-1.5 rounded-full bg-accent-light dark:bg-accent-dark"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      <Animated.View style={[{ paddingHorizontal: 24 }, cardAnimStyle]}>
        <RecognizeCard
          key={items[index]!.contentId}
          item={items[index]!}
          onFlip={() => setIsFlipped(true)}
          isFlipped={isFlipped}
        />
      </Animated.View>

      {isFlipped && (
        <View className="px-6 mt-6 flex-row gap-3">
          <Pressable
            onPress={() => advance(false)}
            className="flex-1 h-14 rounded-2xl border-2 border-muted/20 items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Ionicons name="close" size={18} color="#87817B" />
            <Text className="text-sm font-semibold text-muted">Again</Text>
          </Pressable>
          <Pressable
            onPress={() => advance(true)}
            className="flex-1 h-14 rounded-2xl bg-accent-light dark:bg-accent-dark items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text className="text-white text-sm font-semibold">Got it</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Summary phase ────────────────────────────────────────────────────────────

function SummaryPhase({
  lesson,
  correctCount,
  onFinish,
  onPracticeAgain,
  onNextLesson,
}: {
  lesson: Lesson;
  correctCount: number;
  onFinish: () => void;
  onPracticeAgain: () => void;
  onNextLesson: () => void;
}) {
  const pct =
    lesson.items.length > 0
      ? Math.round((correctCount / lesson.items.length) * 100)
      : 100;
  const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";

  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <Text style={{ fontSize: 64 }}>{emoji}</Text>
      <View className="items-center gap-1">
        <Text className="text-3xl font-bold text-ink-light dark:text-ink-dark">
          {pct}%
        </Text>
        <Text className="text-base text-muted text-center">
          {correctCount} of {lesson.items.length} correct
        </Text>
      </View>
      <View className="w-full h-2 rounded-full bg-muted/20 overflow-hidden">
        <View
          className="h-2 rounded-full bg-primary-light dark:bg-primary-dark"
          style={{ width: `${pct}%` }}
        />
      </View>
      <View className="w-full bg-surface-light dark:bg-surface-dark rounded-2xl px-4 py-4 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted">Lesson</Text>
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            Day {lesson.day}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted">Items learned</Text>
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            {lesson.items.length}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onPracticeAgain}
        className="w-full h-14 rounded-2xl border-2 border-muted/20 items-center justify-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-sm font-semibold text-muted">Practice Again</Text>
      </Pressable>
      <Pressable
        onPress={onNextLesson}
        className="w-full h-14 rounded-2xl bg-accent-light dark:bg-accent-dark items-center justify-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-white text-base font-semibold">Next Lesson</Text>
      </Pressable>
      <Pressable
        onPress={onFinish}
        className="w-full h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-white text-base font-semibold">Back to Home</Text>
      </Pressable>
    </View>
  );
}

// ─── Preview phase ─────────────────────────────────────────────────────────────

function PreviewPhase({
  lesson,
  onStart,
}: {
  lesson: Lesson;
  onStart: () => void;
}) {
  const typeCounts: Record<string, number> = {};
  for (const it of lesson.items) {
    typeCounts[it.contentType] = (typeCounts[it.contentType] ?? 0) + 1;
  }

  return (
    <View className="flex-1 px-6 pt-8 gap-6">
      <View className="items-center gap-2">
        <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
          Day {lesson.day}
        </Text>
        <Text
          style={{ fontSize: 26, fontWeight: "700" }}
          className="text-ink-light dark:text-ink-dark text-center"
        >
          {lesson.title}
        </Text>
        <Text className="text-sm text-muted text-center leading-relaxed">
          {lesson.description}
        </Text>
      </View>

      <View className="rounded-2xl bg-surface-light dark:bg-surface-dark px-4 py-4 gap-2">
        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
          In this lesson
        </Text>
        {Object.entries(typeCounts).map(([type, count]) => (
          <View key={type} className="flex-row items-center justify-between">
            <Text className="text-sm text-ink-light dark:text-ink-dark">
              {TYPE_LABEL[type as LessonItem["contentType"]]}
            </Text>
            <Text className="text-sm text-muted">{count}</Text>
          </View>
        ))}
        <View className="h-px bg-muted/20 my-1" />
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            Total items
          </Text>
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            {lesson.items.length}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 rounded-2xl bg-muted/10 px-4 py-3">
        <Ionicons name="time-outline" size={16} color="#87817B" />
        <Text className="text-xs text-muted">~{lesson.estimatedMinutes} min</Text>
      </View>

      <Pressable
        onPress={onStart}
        className="w-full h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center flex-row gap-2"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <Text className="text-white text-base font-semibold">Start Learning</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LessonScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const startTime = useRef(Date.now());
  const lessonSnapshot = useRef<Lesson | null>(null);

  // Force full reset when navigated to with a fresh timestamp param (e.g. Next Lesson)
  useEffect(() => {
    if (params.t) {
      lessonSnapshot.current = null;
      setPhase("preview");
      setCorrectCount(0);
      startTime.current = Date.now();
    }
  }, [params.t]);

  const [phase, setPhase] = useState<"preview" | "learn" | "recognize" | "summary">(
    "preview",
  );
  const [correctCount, setCorrectCount] = useState(0);

  const handleStartLearning = useCallback(() => setPhase("learn"), []);

  const handlePracticeAgain = useCallback(() => {
    setPhase("learn");
    setCorrectCount(0);
    startTime.current = Date.now();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["lesson", "today"],
    queryFn: lessonsApi.today,
    staleTime: Infinity,
  });

  const { mutate: completeLesson } = useMutation({
    mutationFn: progressApi.completeLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["review-items"] });
    },
    onError: (err) => {
      console.error("[completeLesson]", err);
    },
  });

  // Snapshot lesson on first load so Practice Again never gets new words
  if (data?.lesson && !lessonSnapshot.current) {
    lessonSnapshot.current = data.lesson;
  }
  const lesson = lessonSnapshot.current ?? data?.lesson;

  const handleLearnDone = useCallback(() => setPhase("recognize"), []);

  const handleRecognizeDone = useCallback(
    (correct: number) => {
      if (!lesson) return;
      setCorrectCount(correct);
      setPhase("summary");
      const timeSpentMinutes = Math.round(
        (Date.now() - startTime.current) / 60000,
      );
      completeLesson({
        day: lesson.day,
        timeSpentMinutes: Math.max(1, timeSpentMinutes),
        itemsMasteredCount: correct,
      });
    },
    [lesson, completeLesson],
  );

  const handleFinish = useCallback(() => {
    router.replace("/(tabs)");
  }, [router]);

  const handleNextLesson = useCallback(() => {
    lessonSnapshot.current = null;
    queryClient.setQueryData(["lesson", "today"], null);
    queryClient.invalidateQueries({ queryKey: ["lesson", "today"] });
    router.replace({ pathname: "/(tabs)/lesson" as any, params: { t: Date.now() } } as any);
  }, [router, queryClient]);

  if (isLoading || !lesson) {
    return (
      <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
        <View className="px-6 pt-4 gap-4">
          <SkeletonBlock className="h-8 w-40 rounded-xl" />
          <SkeletonBlock className="h-2 rounded-full" />
          <SkeletonBlock className="h-72 rounded-3xl" />
          <SkeletonBlock className="h-14 rounded-2xl" />
        </View>
      </SafeAreaView>
    );
  }

  if (lesson.items.length === 0) {
    return (
      <SafeAreaView
        edges={[]}
        className="flex-1 bg-bg-light dark:bg-bg-dark items-center justify-center px-8 gap-4"
      >
        <Text style={{ fontSize: 48 }}>📭</Text>
        <Text className="text-xl font-bold text-ink-light dark:text-ink-dark text-center">
          No content today
        </Text>
        <Text className="text-sm text-muted text-center">
          This lesson has no items. Check back later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
      {phase === "preview" && (
        <PreviewPhase lesson={lesson} onStart={handleStartLearning} />
      )}
      {phase === "learn" && (
        <LearnPhase items={lesson.items} onComplete={handleLearnDone} />
      )}
      {phase === "recognize" && (
        <RecognizePhase items={lesson.items} onComplete={handleRecognizeDone} />
      )}
      {phase === "summary" && (
        <SummaryPhase
          lesson={lesson}
          correctCount={correctCount}
          onFinish={handleFinish}
          onPracticeAgain={handlePracticeAgain}
          onNextLesson={handleNextLesson}
        />
      )}
    </SafeAreaView>
  );
}
