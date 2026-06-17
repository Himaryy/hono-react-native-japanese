import { HapticTab } from "@/components/haptic-tab";
import { TabHeader } from "@/components/tab-header";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

// Add tab names here to hide the shared header on them
const HIDE_HEADER_TABS = new Set(["profile"]);

export default function TabLayout() {
  const { colorScheme: scheme } = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const segments = useSegments();
  const activeTab = segments[1] as string | undefined;
  const showHeader = !HIDE_HEADER_TABS.has(activeTab ?? "");

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      {showHeader && <TabHeader />}

      <Tabs
        screenOptions={{
          tabBarButton: HapticTab,
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.muted,
            borderTopWidth: 0.5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="lesson"
          options={{
            title: "Learn",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="review"
          options={{
            title: "Review",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "refresh-circle" : "refresh-circle-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "library" : "library-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: "Friends",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ href: null }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
