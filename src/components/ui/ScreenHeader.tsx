import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import {
  ARABIC_LAYOUT,
  COLORS,
  ICON_SIZES,
  LAYOUT,
  RADIUS,
  SPACING,
} from "@/src/theme";
import AppText from "./AppText";
import DirectionalIcon from "./DirectionalIcon";

type HeaderTone = "surface" | "transparent";
type TitleAlignment = "start" | "center";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  backAccessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  horizontalPadding?: number;
  tone?: HeaderTone;
  /** Arabic-first default: page titles begin at the logical start (right). */
  titleAlignment?: TitleAlignment;
  /** Adds a light divider/shadow only after the page content has scrolled. */
  elevated?: boolean;
};

/**
 * Canonical Arabic-first page header.
 *
 * Contract:
 * - one semantic surface and separator language across product/workspace pages;
 * - logical RTL ordering: back/leading on the right, trailing actions on the left;
 * - page titles are start-aligned by default instead of inheriting an English-style
 *   geometrically-centered title convention;
 * - title/subtitle share the same Arabic text edge;
 * - back/action affordances use the shared 44px touch target and semantic tokens;
 * - no screen may compensate header geometry with negative margins.
 */
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  backAccessibilityLabel = "العودة",
  style,
  horizontalPadding = LAYOUT.screenPadding,
  tone = "surface",
  titleAlignment = "start",
  elevated = false,
}: Props) {
  const centered = titleAlignment === "center";

  return (
    <View
      style={[
        styles.container,
        tone === "transparent" && styles.transparent,
        elevated && styles.elevated,
        { paddingHorizontal: horizontalPadding },
        style,
      ]}
    >
      {onBack ? (
        <View style={styles.leadingSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <DirectionalIcon direction="back" size={ICON_SIZES.md} color={COLORS.icon} />
          </Pressable>
        </View>
      ) : null}

      <View
        style={[styles.titles, centered && styles.titlesCentered]}
        accessibilityRole="header"
      >
        <AppText
          variant="h2"
          weight="bold"
          numberOfLines={2}
          style={[styles.titleText, centered && styles.centerText]}
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="bodySmall"
            color={COLORS.textSecondary}
            numberOfLines={2}
            style={[styles.subtitleText, centered && styles.centerText]}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right ? <View style={styles.trailingSlot}>{right}</View> : null}
    </View>
  );
}

const ACTION_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 68,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 0,
  },
  transparent: { backgroundColor: COLORS.transparent },
  elevated: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
    shadowColor: COLORS.ink,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 20,
  },
  leadingSlot: {
    width: ACTION_SIZE,
    minHeight: ACTION_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  trailingSlot: {
    minHeight: ACTION_SIZE,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceMuted,
  },
  titles: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
    justifyContent: "center",
  },
  titlesCentered: { alignItems: "center" },
  titleText: {
    width: "100%",
    textAlign: ARABIC_LAYOUT.textAlign,
    writingDirection: ARABIC_LAYOUT.direction,
  },
  subtitleText: {
    width: "100%",
    marginTop: SPACING.xxs,
    textAlign: ARABIC_LAYOUT.textAlign,
    writingDirection: ARABIC_LAYOUT.direction,
  },
  centerText: { textAlign: "center" },
  pressed: { opacity: 0.62, transform: [{ scale: 0.96 }] },
});

