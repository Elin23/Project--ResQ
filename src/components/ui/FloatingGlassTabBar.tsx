import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COLORS,
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

const WEB_GLASS_STYLE: WebGlassStyle = {
  backdropFilter: "blur(22px) saturate(155%)",
  WebkitBackdropFilter: "blur(22px) saturate(155%)",
};

/**
 * Arabic-first persistent navigation.
 *
 * Route order is rendered RTL, so the first/highest-priority destination sits
 * on the right. Focus never adds a pill or boxed background: hierarchy comes
 * from semantic color, icon weight and a compact top indicator. This prevents
 * Arabic labels from competing with oversized active decoration.
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
      <View pointerEvents="none" style={styles.shadowLayer} />
      <View style={[styles.material, Platform.OS === "web" && WEB_GLASS_STYLE]}>
        <View pointerEvents="none" style={styles.tintLayer} />
        <View pointerEvents="none" style={styles.frostLayer} />
        <View pointerEvents="none" style={styles.topHighlight} />

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
              <View style={[styles.activeIndicator, !focused && styles.activeIndicatorHidden]} />
              <View style={styles.iconSlot}>
                <Ionicons
                  name={focused ? visual.iconFocused ?? visual.icon : visual.icon}
                  size={focused ? ICON_SIZES.lg : 22}
                  color={focused ? COLORS.primaryStrong : COLORS.iconMuted}
                />
              </View>
              <AppText
                variant="caption"
                weight={focused ? "bold" : "medium"}
                color={focused ? COLORS.primaryStrong : COLORS.textMuted}
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
    elevation: 20,
    alignItems: "center",
  },
  shadowLayer: {
    position: "absolute",
    top: 5,
    bottom: -4,
    left: 2,
    right: 2,
    maxWidth: NAVIGATION.maxWidth,
    alignSelf: "center",
    borderRadius: NAVIGATION.barRadius,
    backgroundColor: COLORS.transparent,
    ...SHADOWS.md,
  },
  material: {
    width: "100%",
    maxWidth: NAVIGATION.maxWidth,
    minHeight: DENSITY.touchTargetMin,
    height: 68,
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
    backgroundColor: Platform.select({
      ios: COLORS.glassSurfaceIos,
      android: COLORS.glassSurfaceAndroid,
      default: COLORS.glassSurface,
    }),
  },
  tintLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceElevated,
    opacity: Platform.OS === "android" ? 0.16 : 0.1,
  },
  frostLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceSubtle,
    opacity: 0.12,
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.white,
    opacity: 0.86,
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
    paddingTop: SPACING.xs,
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
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: NAVIGATION.activeIndicatorWidth,
    height: NAVIGATION.activeIndicatorHeight,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryStrong,
  },
  activeIndicatorHidden: { opacity: 0 },
});
