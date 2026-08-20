import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

type Props = {
  onNotificationsPress: () => void;
};

export default function OrganizationDashboardHeader({ onNotificationsPress }: Props) {
  return (
    <>
      <ScreenHeader
        title="لوحة الجمعية"
        subtitle="إدارة الحالات والعمليات اليومية"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="فتح التنبيهات"
            hitSlop={8}
            onPress={onNotificationsPress}
            style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={ICON_SIZES.md} color={COLORS.icon} />
            <View style={styles.notificationDot} />
          </Pressable>
        }
      />

      <View style={styles.identityOuter}>
        <View style={styles.identityRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("@/assets/images/organizations/org-logo.png")}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={COLORS.textInverse} />
            </View>
          </View>

          <View style={styles.textWrap}>
            <AppText variant="h3" weight="bold">جمعية الرفق</AppText>
            <View style={styles.statusRow}>
              <Ionicons name="shield-checkmark-outline" size={ICON_SIZES.xs} color={COLORS.successDark} />
              <AppText variant="caption" weight="medium" color={COLORS.successDark}>جمعية معتمدة</AppText>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.surfaceElevated,
  },
  pressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
  identityOuter: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg },
  identityRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceElevated,
  },
  textWrap: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  statusRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceElevated,
  },
  verifiedBadge: {
    position: "absolute",
    left: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.surfaceElevated,
  },
});
