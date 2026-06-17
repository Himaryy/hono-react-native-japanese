import { SkeletonBlock } from "@/components/skeleton-block";
import { StatItem } from "@/components/stat-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { profileApi, type Profile } from "@/api";
import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/session.store";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

const JLPT_LEVELS = ["N5", "N4", "N3"] as const;
type JLPTLevel = (typeof JLPT_LEVELS)[number];

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <View
      className="w-16 h-16 rounded-full items-center justify-center"
      style={{ backgroundColor: "rgba(217,110,40,0.12)" }}
    >
      <Text
        className="text-2xl font-bold"
        style={{ color: "#D96E28" }}
      >
        {initials}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const queryClient = useQueryClient();

  const [levelPickerVisible, setLevelPickerVisible] = useState(false);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>("N5");

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });

  const { mutate: updateLevel, isPending: isUpdating } = useMutation({
    mutationFn: (level: JLPTLevel) => profileApi.update({ jlptLevel: level }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setLevelPickerVisible(false);
    },
  });

  const handleChangeLevelPress = useCallback(() => {
    setSelectedLevel((profile?.jlptLevel as JLPTLevel) ?? "N5");
    setLevelPickerVisible(true);
  }, [profile?.jlptLevel]);

  const handleLevelSelect = useCallback((level: JLPTLevel) => {
    setSelectedLevel(level);
  }, []);

  const handleLevelConfirm = useCallback(() => {
    updateLevel(selectedLevel);
  }, [selectedLevel, updateLevel]);

  const handleLevelCancel = useCallback(() => {
    setLevelPickerVisible(false);
  }, []);

  const handleSignOutPress = useCallback(() => {
    setSignOutVisible(true);
  }, []);

  const handleSignOutCancel = useCallback(() => {
    setSignOutVisible(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    queryClient.setQueryData(["session"], null);
    queryClient.invalidateQueries({ queryKey: ["session"] });
    router.replace("/(auth)/login");
  }, [router, queryClient]);

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconRotation = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handleToggleTheme = useCallback(() => {
    iconRotation.value = withTiming(iconRotation.value + 360, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    toggleColorScheme();
  }, [toggleColorScheme, iconRotation]);

  const name = user?.name ?? "User";
  const currentLevel = (profile?.jlptLevel as JLPTLevel) ?? "N5";
  const progressPercent = Math.min((profile?.currentDay ?? 1) - 1, 100);

  return (
    <SafeAreaView
      edges={[]}
      className="flex-1 bg-bg-light dark:bg-bg-dark"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User identity card */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-4 h-24" />
        ) : (
          <View className="mx-6 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center gap-4">
            <InitialsAvatar name={name} />
            <View className="flex-1">
              <Text
                className="text-base font-bold text-ink-light dark:text-ink-dark"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text className="text-sm text-muted mt-0.5" numberOfLines={1}>
                {user?.email ?? ""}
              </Text>
              <View className="mt-2 self-start bg-primary-light dark:bg-primary-dark px-2.5 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  {currentLevel}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats row */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-4 h-20" />
        ) : (
          <View className="mx-6 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row">
            <StatItem label="Kanji" value={profile?.totalKanjiLearned ?? 0} />
            <View className="w-px bg-muted/20 my-1" />
            <StatItem label="Vocab" value={profile?.totalVocabLearned ?? 0} />
            <View className="w-px bg-muted/20 my-1" />
            <StatItem
              label="Streak"
              value={profile?.currentStreak ?? 0}
            />
            <View className="w-px bg-muted/20 my-1" />
            <StatItem
              label="Days"
              value={profile?.currentDay ? profile.currentDay - 1 : 0}
            />
          </View>
        )}

        {/* Progress bar */}
        {isLoading ? (
          <SkeletonBlock className="mx-6 mb-6 h-16" />
        ) : (
          <View className="mx-6 mb-6 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
                {currentLevel} Progress
              </Text>
              <Text className="text-xs text-muted">
                Day {(profile?.currentDay ?? 1) - 1} / 100
              </Text>
            </View>
            <View className="h-2 rounded-full overflow-hidden bg-muted/20">
              <View
                className="h-2 rounded-full bg-primary-light dark:bg-primary-dark"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        )}

        {/* Settings label */}
        <View className="mx-6 mb-2">
          <Text className="text-xs font-semibold text-muted tracking-widest uppercase">
            Settings
          </Text>
        </View>

        {/* Study Level row */}
        <Pressable
          onPress={handleChangeLevelPress}
          className="mx-6 mb-2 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center justify-between"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(102,64,196,0.1)" }}
            >
              <Ionicons name="school-outline" size={17} color="#6640C4" />
            </View>
            <Text className="text-sm font-medium text-ink-light dark:text-ink-dark">
              Study Level
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted">{currentLevel}</Text>
            <Ionicons name="chevron-forward" size={16} color="#87817B" />
          </View>
        </Pressable>

        {/* Theme toggle row */}
        <Pressable
          onPress={handleToggleTheme}
          className="mx-6 mb-2 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center justify-between"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(217,110,40,0.1)" }}
            >
              <Animated.View style={animatedIconStyle}>
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={17}
                  color="#D96E28"
                />
              </Animated.View>
            </View>
            <Text className="text-sm font-medium text-ink-light dark:text-ink-dark">
              Appearance
            </Text>
          </View>
          <Text className="text-sm text-muted">
            {isDark ? "Dark" : "Light"}
          </Text>
        </Pressable>

        {/* Sign out row */}
        <Pressable
          onPress={handleSignOutPress}
          className="mx-6 mb-2 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark flex-row items-center gap-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(220,38,38,0.1)" }}
          >
            <Ionicons name="log-out-outline" size={17} color="#DC2626" />
          </View>
          <Text
            className="text-sm font-medium"
            style={{ color: "#DC2626" }}
          >
            Sign out
          </Text>
        </Pressable>
      </ScrollView>

      {/* Level picker dialog */}
      <AlertDialog open={levelPickerVisible} onOpenChange={setLevelPickerVisible}>
        <AlertDialogContent className="bg-bg-light dark:bg-bg-dark border-0 rounded-3xl p-0 gap-0 overflow-hidden">
          <View className="px-6 pt-7 pb-2">
            <AlertDialogHeader className="gap-1">
              <AlertDialogTitle className="text-ink-light dark:text-ink-dark text-xl font-bold">
                Change study level
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted text-sm leading-5">
                Switching levels resets your progress to day 1.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </View>

          <View className="px-4 py-3 gap-1">
            {JLPT_LEVELS.map((level) => {
              const isSelected = selectedLevel === level;
              return (
                <Pressable
                  key={level}
                  onPress={() => handleLevelSelect(level)}
                  className="px-4 py-3.5 rounded-xl flex-row items-center justify-between"
                  style={({ pressed }) => ({
                    backgroundColor: isSelected
                      ? "rgba(102,64,196,0.1)"
                      : pressed
                      ? "rgba(135,129,123,0.08)"
                      : "transparent",
                  })}
                >
                  <Text
                    className={`text-base font-medium ${isSelected ? "" : "text-ink-light dark:text-ink-dark"}`}
                    style={isSelected ? { color: "#6640C4" } : undefined}
                  >
                    {level}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#6640C4" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View className="flex-row border-t border-muted/10">
            <AlertDialogCancel
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent active:bg-muted/10"
              onPress={handleLevelCancel}
            >
              <Text className="text-base font-medium text-ink-light dark:text-ink-dark">
                Cancel
              </Text>
            </AlertDialogCancel>
            <View className="w-px bg-muted/10" />
            <AlertDialogAction
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent"
              onPress={handleLevelConfirm}
              disabled={isUpdating}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: isUpdating ? "#87817B" : "#6640C4" }}
              >
                {isUpdating ? "Saving..." : "Confirm"}
              </Text>
            </AlertDialogAction>
          </View>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign out confirmation */}
      <AlertDialog open={signOutVisible} onOpenChange={setSignOutVisible}>
        <AlertDialogContent className="bg-bg-light dark:bg-bg-dark border-0 rounded-3xl p-0 gap-0 overflow-hidden">
          <View className="items-center px-6 pt-8 pb-6 gap-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(220,38,38,0.1)" }}
            >
              <Ionicons name="log-out-outline" size={28} color="#DC2626" />
            </View>
            <AlertDialogHeader className="items-center gap-1">
              <AlertDialogTitle className="text-ink-light dark:text-ink-dark text-xl font-bold text-center">
                Sign out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted text-sm text-center leading-5">
                You&apos;ll need to sign in again to access your progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </View>
          <View className="flex-row border-t border-muted/10">
            <AlertDialogCancel
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent active:bg-muted/10"
              onPress={handleSignOutCancel}
            >
              <Text className="text-base font-medium text-ink-light dark:text-ink-dark">
                Cancel
              </Text>
            </AlertDialogCancel>
            <View className="w-px bg-muted/10" />
            <AlertDialogAction
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent active:bg-red-50 dark:active:bg-red-900/20"
              onPress={handleSignOut}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: "#DC2626" }}
              >
                Sign out
              </Text>
            </AlertDialogAction>
          </View>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
