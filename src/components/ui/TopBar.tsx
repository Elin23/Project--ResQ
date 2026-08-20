import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, CONTROL_SIZES, DENSITY, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  onNotificationsPress?: () => void;
  onSearchPress?: () => void;
  avatarUri?: string;
  avatarLabel?: string;
  onAvatarPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TopBar({
  onNotificationsPress,
  onSearchPress,
  avatarUri,
  avatarLabel = "فتح الحساب الشخصي",
  onAvatarPress,
  style,
}: Props) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, style]}>
      <View style={styles.container}>
        <View style={styles.identityGroup}>
          {onAvatarPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={avatarLabel}
              onPress={onAvatarPress}
              hitSlop={6}
              style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Ionicons name="person" size={ICON_SIZES.sm} color={COLORS.primaryStrong} />
                </View>
              )}
            </Pressable>
          ) : null}

          <View style={styles.logo} accessibilityRole="header" accessibilityLabel="ResQ">
            <AppText variant="h2" weight="bold">
              Res<AppText variant="h2" weight="bold" color={COLORS.primary}>Q</AppText>
            </AppText>
            <Ionicons name="paw" size={ICON_SIZES.lg} color={COLORS.icon} />
          </View>
        </View>

        <View style={styles.iconGroup}>
          <IconButton contained icon="search-outline" onPress={onSearchPress ?? (() => undefined)} accessibilityLabel="فتح البحث" disabled={!onSearchPress} />
          {onNotificationsPress ? (
            <IconButton contained icon="notifications-outline" onPress={onNotificationsPress} accessibilityLabel="فتح الإشعارات" />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: "100%", backgroundColor: COLORS.surfaceElevated },
  container: {
    minHeight: CONTROL_SIZES.topBar,
    paddingHorizontal: LAYOUT.screenPadding,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.surfaceElevated,
    borderBottomColor: COLORS.divider,
  },
  identityGroup: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  logo: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  iconGroup: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  avatarButton: {
    width: DENSITY.touchTargetMin,
    height: DENSITY.touchTargetMin,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: 36, height: 36, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  avatarFallback: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
