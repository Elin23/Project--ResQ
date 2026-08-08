import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = {
  onNotificationsPress: () => void;
};

export default function OrganizationDashboardHeader({ onNotificationsPress }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="فتح التنبيهات"
        hitSlop={10}
        onPress={onNotificationsPress}
        style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
      >
        <Ionicons name="notifications-outline" size={24} color={COLORS.brownMuted} />
        <View style={styles.notificationDot} />
      </Pressable>

      <View style={styles.identityRow}>
        <View style={styles.textWrap}>
          <AppText size={FONT_SIZES.body} weight="medium" style={styles.greeting}>
            مرحباً، جمعية الرفق 👋
          </AppText>
          <AppText size={FONT_SIZES.caption} color={COLORS.successDark}>
            جمعية معتمدة
          </AppText>
        </View>

        <View style={styles.avatarWrap}>
          <Image
            source={require("@/assets/images/organizations/org-logo.png")}
            style={styles.avatar}
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={12} color={COLORS.white} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  notificationButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
  },
  notificationDot: {
    position: "absolute",
    top: 7,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  pressed: { opacity: 0.72 },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  textWrap: { alignItems: "flex-end" },
  greeting: { textAlign: "right", writingDirection: "rtl" },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  verifiedBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
