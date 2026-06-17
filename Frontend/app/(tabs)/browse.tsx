import {
  ContentDetailSheet,
  type ContentDetail,
  type KanaDetail,
  type KanjiDetail,
  type VocabDetail,
  type GrammarDetail,
} from "@/components/content-detail-sheet";
import { norm } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FlatList, Pressable, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import hiraganaData from "../../../static-content/hiragana/n5-hiragana.json";
import katakanaData from "../../../static-content/katakana/n5-katakana.json";
import kanjiData from "../../../static-content/kanji/n5-kanji.json";
import vocabData from "../../../static-content/vocab/n5-vocab.json";
import grammarData from "../../../static-content/grammar/n5-grammar.json";

type Category = "hiragana" | "katakana" | "kanji" | "vocab" | "grammar";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "hiragana", label: "Hiragana" },
  { key: "katakana", label: "Katakana" },
  { key: "kanji", label: "Kanji" },
  { key: "vocab", label: "Vocab" },
  { key: "grammar", label: "Grammar" },
];

const GROUP_LABELS: Record<string, string> = {
  "a-row": "A Row",
  "ka-row": "KA Row",
  "sa-row": "SA Row",
  "ta-row": "TA Row",
  "na-row": "NA Row",
  "ha-row": "HA Row",
  "ma-row": "MA Row",
  "ya-row": "YA Row",
  "ra-row": "RA Row",
  "wa-row": "WA Row",
  "ga-row": "GA Row",
  "za-row": "ZA Row",
  "da-row": "DA Row",
  "ba-row": "BA Row",
  "pa-row": "PA Row",
};

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="px-6 pt-5 pb-2 bg-bg-light dark:bg-bg-dark">
      <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );
}

// ─── Kana grid ───────────────────────────────────────────────────────────────

type KanaItemRaw = { character: string; romaji: string; group: string };

function KanaGrid({
  items,
  onPress,
  category,
}: {
  items: KanaItemRaw[];
  onPress: (item: ContentDetail) => void;
  category: "hiragana" | "katakana";
}) {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {items.map((item) => (
          <View key={item.character} style={{ width: "20%", padding: 4 }}>
            <Pressable
              onPress={() =>
                onPress({
                  type: category,
                  character: item.character,
                  romaji: item.romaji,
                  group: item.group,
                } as KanaDetail)
              }
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flex: 1 })}
            >
              <View className="rounded-2xl bg-surface-light dark:bg-surface-dark items-center justify-center py-3 gap-1">
                <Text
                  style={{ fontSize: 28, fontWeight: "700" }}
                  className="text-ink-light dark:text-ink-dark"
                >
                  {item.character}
                </Text>
                <Text className="text-xs text-muted">{item.romaji}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Kanji card ──────────────────────────────────────────────────────────────

type KanjiItemRaw = {
  id: string;
  character: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string[];
  strokeCount: number;
  examples?: { word: string; reading: string; meaning: string }[];
};

function KanjiCard({
  item,
  onPress,
}: {
  item: KanjiItemRaw;
  onPress: (item: ContentDetail) => void;
}) {
  return (
    <View style={{ width: "25%", padding: 4 }}>
      <Pressable
        onPress={() => onPress({ type: "kanji", ...item } as KanjiDetail)}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, flex: 1 })}
      >
        <View className="rounded-2xl bg-surface-light dark:bg-surface-dark items-center justify-center px-2 py-3 gap-1">
          <Text
            style={{ fontSize: 32, fontWeight: "700" }}
            className="text-ink-light dark:text-ink-dark"
          >
            {item.character}
          </Text>
          <Text className="text-xs text-muted text-center" numberOfLines={1}>
            {item.meaning[0]}
          </Text>
          <Text className="text-xs text-muted/60 text-center" numberOfLines={1}>
            {[...item.onyomi, ...item.kunyomi].slice(0, 2).join("・")}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// ─── Vocab row ───────────────────────────────────────────────────────────────

type VocabItemRaw = {
  id: string;
  word: string;
  reading: string;
  meaning: string | string[];
  partOfSpeech?: string;
};

function VocabRow({
  item,
  onPress,
}: {
  item: VocabItemRaw;
  onPress: (item: ContentDetail) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress({ type: "vocab", ...item } as VocabDetail)}
      className="mx-6 mb-2 px-4 py-3 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center gap-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="items-center" style={{ minWidth: 56 }}>
        <Text
          style={{ fontSize: 20, fontWeight: "700" }}
          className="text-ink-light dark:text-ink-dark"
        >
          {item.word}
        </Text>
        <Text className="text-xs text-muted">{item.reading}</Text>
      </View>
      <View className="w-px h-8 bg-muted/15" />
      <Text
        className="text-sm text-ink-light dark:text-ink-dark flex-1"
        numberOfLines={2}
      >
        {norm(item.meaning)}
      </Text>
      {item.partOfSpeech ? (
        <Text className="text-xs text-muted/60">{item.partOfSpeech}</Text>
      ) : null}
    </Pressable>
  );
}

// ─── Grammar row ─────────────────────────────────────────────────────────────

type GrammarItemRaw = {
  id: string;
  pattern: string | string[];
  meaning: string | string[];
  example?: string;
  exampleTranslation?: string;
};

