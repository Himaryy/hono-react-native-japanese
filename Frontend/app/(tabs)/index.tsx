import { SkeletonBlock } from "@/components/skeleton-block";
import { StatItem } from "@/components/stat-item";
import {
  lessonsApi,
  profileApi,
  progressApi,
  type Lesson,
  type Profile,
  type ReviewItem,
} from "@/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const router = useRouter();

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });

  const { data: reviewData } = useQuery<{ items: ReviewItem[] }>({
    queryKey: ["review-items"],
    queryFn: progressApi.reviewItems,
  });

  const { data: todayData, isLoading: lessonLoading } = useQuery<{
    lesson: Lesson;
  }>({
    queryKey: ["lesson", "today"],
    queryFn: lessonsApi.today,
  });

  const handleStartLesson = useCallback(() => {
    router.push("/(tabs)/lesson");
  }, [router]);

  const handleSeeFriends = useCallback(() => {
    router.push("/(tabs)/friends");
  }, [router]);

  const lesson = todayData?.lesson;
  const reviewCount = reviewData?.items.length ?? 0;
  const isLoading = profileLoading || lessonLoading;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-4 h-20" />
        ) : (
          <View className="mx-6 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center gap-4">
            <Text className="text-4xl leading-none">🔥</Text>
            <View className="flex-1">
              <Text className="text-xl font-bold text-ink-light dark:text-ink-dark">
                {profile?.currentStreak ?? 0}{" "}
                {profile?.currentStreak === 1 ? "day" : "days"}
              </Text>
              <Text className="text-sm text-muted">
                {profile?.currentStreak
                  ? "Keep it up"
                  : "Start your streak today"}
              </Text>
            </View>
            <View className="bg-primary-light dark:bg-primary-dark px-3 py-1.5 rounded-full">
              <Text className="text-white text-sm font-semibold">
                {profile?.jlptLevel ?? "N5"}
              </Text>
            </View>
          </View>
        )}

        {/* Progress */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-4 h-16" />
        ) : (
          <View className="mx-6 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
                N5 Progress
              </Text>
              <Text className="text-xs text-muted">
                Day {(profile?.currentDay ?? 1) - 1} of 165
              </Text>
            </View>
            <View className="h-2 rounded-full overflow-hidden bg-muted/20">
              <View
                className="h-2 rounded-full bg-primary-light dark:bg-primary-dark"
                style={{
                  width: `${Math.min((profile?.currentDay ?? 1) - 1, 165)}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Today's lesson CTA */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-4 h-40" />
        ) : lesson ? (
          <View className="mx-6 mb-4 p-5 rounded-2xl bg-primary-light dark:bg-primary-dark">
            <Text className="text-white/70 text-xs font-semibold mb-1 tracking-widest">
              DAY {lesson.day}
            </Text>
            <Text className="text-white text-xl font-bold mb-1 leading-tight">
              {lesson.title}
            </Text>
            <Text className="text-white/80 text-sm mb-5">
              {lesson.description}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-white/60 text-xs">
                ~{lesson.estimatedMinutes} min
              </Text>
              <Pressable
                className="bg-white px-5 py-2.5 rounded-xl"
                onPress={handleStartLesson}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <Text className="text-primary-light font-semibold text-sm">
                  Start Lesson
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Stats Row */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 h-20" />
        ) : (
          <View className="mx-6 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row">
            <StatItem label="Kanji" value={profile?.totalKanjiLearned ?? 0} />
            <View className="w-px bg-muted/20 my-1" />
            <StatItem label="Vocab" value={profile?.totalVocabLearned ?? 0} />
            <View className="w-px bg-muted/20 my-1" />
            <StatItem
              label="Days"
              value={profile?.currentDay ? profile.currentDay - 1 : 0}
            />
          </View>
        )}

        {/* Review Due */}
        {!isLoading && (
          <Pressable
            onPress={() => router.push("/(tabs)/review")}
            className="mx-6 mt-3 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center justify-between"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(102,64,196,0.1)" }}
              >
                <Ionicons name="refresh-outline" size={18} color="#6640C4" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
                  {reviewCount > 0
                    ? `${reviewCount} items due`
                    : "No reviews due"}
                </Text>
                <Text className="text-xs text-muted">
                  {reviewCount > 0
                    ? "Tap to start reviewing"
                    : "Complete a lesson to unlock"}
                </Text>
              </View>
            </View>
            {reviewCount > 0 ? (
              <View className="bg-accent-light dark:bg-accent-dark px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-semibold">Review</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={18} color="#87817B" />
            )}
          </Pressable>
        )}

        {/* Friends */}
        {!isLoading && (
          <Pressable
            onPress={handleSeeFriends}
            className="mx-6 mt-3 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center justify-between"
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View>
              <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
                Friends Activity
              </Text>
              <Text className="text-xs text-muted">
                See how your friends are doing
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#87817B" />
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
