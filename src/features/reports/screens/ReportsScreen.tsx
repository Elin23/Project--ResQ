import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import { useSession } from "@/src/features/session/SessionContext";
import { reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";
import MyReportCard from "../components/MyReportCard";
import { useMyReports, type ReportFilter } from "../hooks/useMyReports";

const filters: { id: ReportFilter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "review", label: "قيد المراجعة" },
  { id: "rescue", label: "قيد الإنقاذ" },
  { id: "rescued", label: "تم الإنقاذ" },
];

export default function ReportsScreen() {
  const model = useMyReports();
  const router = useRouter();
  const { isGuest } = useSession();

  return (
    <Screen scroll backgroundColor={COLORS.surface} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="arrow-forward" size={25} color={COLORS.text} />
        <AppText style={styles.heading}>{isGuest ? "بلاغات المجتمع" : "بلاغاتي"}</AppText>
        <View style={styles.headerTools}>
          <Ionicons name="search" size={23} color={COLORS.text} />
          <Ionicons name="options-outline" size={23} color={COLORS.text} />
        </View>
      </View>

      {!isGuest ? (
        <View style={styles.stats}>
          <View style={styles.stat}><AppText color={COLORS.brown}>إجمالي البلاغات</AppText><AppText style={styles.number}>{model.stats.all}</AppText></View>
          <View style={styles.stat}><AppText>بلاغاتي</AppText><AppText style={styles.numberDark}>{model.stats.mine}</AppText></View>
          <View style={styles.stat}><AppText>قيد الإنقاذ</AppText><AppText style={styles.numberBlue}>{model.stats.rescued}</AppText></View>
        </View>
      ) : null}

      <Input placeholder="ابحث برقم البلاغ أو نوع الحيوان..." value={model.query} onChangeText={model.setQuery} icon="search" />

      <View style={styles.filters}>
        {filters.map((filter) => (
          <Pressable key={filter.id} onPress={() => model.setFilter(filter.id)} style={[styles.filter, model.filter === filter.id && styles.filterActive]}>
            <AppText color={model.filter === filter.id ? COLORS.white : COLORS.brownMuted}>{filter.label}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {model.reports.map((report) => (
          <MyReportCard key={report.id} report={report} onDetailsPress={() => router.push(reportDetailsRoute(report.id))} />
        ))}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="إنشاء بلاغ" onPress={() => router.push(ROUTES.createReport)} style={styles.fab}>
        <Ionicons name="add" size={34} color={COLORS.brownDark} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.lg },
  headerTools: { flexDirection: "row", gap: SPACING.lg },
  heading: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.headline },
  stats: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.lg },
  stat: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingVertical: SPACING.md, alignItems: "center", gap: SPACING.xs },
  number: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.brown },
  numberDark: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.text },
  numberBlue: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.bgblue },
  filters: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg },
  filter: { paddingHorizontal: SPACING.md, paddingVertical: 9, borderRadius: RADIUS.full, backgroundColor: COLORS.darkgray },
  filterActive: { backgroundColor: COLORS.brown },
  list: { gap: SPACING.md },
  fab: { position: "absolute", left: 20, bottom: 20, width: 56, height: 56, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
});
