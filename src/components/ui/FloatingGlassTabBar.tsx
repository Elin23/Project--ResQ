import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COLORS,
  CONTROL_SIZES,
  DENSITY,
  ICON_SIZES,
  NAVIGATION,
  RADIUS,
  SHADOWS,
  SPACING,
} from "@/src/theme";
import AppText from "./AppText";

type IconName = keyof typeof Ionicons.glyphMap;

type TabVisual = {
  label: string;
  icon: IconName;
  iconFocused?: IconName;
};

type Props = BottomTabBarProps & {
  tabs: Record<string, TabVisual>;
};

type WebGlassStyle = ViewStyle & {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
};

/**
 * Only the web build has a real backdrop blur, so it is the only platform that
 * may keep a translucent surface. On native the bar paints opaque instead.
 */
const WEB_GLASS_STYLE: WebGlassStyle = {
  backgroundColor: COLORS.glassSurface,
  backdropFilter: "blur(22px) saturate(155%)",
  WebkitBackdropFilter: "blur(22px) saturate(155%)",
};

/**
 * Arabic-first persistent navigation.
 *
 * Route order is rendered RTL, so the first/highest-priority destination sits
 * on the right. Focus never adds a pill, boxed background or per-tab marker:
 * hierarchy comes from semantic color and icon weight alone, while a hairline
 * border runs across the whole bar. This prevents Arabic labels from competing
 * with oversized active decoration.
 *
 * Layering rules (they are what keep stray rectangles off the bar):
 * - The surface is a single opaque, rounded view. Translucent layers used to
 *   let scrolled screen content read through the bar, and white `opacity`
 *   overlays escape the rounded clip on Android and paint as square patches.
 * - Elevation lives on that rounded, opaque view. Elevation on the transparent
 *   host had no radius to follow, so Android drew a rectangular shadow behind
 *   the pill.
 * - iOS clips a view's own shadow when `overflow: hidden` is set, so it gets a
 *   sibling caster underneath; that sibling is opaque, because a transparent
 *   view casts no shadow at all.
 */
export default function FloatingGlassTabBar({ state, descriptors, navigation, tabs }: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const hideForFocusedFlow = /\/(privacy-policy|terms-and-conditions)$/.test(pathname)
    || /\/(create|edit|apply)(?:\/|$)/.test(pathname)
    || pathname.includes("/checkout");
  if (hideForFocusedFlow) return null;
  const visibleRoutes = state.routes.filter((route) => tabs[route.name]);
  const bottom = Math.max(insets.bottom, NAVIGATION.bottomInsetMin);

  return (
    <View pointerEvents="box-none" style={[styles.host, { bottom }]}>
      {Platform.OS === "ios" ? <View pointerEvents="none" style={styles.shadowLayer} /> : null}
      <View style={[styles.material, Platform.OS === "web" && WEB_GLASS_STYLE]}>
        <View pointerEvents="none" style={styles.topBorder} />

        {visibleRoutes.map((route) => {
          const index = state.routes.findIndex((candidate) => candidate.key === route.key);
          const focused = state.index === index;
          const descriptor = descriptors[route.key];
          const visual = tabs[route.name];
          const accessibilityLabel = descriptor.options.tabBarAccessibilityLabel ?? visual.label;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              if (Platform.OS !== "web") void Haptics.selectionAsync().catch(() => undefined);
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={accessibilityLabel}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={onLongPress}
              hitSlop={4}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <View style={styles.iconSlot}>
                <Ionicons
                  name={focused ? visual.iconFocused ?? visual.icon : visual.icon}
                  size={focused ? ICON_SIZES.lg : 22}
                  color={focused ? COLORS.navActive : COLORS.iconMuted}
                />
              </View>
              <AppText
                variant="caption"
                weight={focused ? "bold" : "medium"}
                color={focused ? COLORS.navActive : COLORS.textMuted}
                align="center"
                numberOfLines={2}
                maxFontSizeMultiplier={1.4}
                style={styles.label}
              >
                {visual.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: NAVIGATION.horizontalInset,
    right: NAVIGATION.horizontalInset,
    zIndex: 50,
    alignItems: "center",
  },
  shadowLayer: {
    // No left/right: the host centers absolute children, which keeps the caster
    // aligned with the bar once maxWidth caps it on wide screens.
    position: "absolute",
    top: 0,
    width: "100%",
    maxWidth: NAVIGATION.maxWidth,
    height: CONTROL_SIZES.tabBar,
    borderRadius: NAVIGATION.barRadius,
    backgroundColor: COLORS.glassSurfaceSolid,
    ...SHADOWS.lg,
  },
  material: {
    width: "100%",
    maxWidth: NAVIGATION.maxWidth,
    minHeight: DENSITY.touchTargetMin,
    height: CONTROL_SIZES.tabBar,
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "stretch",
    justifyContent: "space-around",
    gap: SPACING.xxs,
    paddingHorizontal: NAVIGATION.barHorizontalPadding,
    paddingVertical: NAVIGATION.barVerticalPadding,
    borderRadius: NAVIGATION.barRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glassSurfaceSolid,
    ...Platform.select({
      // iOS casts its shadow through the sibling layer above.
      ios: {},
      android: { ...SHADOWS.lg, elevation: 12 },
      default: SHADOWS.lg,
    }),
  },
  topBorder: {
    // Spans the full bar; the rounded clip tapers it at both corners. Solid
    // colour rather than an `opacity` overlay, which Android would promote to
    // its own layer and paint outside the rounded corners.
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  item: {
    minWidth: DENSITY.touchTargetMin,
    minHeight: NAVIGATION.itemMinHeight,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xxs,
    position: "relative",
  },
  itemPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  iconSlot: {
    width: NAVIGATION.iconSlotSize,
    height: NAVIGATION.iconSlotSize,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 0,
    lineHeight: 15,
    maxWidth: "100%",
  },
});
