import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <Text className="text-ink-light dark:text-ink-dark">Lesson</Text>
    </SafeAreaView>
  );
}
