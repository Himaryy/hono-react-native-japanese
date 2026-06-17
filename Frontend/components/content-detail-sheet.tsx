import { norm } from "@/lib/utils";
import { Portal } from "@rn-primitives/portal";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Unified content type ────────────────────────────────────────────────────

export type KanaDetail = {
  type: "hiragana" | "katakana";
  character: string;
  romaji: string;
  group: string;
};

export type KanjiDetail = {
  type: "kanji";
  id: string;
  character: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string[];
  strokeCount: number;
  examples?: Array<{ word: string; reading: string; meaning: string }>;
};

export type VocabDetail = {
  type: "vocab";
  id: string;
  word: string;
  reading: string;
  meaning: string | string[];
  partOfSpeech?: string;
};

export type GrammarDetail = {
  type: "grammar";
  id: string;
  pattern: string | string[];
  meaning: string | string[];
  example?: string;
  exampleTranslation?: string;
};

export type ContentDetail = KanaDetail | KanjiDetail | VocabDetail | GrammarDetail;

// ─── Detail body per type ────────────────────────────────────────────────────

function KanaBody({ item }: { item: KanaDetail }) {
  const typeLabel = item.type === "hiragana" ? "Hiragana" : "Katakana";
  const groupLabel = item.group.replace("-row", "").toUpperCase() + " row";
  return (
    <View className="items-center gap-6 py-4">
      <Text style={{ fontSize: 96, fontWeight: "700", lineHeight: 112 }} className="text-ink-light dark:text-ink-dark">
        {item.character}
      </Text>
      <View className="items-center gap-1">
        <Text style={{ fontSize: 32, fontWeight: "600" }} className="text-primary-light dark:text-primary-dark">
          {item.romaji}
        </Text>
        <Text className="text-sm text-muted">{typeLabel} · {groupLabel}</Text>
      </View>
    </View>
  );
}

function KanjiBody({ item }: { item: KanjiDetail }) {
  return (
    <View className="gap-5">
      <View className="items-center py-2">
        <Text style={{ fontSize: 88, fontWeight: "700", lineHeight: 104 }} className="text-ink-light dark:text-ink-dark">
          {item.character}
        </Text>
        <Text className="text-xs text-muted mt-1">{item.strokeCount} strokes</Text>
      </View>

      <View className="gap-3">
        {item.onyomi.length > 0 && (
          <Row label="On'yomi" value={item.onyomi.join("、")} />
        )}
        {item.kunyomi.length > 0 && (
          <Row label="Kun'yomi" value={item.kunyomi.join("、")} />
        )}
        <Row label="Meaning" value={item.meaning.join(", ")} />
      </View>

      {item.examples && item.examples.length > 0 && (
        <View className="gap-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-widest">Examples</Text>
          {item.examples.map((ex, i) => (
            <View key={i} className="flex-row items-baseline gap-3 px-4 py-3 rounded-2xl bg-surface-light dark:bg-surface-dark">
              <Text style={{ fontSize: 18, fontWeight: "700" }} className="text-ink-light dark:text-ink-dark">
                {ex.word}
              </Text>
              <Text className="text-sm text-muted">{ex.reading}</Text>
              <Text className="text-sm text-muted flex-1 text-right">{ex.meaning}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function VocabBody({ item }: { item: VocabDetail }) {
  return (
    <View className="gap-5">
      <View className="items-center py-2 gap-1">
        <Text style={{ fontSize: 52, fontWeight: "700" }} className="text-ink-light dark:text-ink-dark">
          {item.word}
        </Text>
        <Text style={{ fontSize: 20 }} className="text-muted">{item.reading}</Text>
      </View>
      <View className="gap-3">
        <Row label="Meaning" value={norm(item.meaning)} />
        {item.partOfSpeech && <Row label="Type" value={item.partOfSpeech} />}
      </View>
    </View>
  );
}

function GrammarBody({ item }: { item: GrammarDetail }) {
  return (
    <View className="gap-5">
      <View className="items-center py-2">
        <Text style={{ fontSize: 28, fontWeight: "700" }} className="text-ink-light dark:text-ink-dark text-center">
          {norm(item.pattern)}
        </Text>
      </View>
      <View className="gap-3">
        <Row label="Meaning" value={norm(item.meaning)} />
      </View>
      {item.example && (
        <View className="gap-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-widest">Example</Text>
          <View className="px-4 py-3 rounded-2xl bg-surface-light dark:bg-surface-dark gap-1.5">
            <Text style={{ fontSize: 16 }} className="text-ink-light dark:text-ink-dark">{item.example}</Text>
            <Text className="text-sm text-muted">{item.exampleTranslation}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <Text className="text-xs font-semibold text-muted uppercase tracking-wider w-20 pt-0.5">{label}</Text>
      <Text className="text-base text-ink-light dark:text-ink-dark flex-1">{value}</Text>
    </View>
  );
}

// ─── Sheet ───────────────────────────────────────────────────────────────────

const DURATION = 280;

interface ContentDetailSheetProps {
  item: ContentDetail | null;
  onClose: () => void;
}

export function ContentDetailSheet({ item, onClose }: ContentDetailSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(600);
  const backdropOpacity = useSharedValue(0);

  const close = useCallback(() => {
    translateY.value = withTiming(600, { duration: DURATION, easing: Easing.in(Easing.cubic) });
    backdropOpacity.value = withTiming(0, { duration: DURATION }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, translateY, backdropOpacity]);

  useEffect(() => {
    if (item) {
      translateY.value = withTiming(0, { duration: DURATION, easing: Easing.out(Easing.cubic) });
      backdropOpacity.value = withTiming(1, { duration: DURATION });
    }
  }, [item, translateY, backdropOpacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!item) return null;

  return (
    <Portal name="content-detail-sheet">
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }, backdropStyle]}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: insets.bottom,
          },
          sheetStyle,
        ]}
        className="bg-bg-light dark:bg-bg-dark rounded-t-3xl"
      >
        {/* Handle + close */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View className="flex-1" />
          <View className="w-10 h-1 rounded-full bg-muted/30" />
          <View className="flex-1 items-end">
            <Pressable
              onPress={close}
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(135,129,123,0.12)" }}
            >
              <Ionicons name="close" size={16} color="#87817B" />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {item.type === "hiragana" || item.type === "katakana" ? (
            <KanaBody item={item} />
          ) : item.type === "kanji" ? (
            <KanjiBody item={item} />
          ) : item.type === "vocab" ? (
            <VocabBody item={item} />
          ) : (
            <GrammarBody item={item} />
          )}
        </ScrollView>
      </Animated.View>
    </View>
    </Portal>
  );
}
