import { progressApi, type ReviewItem } from "@/api";
import { SkeletonBlock } from "@/components/skeleton-block";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import hiraganaData from "../../static-content/hiragana/n5-hiragana.json";
import katakanaData from "../../static-content/katakana/n5-katakana.json";
import kanjiData from "../../static-content/kanji/n5-kanji.json";
import vocabData from "../../static-content/vocab/n5-vocab.json";
import grammarData from "../../static-content/grammar/n5-grammar.json";

type OptionItem = { id: string; display: string };

const TYPE_OPTIONS: Record<string, OptionItem[]> = {
  hiragana: (hiraganaData as { character: string }[]).map((c) => ({ id: c.character, display: c.character })),
  katakana: (katakanaData as { character: string }[]).map((c) => ({ id: c.character, display: c.character })),
  kanji: (kanjiData as { id: string; character: string }[]).map((c) => ({ id: c.id, display: c.character })),
  vocab: (vocabData as { id: string; word: string }[]).map((c) => ({ id: c.id, display: c.word })),
  grammar: (grammarData as { id: string; pattern: string | string[] }[]).map((c) => ({
    id: c.id,
    display: Array.isArray(c.pattern) ? c.pattern[0] ?? "?" : c.pattern ?? "?",
  })),
};

function buildOptions(item: ReviewItem): string[] {
  const pool = TYPE_OPTIONS[item.contentType] ?? [];
  const correct = item.question;
  const candidates = pool.filter((c) => c.id !== item.contentId && c.display !== correct);

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const options = [correct, ...candidates.slice(0, 3).map((c) => c.display)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

const TYPE_LABEL: Record<ReviewItem["contentType"], string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  kanji: "Kanji",
  vocab: "Vocabulary",
  grammar: "Grammar",
};

// ─── Multiple choice card ───────────────────────────────────────────────────

function MultipleChoiceCard({
  item,
  selected,
  onSelect,
}: {
  item: ReviewItem;
  selected: string | null;
  onSelect: (option: string) => void;
}) {
  const options = useMemo(() => buildOptions(item), [item]);

  return (
    <View className="gap-5">
      <View className="rounded-3xl bg-surface-light dark:bg-surface-dark px-8 py-10 items-center gap-4">
        <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
          {TYPE_LABEL[item.contentType]}
        </Text>
        <Text
          style={{ fontSize: 28, fontWeight: "700" }}
          className="text-ink-light dark:text-ink-dark text-center"
        >
          {item.meaning}
        </Text>
        {item.reading ? (
          <Text className="text-base text-muted text-center">{item.reading}</Text>
        ) : null}
        {item.example ? (
          <Text className="text-sm text-muted text-center">{item.example}</Text>
        ) : null}
      </View>

      <View className="gap-2 px-4">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = opt === item.question;

          let bg = "bg-surface-light dark:bg-surface-dark";
          let border = "border-0";
          if (selected) {
            if (isCorrectOpt) {
              bg = "bg-green-100 dark:bg-green-900/30";
              border = "border border-green-500";
            } else if (isSelected) {
              bg = "bg-red-100 dark:bg-red-900/30";
              border = "border border-red-500";
            }
          }

          const Icon = selected && isCorrectOpt
            ? () => <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            : selected && isSelected
              ? () => <Ionicons name="close-circle" size={20} color="#EF4444" />
              : () => null;

          return (
            <Pressable
              key={opt}
              onPress={() => !selected && onSelect(opt)}
              disabled={!!selected}
              className={`rounded-2xl px-5 py-4 flex-row items-center gap-3 ${bg} ${border}`}
              style={({ pressed }) => ({ opacity: !selected && pressed ? 0.7 : 1 })}
            >
              <Text
                style={{ fontSize: item.contentType === "grammar" ? 15 : 20, fontWeight: "600" }}
                className="text-ink-light dark:text-ink-dark flex-1"
                numberOfLines={2}
              >
                {opt}
              </Text>
              <Icon />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function SessionSummary({
  total,
  correct,
  onDone,
  onPracticeAgain,
}: {
  total: number;
  correct: number;
  onDone: () => void;
  onPracticeAgain: () => void;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";

  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <Text style={{ fontSize: 64 }}>{emoji}</Text>
      <View className="items-center gap-2">
        <Text className="text-3xl font-bold text-ink-light dark:text-ink-dark">{pct}%</Text>
        <Text className="text-base text-muted text-center">
          {correct} of {total} correct
        </Text>
      </View>
      <View className="w-full h-2 rounded-full bg-muted/20 overflow-hidden">
        <View
          className="h-2 rounded-full bg-primary-light dark:bg-primary-dark"
          style={{ width: `${pct}%` }}
        />
      </View>
      <Pressable
        onPress={onPracticeAgain}
        className="w-full h-14 rounded-2xl border-2 border-muted/20 items-center justify-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-sm font-semibold text-muted">Practice Again</Text>
      </Pressable>
      <Pressable
        onPress={onDone}
        className="w-full h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <Text className="text-white text-base font-semibold">Done</Text>
      </Pressable>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ReviewScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const queue = useRef<ReviewItem[]>([]);
  const lock = useRef(false);

  const cardOpacity = useSharedValue(1);
  const cardAnimStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));

  const { data, isLoading } = useQuery({
    queryKey: ["review-items"],
    queryFn: progressApi.reviewItems,
  });

  const { mutate: submitReview } = useMutation({
    mutationFn: progressApi.reviewItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-items"] });
    },
  });

  const initialItems: ReviewItem[] = useMemo(() => {
    const raw = data?.items ?? [];
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    return raw;
  }, [data]);

  // Populate queue on first load
  if (queue.current.length === 0 && initialItems.length > 0) {
    queue.current = [...initialItems];
  }

  const items = queue.current;
  const currentItem = items[currentIndex] ?? null;

  const handleSelect = useCallback(
    (option: string) => {
      if (lock.current || !currentItem) return;
      lock.current = true;
      setSelected(option);
      const isCorrect = option === currentItem.question;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setWrongCount((c) => c + 1);
        // Re-queue wrong item to end
        queue.current.push({ ...currentItem });
      }
      submitReview({ contentId: currentItem.contentId, isCorrect });

      const nextIndex = currentIndex + 1;
      const isLast = nextIndex >= items.length;

      setTimeout(() => {
        cardOpacity.value = withTiming(0, { duration: 120 }, () => {
          if (isLast) {
            scheduleOnRN(setSessionDone, true);
          } else {
            scheduleOnRN(setCurrentIndex, nextIndex);
            scheduleOnRN(setSelected, null);
          }
          cardOpacity.value = withTiming(1, { duration: 120 });
          scheduleOnRN(() => { lock.current = false; });
        });
      }, 800);
    },
    [currentItem, currentIndex, items.length, submitReview, cardOpacity],
  );

  const handleDone = useCallback(() => router.replace("/(tabs)"), [router]);

  const handlePracticeAgain = useCallback(() => {
    queue.current = [...initialItems];
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelected(null);
    setSessionDone(false);
    lock.current = false;
  }, [initialItems]);

  if (isLoading) {
    return (
      <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
        <View className="flex-1 px-6 gap-4 pt-4">
          <SkeletonBlock className="h-8 w-32 rounded-xl" />
          <SkeletonBlock className="h-2 rounded-full" />
          <SkeletonBlock className="h-72 rounded-3xl" />
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView
        edges={[]}
        className="flex-1 bg-bg-light dark:bg-bg-dark items-center justify-center px-8 gap-4"
      >
        <Text style={{ fontSize: 56 }}>✅</Text>
        <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark text-center">
          All caught up!
        </Text>
        <Text className="text-sm text-muted text-center">
          No reviews due today. Complete lessons to add cards.
        </Text>
        <Pressable
          onPress={handleDone}
          className="mt-4 px-8 h-12 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Text className="text-white font-semibold">Done</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (sessionDone) {
    return (
      <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
        <SessionSummary total={initialItems.length} correct={correctCount} onDone={handleDone} onPracticeAgain={handlePracticeAgain} />
      </SafeAreaView>
    );
  }

  // Preview list
  if (!sessionStarted) {
    const typeCounts: Record<string, number> = {};
    for (const it of initialItems) {
      typeCounts[it.contentType] = (typeCounts[it.contentType] ?? 0) + 1;
    }

    return (
      <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
        <View className="flex-1 px-6 pt-6 gap-6">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark">Review</Text>
            <Text className="text-sm text-muted">{initialItems.length} items due today</Text>
          </View>

          <View className="gap-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <View
                key={type}
                className="rounded-2xl bg-surface-light dark:bg-surface-dark px-5 py-4 flex-row items-center justify-between"
              >
                <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
                  {TYPE_LABEL[type as ReviewItem["contentType"]]}
                </Text>
                <Text className="text-sm text-muted">{count}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => setSessionStarted(true)}
            className="w-full h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="text-white text-base font-semibold">Start Review</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (currentIndex + 1) / items.length;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
      <View className="px-6 pt-4 pb-5 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
            {currentIndex + 1}
            <Text className="text-muted font-normal"> / {items.length}</Text>
          </Text>
          <Text className="text-sm text-muted">{correctCount} correct{wrongCount > 0 ? ` · ${wrongCount} wrong` : ""}</Text>
        </View>
        <View className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <View
            className="h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      <Animated.View style={[{ paddingHorizontal: 12 }, cardAnimStyle]}>
        {currentItem && (
          <MultipleChoiceCard
            key={currentItem.contentId}
            item={currentItem}
            selected={selected}
            onSelect={handleSelect}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
