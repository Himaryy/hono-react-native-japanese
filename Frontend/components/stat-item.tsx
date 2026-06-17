import { Text, View } from "react-native";

type Props = {
  label: string;
  value: number;
};

export function StatItem({ label, value }: Props) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark">
        {value}
      </Text>
      <Text className="text-xs text-muted uppercase tracking-wide">
        {label}
      </Text>
    </View>
  );
}
