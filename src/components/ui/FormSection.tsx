import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { COLORS, DENSITY, RADIUS } from "@/src/theme";
import Card from "./Card";
import ScreenSection from "./ScreenSection";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  compact?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Canonical grouped form composition.
 * Keeps Arabic forms readable by separating topics without scattering local
 * margins, card paddings and headings across feature screens.
 */
export default function FormSection({
  children,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  compact = false,
  cardStyle,
  style,
}: Props) {
  return (
    <ScreenSection
      title={title}
      subtitle={subtitle}
      actionLabel={actionLabel}
      onActionPress={onActionPress}
      style={style}
    >
      <Card
        padding={compact ? DENSITY.compactCardPadding : DENSITY.cardPadding}
        radius={RADIUS.lg}
        backgroundColor={COLORS.surfaceElevated}
        borderColor={COLORS.divider}
        style={[styles.card, cardStyle]}
      >
        {children}
      </Card>
    </ScreenSection>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: DENSITY.controlGap,
  },
});