function GrammarRow({
  item,
  onPress,
}: {
  item: GrammarItemRaw;
  onPress: (item: ContentDetail) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress({ type: "grammar", ...item } as GrammarDetail)}
      className="mx-6 mb-2 px-4 py-3.5 rounded-2xl bg-surface-light dark:bg-surface-dark gap-1.5"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text
        style={{ fontSize: 16, fontWeight: "700" }}
        className="text-ink-light dark:text-ink-dark"
      >
        {norm(item.pattern)}
      </Text>
      <Text className="text-sm text-muted">{norm(item.meaning)}</Text>
      {item.example ? (
        <View className="mt-0.5 gap-0.5">
          <Text className="text-xs text-ink-light/70 dark:text-ink-dark/70">
            {item.example}
          </Text>
          <Text className="text-xs text-muted/60">
            {item.exampleTranslation}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// ─── Category tabs ───────────────────────────────────────────────────────────

function CategoryTabs({
  active,
  onChange,
}: {
  active: Category;
  onChange: (c: Category) => void;
}) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const isActive = item.key === active;
          return (
            <Pressable
              onPress={() => onChange(item.key)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: isActive ? "#D96E28" : "rgba(135,129,123,0.1)",
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: isActive ? "#FFFFFF" : "#87817B" }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function BrowseScreen() {
  const [category, setCategory] = useState<Category>("hiragana");
  const [selected, setSelected] = useState<ContentDetail | null>(null);

  const handleCategoryChange = useCallback((c: Category) => setCategory(c), []);
  const handlePress = useCallback(
    (item: ContentDetail) => setSelected(item),
    [],
  );
  const handleClose = useCallback(() => setSelected(null), []);

  const counts: Record<Category, number> = {
    hiragana: hiraganaData.length,
    katakana: katakanaData.length,
    kanji: kanjiData.length,
    vocab: vocabData.length,
    grammar: grammarData.length,
  };

  const renderContent = () => {
    switch (category) {
      case "hiragana":
      case "katakana": {
        const raw = (
          category === "hiragana" ? hiraganaData : katakanaData
        ) as KanaItemRaw[];
        const groupMap = new Map<string, KanaItemRaw[]>();
        for (const item of raw) {
          const g = item.group ?? "other";
          if (!groupMap.has(g)) groupMap.set(g, []);
          groupMap.get(g)!.push(item);
        }
        const sections = [...groupMap.entries()].map(([key, data]) => ({
          title: GROUP_LABELS[key] ?? key,
          data: [data] as KanaItemRaw[][],
        }));
        return (
          <SectionList
            sections={sections}
            keyExtractor={(_, i) => String(i)}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderSectionHeader={({ section }) => (
              <SectionHeader title={section.title} />
            )}
            renderItem={({ item }) => (
              <KanaGrid
                items={item}
                onPress={handlePress}
                category={category}
              />
            )}
          />
        );
      }

      case "kanji": {
        const sorted = [...kanjiData as KanjiItemRaw[]].sort((a, b) => a.strokeCount - b.strokeCount);
        const buckets: { title: string; min: number; max: number }[] = [
          { title: "Simple  ·  1–4 strokes", min: 1, max: 4 },
          { title: "Intermediate  ·  5–7 strokes", min: 5, max: 7 },
          { title: "Complex  ·  8+ strokes", min: 8, max: 99 },
        ];
        const sections = buckets
          .map(({ title, min, max }) => ({
            title,
            data: [sorted.filter((k) => k.strokeCount >= min && k.strokeCount <= max)],
          }))
          .filter((s) => s.data[0].length > 0);
        return (
          <SectionList
            sections={sections}
            keyExtractor={(_, i) => String(i)}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderSectionHeader={({ section }) => (
              <SectionHeader title={section.title} />
            )}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 12 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {item.map((k: KanjiItemRaw) => (
                    <KanjiCard key={k.id} item={k} onPress={handlePress} />
                  ))}
                </View>
              </View>
            )}
          />
        );
      }

      case "vocab": {
        const groupMap = new Map<string, VocabItemRaw[]>();
        for (const item of vocabData as VocabItemRaw[]) {
          const g = item.partOfSpeech ?? "Other";
          if (!groupMap.has(g)) groupMap.set(g, []);
          groupMap.get(g)!.push(item);
        }
        const sections = [...groupMap.entries()].map(([title, data]) => ({
          title,
          data: [...data].sort((a, b) => a.reading.length - b.reading.length),
        }));
        return (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
            renderSectionHeader={({ section }) => (
              <SectionHeader title={section.title} />
            )}
            renderItem={({ item }) => (
              <VocabRow item={item} onPress={handlePress} />
            )}
          />
        );
      }

      case "grammar": {
        const sorted = [...grammarData as GrammarItemRaw[]].sort(
          (a, b) => norm(a.pattern).length - norm(b.pattern).length
        );
        return (
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <GrammarRow item={item} onPress={handlePress} />
            )}
          />
        );
      }
    }
  };

  const activeLabel = CATEGORIES.find((c) => c.key === category)?.label ?? "";

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
      <View className="px-6 pb-1 flex-row items-baseline gap-2">
        <Text className="text-xl font-bold text-ink-light dark:text-ink-dark">
          {activeLabel}
        </Text>
        <Text className="text-sm text-muted">{counts[category]} items</Text>
      </View>

      <CategoryTabs active={category} onChange={handleCategoryChange} />

      {renderContent()}

      <ContentDetailSheet item={selected} onClose={handleClose} />
    </SafeAreaView>
  );
}
