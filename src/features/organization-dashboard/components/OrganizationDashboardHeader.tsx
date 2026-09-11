import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import RemoteImage from "@/src/components/ui/RemoteImage";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

type Props = {
  onNotificationsPress: () => void;
  unreadNotificationCount?: number;
  organizationName: string;
  logoUrl?: string;
  verified?: boolean;
  statusLabel?: string;
};

export default function OrganizationDashboardHeader({
  onNotificationsPress,
  unreadNotificationCount = 0,
  organizationName,
  logoUrl,
  verified = false,
  statusLabel = "قيد المراجعة",
}: Props) {
  const hasUnreadNotifications = unreadNotificationCount !== 0;
  return (
    <>
      <ScreenHeader
        title="لوحة الجمعية"
        subtitle="إدارة الحالات والعمليات اليومية"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hasUnreadNotifications ? `فتح التنبيهات، لديك ${unreadNotificationCount} غير مقروء` : "فتح التنبيهات"}
            hitSlop={8}
            onPress={onNotificationsPress}
            style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={ICON_SIZES.md} color={COLORS.icon} />
            {hasUnreadNotifications ? <View style={styles.notificationDot} /> : null}
          </Pressable>
        }
      />

      <View style={styles.identityOuter}>
        <View style={styles.identityRow}>
          <View style={styles.avatarWrap}>
            {logoUrl ? (
              <RemoteImage uri={logoUrl} style={styles.avatar} accessibilityLabel={`شعار ${organizationName}`} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="business-outline" size={ICON_SIZES.md} color={COLORS.primaryStrong} />
              </View>
            )}
            {verified ? (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color={COLORS.textInverse} />
              </View>
            ) : null}
          </View>

          <View style={styles.textWrap}>
            <AppText variant="h3" weight="bold">{organizationName}</AppText>
            <View style={styles.statusRow}>
              <Ionicons name={verified ? "shield-checkmark-outline" : "time-outline"} size={ICON_SIZES.xs} color={verified ? COLORS.successDark : COLORS.warning} />
              <AppText variant="caption" weight="medium" color={verified ? COLORS.successDark : COLORS.warning}>{statusLabel}</AppText>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  notificationButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceMuted },
  notificationDot: { position: "absolute", top: 9, right: 10, width: 6, height: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.danger, borderWidth: 1, borderColor: COLORS.surfaceElevated },
  pressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
  identityOuter: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg },
  identityRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, backgroundColor: COLORS.surfaceElevated },
  textWrap: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  statusRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  avatarWrap: { position: "relative" },
  avatar: { width: 52, height: 52, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.surfaceElevated },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
  verifiedBadge: { position: "absolute", left: -2, bottom: -2, width: 20, height: 20, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.secondary, borderWidth: 2, borderColor: COLORS.surfaceElevated },
});
