import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Share, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";
import type { MyReport } from "../types/myReport";

const labels = {
  review: { text: "قيد المراجعة", bg: COLORS.statusPendingLight },
  rescue: { text: "قيد الإنقاذ", bg: COLORS.orgStatBlueBg },
  rescued: { text: "تم الإنقاذ", bg: COLORS.successLight },
} as const;

type Props = {
  report: MyReport;
  onDetailsPress: () => void;
};

export default function MyReportCard({ report, onDetailsPress }: Props) {
  const label = labels[report.status];
  const steps = ["بلاغ", "استجابة", "علاج", "تم"];

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {report.imageUrl ? (
          <Image source={{ uri: report.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}><Ionicons name="image-outline" size={28} color={COLORS.brown} /></View>
        )}
        <View style={styles.info}>
          <AppText style={styles.title}>{report.title}</AppText>
          <AppText size={FONT_SIZES.caption}>{report.code}</AppText>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.textSecondary} />
            <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>{report.location}</AppText>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: label.bg }]}>
          <AppText size={FONT_SIZES.caption}>{label.text}</AppText>
        </View>
      </View>

      <View style={styles.progress}>
        {steps.map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={[styles.dot, index <= report.activeStep && styles.dotActive]}>
              {index <= report.activeStep ? (
                <Ionicons name={index === report.activeStep && report.status !== "rescued" ? "alert" : "checkmark"} size={13} color={COLORS.white} />
              ) : null}
            </View>
            <AppText size={FONT_SIZES.caption} color={index <= report.activeStep ? COLORS.brown : COLORS.textSecondary}>{step}</AppText>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="خيارات البلاغ" style={styles.more}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.brownMuted} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="مشاركة البلاغ" style={styles.share} onPress={() => void Share.share({ message: `${report.title} - ${report.code}` })}>
          <Ionicons name="share-social-outline" size={23} color={COLORS.brownMuted} />
        </Pressable>
        <Button title="عرض التفاصيل" onPress={onDetailsPress} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.md },
  head: { flexDirection: "row", gap: SPACING.sm, alignItems: "flex-start" },
  image: { width: 66, height: 66, borderRadius: RADIUS.md },
  placeholder: { width: 66, height: 66, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.tan },
  info: { flex: 1, alignItems: "flex-end", gap: SPACING.xs },
  title: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.body },
  locationRow: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.xs },
  badge: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 6 },
  progress: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: COLORS.offwhite, paddingBottom: SPACING.md },
  step: { alignItems: "center", gap: SPACING.xs },
  dot: { width: 23, height: 23, borderRadius: RADIUS.full, backgroundColor: COLORS.darkgray, alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: COLORS.brown },
  actions: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  more: { padding: SPACING.sm },
  share: { width: 46, height: 46, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.brownMuted, alignItems: "center", justifyContent: "center" },
  button: { flex: 1 },
});
