import "../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useRootNavigationState, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Toaster } from "sonner-native";

import { PortalHost } from "@rn-primitives/portal";

import { useColorScheme } from "nativewind";
import { authClient } from "@/lib/auth-client";
import { useSessionStore } from "@/store/session.store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const unstable_settings = {
  anchor: "(auth)",
};

function AuthGuard() {
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  if (!navigationState?.key || isPending) return null;

  const inAuthGroup = segments[0] === "(auth)";

  if (!session && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (session && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }
  return null;
}

function SessionSync() {
  const { data: session } = authClient.useSession();
  const { setUser, clearSession } = useSessionStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      });
    } else {
      clearSession();
    }
  }, [session, setUser, clearSession]);

  return null;
}

function AppContent() {
  const { colorScheme } = useColorScheme();
  const { isPending, error } = authClient.useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(id);
  }, []);

  if (isPending && !error && !timedOut) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colorScheme === "dark" ? "#1A1A1A" : "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#D96E28" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <AuthGuard />
      <SessionSync />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Toaster />
      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
