import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/session.store";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export function TabHeader() {
  const user = useSessionStore((s) => s.user);
  const router = useRouter();
  const queryClient = useQueryClient();
  const firstName = user?.name?.split(" ")[0] ?? "There";
  const [signOutVisible, setSignOutVisible] = useState(false);

  const handleSignOutPress = useCallback(() => {
    setSignOutVisible(true);
  }, []);

  const handleSignOutCancel = useCallback(() => {
    setSignOutVisible(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    setSignOutVisible(false);
    await authClient.signOut();
    queryClient.setQueryData(["session"], null);
    queryClient.invalidateQueries({ queryKey: ["session"] });
    router.replace("/(auth)/login");
  }, [router, queryClient]);

  return (
    <>
    <View className="px-6 pt-4 pb-3 flex-row items-center justify-between bg-bg-light dark:bg-bg-dark">
      <View>
        <Text className="text-sm text-muted">{getGreeting()}</Text>
        <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark tracking-tight">
          {firstName}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="w-9 h-9 items-center justify-center rounded-full active:bg-surface-light dark:active:bg-surface-dark">
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(217,110,40,0.12)",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#D96E28" }}>
                {(firstName[0] ?? "U").toUpperCase()}
              </Text>
            </View>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            insets={{ right: 16 }}
            className="bg-surface-light dark:bg-surface-dark border-0 rounded-2xl mt-2 overflow-hidden"
            style={{ minWidth: 200 }}
          >
            <View className="px-4 py-3 gap-0.5">
              <Text
                className="text-sm font-semibold text-ink-light dark:text-ink-dark"
                numberOfLines={1}
              >
                {user?.name ?? ""}
              </Text>
              <Text className="text-xs text-muted" numberOfLines={1}>
                {user?.email ?? ""}
              </Text>
            </View>
            <View className="h-px bg-muted/10" />
            <DropdownMenuItem
              onPress={() => router.push("/(tabs)/profile")}
              className="mx-1 mt-1 rounded-xl px-3 py-3 gap-3"
            >
              <Ionicons name="person-outline" size={16} color="#87817B" />
              <Text className="text-sm font-medium text-ink-light dark:text-ink-dark">
                Profile
              </Text>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onPress={handleSignOutPress}
              className="mx-1 mb-1 rounded-xl px-3 py-3 gap-3"
            >
              <Ionicons name="log-out-outline" size={16} color="#DC2626" />
              <Text style={{ color: "#DC2626" }} className="text-sm font-medium">
                Sign out
              </Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>

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
            <Text className="text-base font-semibold" style={{ color: "#DC2626" }}>
              Sign out
            </Text>
          </AlertDialogAction>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}
