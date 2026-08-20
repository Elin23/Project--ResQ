import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, DENSITY, RADIUS, SPACING } from "@/src/theme";

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ width = "100%", height, radius = RADIUS.md, style }: SkeletonBlockProps) {
  return <View accessibilityElementsHidden style={[styles.block, { width, height, borderRadius: radius }, style]} />;
}

type SkeletonCardProps = {
  image?: boolean;
  lines?: number;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonCard({ image = true, lines = 3, compact = false, style }: SkeletonCardProps) {
  return (
    <View style={[styles.card, compact && styles.cardCompact, style]} accessibilityElementsHidden>
      {image ? <SkeletonBlock height={compact ? 96 : 132} radius={RADIUS.lg} /> : null}
      <View style={styles.lines}>
        <SkeletonBlock width="58%" height={18} radius={RADIUS.sm} />
        {Array.from({ length: Math.max(0, lines - 1) }).map((_, index) => (
          <SkeletonBlock
            key={index}
            width={index === lines - 2 ? "72%" : "92%"}
            height={12}
            radius={RADIUS.sm}
          />
        ))}
      </View>
    </View>
  );
}

type SkeletonListProps = {
  count?: number;
  image?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonList({ count = 3, image = true, compact = false, style }: SkeletonListProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel="جاري تحميل المحتوى" style={[styles.list, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} image={image} compact={compact} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: COLORS.surfaceMuted },
  card: {
    width: "100%",
    padding: DENSITY.cardPadding,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.surfaceElevated,
    gap: SPACING.md,
  },
  cardCompact: { padding: DENSITY.compactCardPadding, gap: SPACING.sm },
  lines: { gap: SPACING.sm },
  list: { width: "100%", gap: SPACING.md },
});
