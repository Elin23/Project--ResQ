import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

type Props = { avatarUri: string; name: string; onEdit: () => void };

export default function ProfileHeader({ avatarUri, name, onEdit }: Props) {
  return (
    <>
      <ScreenHeader
        title="حسابي"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="تعديل الملف الشخصي"
            hitSlop={8}
            onPress={onEdit}
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
          >
            <Ionicons name="create-outline" size={ICON_SIZES.sm} color={COLORS.primaryStrong} />
            <AppText variant="label" weight="medium" color={COLORS.primaryStrong}>تعديل</AppText>
          </Pressable>
        }
      />

      <View style={styles.identityOuter}>
        <View style={styles.identity}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.verified}>
              <Ionicons name="checkmark" size={ICON_SIZES.xs} color={COLORS.textInverse} />
            </View>
          </View>

          <View style={styles.identityText}>
            <AppText variant="h2" weight="bold" numberOfLines={2} style={styles.fullWidth}>{name}</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.fullWidth}>دمشق، سوريا</AppText>
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark-outline" size={ICON_SIZES.xs} color={COLORS.successDark} />
                <AppText variant="caption" weight="medium" color={COLORS.successDark}>عضو موثوق</AppText>
              </View>
              <AppText variant="caption" color={COLORS.textSecondary}>عضو منذ مارس 2025</AppText>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  editButton: {
    minHeight: 38,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
  },
  pressed: { opacity: 0.65 },
  identityOuter: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg },
  identity: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 76, height: 76, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.primary },
  verified: { position: "absolute", left: -1, bottom: 3, width: 24, height: 24, borderRadius: RADIUS.full, backgroundColor: COLORS.successFill, borderWidth: 2, borderColor: COLORS.surfaceElevated, alignItems: "center", justifyContent: "center" },
  identityText: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  fullWidth: { width: "100%" },
  metaRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", flexWrap: "wrap", gap: SPACING.sm },
  badge: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, backgroundColor: COLORS.successSoft, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
});
