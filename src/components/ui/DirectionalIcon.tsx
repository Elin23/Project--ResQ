import { Ionicons } from "@expo/vector-icons";

import { COLORS, ICON_SIZES } from "@/src/theme";

type Direction = "back" | "forward" | "previous" | "next";

type Props = {
  direction: Direction;
  size?: number;
  color?: string;
};

const RTL_ICONS: Record<Direction, keyof typeof Ionicons.glyphMap> = {
  back: "arrow-forward-outline",
  forward: "arrow-back-outline",
  previous: "chevron-forward-outline",
  next: "chevron-back-outline",
};

export default function DirectionalIcon({
  direction,
  size = ICON_SIZES.md,
  color = COLORS.icon,
}: Props) {
  return <Ionicons name={RTL_ICONS[direction]} size={size} color={color} />;
}
