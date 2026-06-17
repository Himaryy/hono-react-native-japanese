import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useCallback } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconRotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const handlePress = useCallback(() => {
    iconRotation.value = withTiming(iconRotation.value + 360, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    toggleColorScheme();
  }, [toggleColorScheme, iconRotation]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={12}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark
          ? "rgba(245,242,239,0.08)"
          : "rgba(34,29,23,0.06)",
      })}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={18}
          color={isDark ? "#F5F2EF" : "#221D17"}
        />
      </Animated.View>
    </Pressable>
  );
}
