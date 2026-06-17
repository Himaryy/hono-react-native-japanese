import { View } from "react-native";

type Props = {
  className?: string;
  height?: number;
};

export function SkeletonBlock({ className = "", height }: Props) {
  return (
    <View
      className={`bg-surface-light dark:bg-surface-dark rounded-2xl opacity-60 ${className}`}
      style={height ? { height } : undefined}
    />
  );
}
