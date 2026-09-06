import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

type Props = { name: string };

/** بطاقة هوية الجمعية في أعلى شاشة الحساب — تقابل بطاقة هوية المستخدم بشعار وحالة اعتماد. */
export default function OrganizationIdentityCard({ name }: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.identity}>
        <View style={styles.logoWrap}>
          <Image source={require("@/assets/images/organizations/org-logo.png")} style={styles.logo} />
          <View style={styles.verified}>
            <Ionicons name="checkmark" size={ICON_SIZES.xs} color={COLORS.textInverse} />
          </View>
        </View>

        <View style={styles.identityText}>
          <AppText variant="h2" weight="bold" numberOfLines={2} style={styles.fullWidth}>{name}</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.fullWidth}>دمشق، سوريا</AppText>
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={ICON_SIZES.xs} color={COLORS.success} />
              <AppText variant="caption" weight="medium" color={COLORS.success}>جمعية معتمدة</AppText>
            </View>
            <AppText variant="caption" color={COLORS.textSecondary}>معتمدة منذ مارس 2025</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg },
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
  logoWrap: { position: "relative" },
  logo: { width: 76, height: 76, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.surfaceElevated },
  verified: { position: "absolute", start: -1, bottom: 3, width: 24, height: 24, borderRadius: RADIUS.full, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surfaceElevated, alignItems: "center", justifyContent: "center" },
  identityText: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  fullWidth: { width: "100%" },
  metaRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", flexWrap: "wrap", gap: SPACING.sm },
  badge: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, backgroundColor: COLORS.successSoft, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
});
