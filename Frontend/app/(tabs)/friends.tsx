import { SkeletonBlock } from "@/components/skeleton-block";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { friendsApi } from "@/api";
import { useSessionStore } from "@/store/session.store";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";
import { LeaderboardEntry } from "@/api/friends";

const RANK_MEDAL = ["🥇", "🥈", "🥉"];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never studied";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function InitialsCircle({ name, isMe }: { name: string; isMe: boolean }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isMe
          ? "rgba(217,110,40,0.12)"
          : "rgba(102,64,196,0.1)",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: isMe ? "#D96E28" : "#6640C4",
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

export default function FriendsScreen() {
  const user = useSessionStore((s) => s.user);
  const queryClient = useQueryClient();

  const [friendCode, setFriendCode] = useState("");
  const [removeTarget, setRemoveTarget] = useState<LeaderboardEntry | null>(
    null,
  );

  const { data: codeData, isLoading: codeLoading } = useQuery({
    queryKey: ["friend-code"],
    queryFn: friendsApi.code,
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: friendsApi.leaderboard,
  });

  const { mutate: addFriend, isPending: isAdding } = useMutation({
    mutationFn: () => friendsApi.add(friendCode.trim().toUpperCase()),
    onSuccess: () => {
      setFriendCode("");
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Friend added!");
    },
    onError: () => {
      toast.error("Invalid code or already friends.");
    },
  });

  const { mutate: removeFriend, isPending: isRemoving } = useMutation({
    mutationFn: (friendId: string) => friendsApi.remove(friendId),
    onSuccess: () => {
      setRemoveTarget(null);
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Friend removed.");
    },
    onError: () => {
      toast.error("Failed to remove friend.");
    },
  });

  const handleCopyCode = useCallback(async () => {
    if (!codeData?.code) return;
    await Clipboard.setStringAsync(codeData.code);
    toast.success("Code copied!");
  }, [codeData?.code]);

  const handleFriendCodeChange = useCallback((text: string) => {
    setFriendCode(text.toUpperCase());
  }, []);

  const handleAddFriend = useCallback(() => {
    if (friendCode.trim().length < 6) return;
    addFriend();
  }, [friendCode, addFriend]);

  const handleRemovePress = useCallback((entry: LeaderboardEntry) => {
    setRemoveTarget(entry);
  }, []);

  const handleRemoveCancel = useCallback(() => {
    setRemoveTarget(null);
  }, []);

  const handleRemoveConfirm = useCallback(() => {
    if (removeTarget) removeFriend(removeTarget.userId);
  }, [removeTarget, removeFriend]);

  const leaderboard = leaderboardData?.leaderboard ?? [];
  const isLoading = codeLoading || leaderboardLoading;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
      >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* My friend code */}
        {codeLoading ? (
          <SkeletonBlock className="mx-6 mt-4 mb-4 h-20" />
        ) : (
          <View className="mx-6 mt-4 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark">
            <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
              Your Code
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark tracking-widest">
                {codeData?.code ?? "------"}
              </Text>
              <Pressable
                onPress={handleCopyCode}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: "rgba(217,110,40,0.1)",
                })}
              >
                <Ionicons name="copy-outline" size={15} color="#D96E28" />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: "#D96E28" }}
                >
                  Copy
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Add friend */}
        <View className="mx-6 mb-4 px-4 py-4 rounded-2xl bg-surface-light dark:bg-surface-dark gap-3">
          <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
            Add Friend
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 h-11 px-3 rounded-xl border-2 border-transparent bg-bg-light dark:bg-bg-dark text-ink-light dark:text-ink-dark text-base focus:border-primary-light dark:focus:border-primary-dark"
              placeholder="Enter code (e.g. AB3F7Q)"
              placeholderTextColor="#87817B"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              value={friendCode}
              onChangeText={handleFriendCodeChange}
              onSubmitEditing={handleAddFriend}
              returnKeyType="done"
            />
            <Pressable
              onPress={handleAddFriend}
              disabled={isAdding || friendCode.trim().length < 6}
              className="h-11 px-4 rounded-xl bg-primary-light dark:bg-primary-dark items-center justify-center"
              style={({ pressed }) => ({
                opacity:
                  pressed || isAdding || friendCode.trim().length < 6 ? 0.6 : 1,
              })}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-sm font-semibold">Add</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Leaderboard label */}
        <View className="mx-6 mb-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
            Leaderboard
          </Text>
        </View>

        {isLoading ? (
          <View className="mx-6 gap-2">
            <SkeletonBlock className="h-16 rounded-2xl" />
            <SkeletonBlock className="h-16 rounded-2xl" />
            <SkeletonBlock className="h-16 rounded-2xl" />
          </View>
        ) : leaderboard.length === 0 ? (
          <View className="mx-6 px-4 py-8 rounded-2xl bg-surface-light dark:bg-surface-dark items-center gap-2">
            <Text style={{ fontSize: 32 }}>👥</Text>
            <Text className="text-sm font-semibold text-ink-light dark:text-ink-dark">
              No friends yet
            </Text>
            <Text className="text-xs text-muted text-center">
              Share your code above to start competing
            </Text>
          </View>
        ) : (
          <View className="mx-6 rounded-2xl bg-surface-light dark:bg-surface-dark overflow-hidden">
            {leaderboard.map((entry, index) => {
              const isMe = entry.userId === user?.id;
              const medal = RANK_MEDAL[index];

              return (
                <View key={entry.userId}>
                  {index > 0 && <View className="h-px bg-muted/10 ml-16" />}
                  <View
                    className="flex-row items-center px-4 py-3"
                    style={
                      isMe
                        ? { backgroundColor: "rgba(217,110,40,0.06)" }
                        : undefined
                    }
                  >
                    {/* Rank */}
                    <View className="w-8 items-center">
                      {medal ? (
                        <Text style={{ fontSize: 18 }}>{medal}</Text>
                      ) : (
                        <Text className="text-sm font-bold text-muted">
                          {index + 1}
                        </Text>
                      )}
                    </View>

                    {/* Avatar */}
                    <View className="ml-2 mr-3">
                      <InitialsCircle name={entry.name} isMe={isMe} />
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-sm font-semibold text-ink-light dark:text-ink-dark"
                          numberOfLines={1}
                        >
                          {isMe ? "You" : entry.name}
                        </Text>
                        <View
                          className="px-1.5 py-0.5 rounded-md"
                          style={{ backgroundColor: "rgba(135,129,123,0.15)" }}
                        >
                          <Text className="text-xs font-medium text-muted">
                            {entry.jlptLevel ?? "N5"}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-muted mt-0.5">
                        {timeAgo(entry.lastStudiedAt)}
                      </Text>
                    </View>

                    {/* Streak */}
                    <View className="flex-row items-center gap-1 mr-2">
                      <Text style={{ fontSize: 14 }}>🔥</Text>
                      <Text className="text-sm font-bold text-ink-light dark:text-ink-dark">
                        {entry.currentStreak ?? 0}
                      </Text>
                    </View>

                    {/* Remove (non-self only) */}
                    {!isMe && (
                      <Pressable
                        onPress={() => handleRemovePress(entry)}
                        hitSlop={8}
                        style={({ pressed }) => ({
                          opacity: pressed ? 0.5 : 1,
                        })}
                      >
                        <Ionicons
                          name="person-remove-outline"
                          size={16}
                          color="#87817B"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Remove confirmation */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent className="bg-bg-light dark:bg-bg-dark border-0 rounded-3xl p-0 gap-0 overflow-hidden">
          <View className="items-center px-6 pt-8 pb-6 gap-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(220,38,38,0.1)" }}
            >
              <Ionicons
                name="person-remove-outline"
                size={28}
                color="#DC2626"
              />
            </View>
            <AlertDialogHeader className="items-center gap-1">
              <AlertDialogTitle className="text-ink-light dark:text-ink-dark text-xl font-bold text-center">
                Remove friend?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted text-sm text-center leading-5">
                {removeTarget?.name} will be removed from your leaderboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </View>
          <View className="flex-row border-t border-muted/10">
            <AlertDialogCancel
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent active:bg-muted/10"
              onPress={handleRemoveCancel}
            >
              <Text className="text-base font-medium text-ink-light dark:text-ink-dark">
                Cancel
              </Text>
            </AlertDialogCancel>
            <View className="w-px bg-muted/10" />
            <AlertDialogAction
              className="flex-1 h-auto py-4 rounded-none border-0 items-center justify-center bg-transparent"
              onPress={handleRemoveConfirm}
              disabled={isRemoving}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: isRemoving ? "#87817B" : "#DC2626" }}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Text>
            </AlertDialogAction>
          </View>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
