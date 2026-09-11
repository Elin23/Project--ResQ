import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import RemoteImage from "@/src/components/ui/RemoteImage";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

type Props = {
  name: string;
  logoUrl?: string;
  locationLabel?: string;
  verified?: boolean;
  verifiedAt?: string;
};

function verifiedDateLabel(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("ar-SY", { year: "numeric", month: "long" }).format(date);
}

export default function OrganizationIdentityCard({ name, logoUrl, locationLabel, verified = false, verifiedAt }: Props) {
  const dateLabel = verifiedDateLabel(verifiedAt);
  return (
    <View style={styles.outer}>
      <View style={styles.identity}>
        <View style={styles.logoWrap}>
          <RemoteImage uri={logoUrl} style={styles.logo} accessibilityLabel="شعار الجمعية" />
          {verified ? <View style={styles.verified}><Ionicons name="checkmark" size={ICON_SIZES.xs} color={COLORS.textInverse} /></View> : null}
        </View>

        <View style={styles.identityText}>
          <AppText variant="h2" weight="bold" numberOfLines={2} style={styles.fullWidth}>{name}</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.fullWidth}>{locationLabel || "الموقع غير منشور بعد"}</AppText>
          <View style={styles.metaRow}>
            <View style={[styles.badge, !verified && styles.pendingBadge]}>
              <Ionicons name={verified ? "shield-checkmark-outline" : "time-outline"} size={ICON_SIZES.xs} color={verified ? COLORS.success : COLORS.warning} />
              <AppText variant="caption" weight="medium" color={verified ? COLORS.success : COLORS.warning}>{verified ? "جمعية معتمدة" : "بانتظار الاعتماد"}</AppText>
            </View>
            {verified && dateLabel ? <AppText variant="caption" color={COLORS.textSecondary}>معتمدة منذ {dateLabel}</AppText> : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { paddingHorizontal: LAYOUT.screenPadding, paddingTop: SPACING.lg },
  identity: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.lg },
  logoWrap: { position: "relative" },
  logo: { width: 76, height: 76, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.surfaceElevated },
  verified: { position: "absolute", start: -1, bottom: 3, width: 24, height: 24, borderRadius: RADIUS.full, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surfaceElevated, alignItems: "center", justifyContent: "center" },
  identityText: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  fullWidth: { width: "100%" },
  metaRow: { width: "100%", flexDirection: "row", direction: "rtl", alignItems: "center", flexWrap: "wrap", gap: SPACING.sm },
  badge: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, backgroundColor: COLORS.successSoft, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  pendingBadge: { backgroundColor: COLORS.surfaceSubtle },
});
