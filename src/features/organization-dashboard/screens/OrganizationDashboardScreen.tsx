import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import SectionHeader from "@/src/components/ui/SectionHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import WorkspaceMetricGrid from "@/src/components/ui/WorkspaceMetricGrid";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { ORGANIZATION_ACHIEVEMENTS } from "../constants/organizationDashboard";
import { useOrganizationDashboard } from "../hooks/useOrganizationDashboard";
import ActiveRescueTaskCard from "../components/ActiveRescueTaskCard";
import EmergencyCasesSection from "../components/EmergencyCasesSection";
import OrganizationAchievements from "../components/OrganizationAchievements";
import OrganizationDashboardHeader from "../components/OrganizationDashboardHeader";
import OrganizationMapPreview from "../components/OrganizationMapPreview";
import OrganizationQuickActions from "../components/OrganizationQuickActions";
import OrganizationSummaryCard from "../components/OrganizationSummaryCard";

export default function OrganizationDashboardScreen() {
  const dashboard = useOrganizationDashboard();

  return (
    <Screen
      scroll
      padded={false}
      surface="app"
      safeAreaEdges={["top", "left", "right", "bottom"]}
      contentContainerStyle={styles.scrollContent}
    >
      <OrganizationDashboardHeader onNotificationsPress={dashboard.openNotifications} />
      <View style={styles.content}>
        <OrganizationSummaryCard />
        <View style={styles.sectionCompact}>
          <SectionHeader title="حالة العمليات" />
          <WorkspaceMetricGrid metrics={dashboard.metrics} />
        </View>

        <View style={styles.ratingCard}>
          <View style={styles.memberFaces}>
            <View style={[styles.face, styles.faceOne]} />
            <View style={[styles.face, styles.faceTwo]} />
            <View style={[styles.face, styles.faceThree]} />
            <View style={styles.moreFace}><AppText size={FONT_SIZES.caption} color={COLORS.white}>+12</AppText></View>
          </View>
          <View style={styles.ratingText}>
            <AppText size={FONT_SIZES.caption} color={COLORS.brownMuted}>تقييم المجتمع</AppText>
            <AppText size={FONT_SIZES.body} weight="bold">★ 4.9</AppText>
          </View>
        </View>

        <View style={styles.availabilityRow}>
          <StatusBadge label="الفريق يستقبل حالات جديدة" color={COLORS.success} dot />
          <AppText variant="caption" color={COLORS.textMuted}>آخر مزامنة الآن</AppText>
        </View>

        <View style={styles.sectionCompact}>
          <SectionHeader title="إجراءات التشغيل" />
          <OrganizationQuickActions
            onIncomingReportsPress={dashboard.openReports}
            onRescueTasksPress={dashboard.openTasks}
            onFeedingPointsPress={dashboard.openFeedingPoints}
            onAdoptionListingsPress={dashboard.openAdoptionListings}
            onCreateCampaignPress={dashboard.createCampaign}
            onCampaignsPress={dashboard.openCampaigns}
            onVeterinaryClinicsPress={dashboard.openVeterinaryClinics}
          />
        </View>

        <EmergencyCasesSection
          items={dashboard.emergencyCases}
          acceptedIds={dashboard.acceptedCaseIds}
          onOpenCase={dashboard.openCaseDetails}
          onAcceptCase={dashboard.acceptCase}
          onViewAll={dashboard.openReports}
        />

        <View style={styles.section}>
          <AppText size={FONT_SIZES.headline} weight="medium" style={styles.sectionTitle}>مهام الجمعية الحالية</AppText>
          {dashboard.activeTask ? (
            <ActiveRescueTaskCard
              task={dashboard.activeTask}
              onOpen={() => dashboard.openTaskDetails(dashboard.activeTask!.id)}
              onUpdate={() => dashboard.openTaskDetails(dashboard.activeTask!.id)}
            />
          ) : (
            <AppText color={COLORS.textMuted}>لا توجد مهمة إنقاذ نشطة الآن.</AppText>
          )}
        </View>

        <View style={styles.section}>
          <OrganizationMapPreview onOpenMap={dashboard.openMap} />
        </View>

        <View style={styles.section}>
          <AppText size={FONT_SIZES.headline} weight="medium" style={styles.sectionTitle}>إنجازات الجمعية</AppText>
          <OrganizationAchievements items={ORGANIZATION_ACHIEVEMENTS} />
        </View>

        <Button
          title="تحديث موقع الجمعية"
          onPress={dashboard.updateOrganizationLocation}
          size="medium"
          icon="locate-outline"
          backgroundColor={COLORS.primaryFill}
          borderColor={COLORS.primary}
          textColor={COLORS.white}
          radius={RADIUS.lg}
          style={styles.locationButton}
        />
      </View>

    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 0 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  ratingCard: {
    minHeight: 74,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  memberFaces: { flexDirection: "row", direction: "rtl", alignItems: "center" },
  face: { width: 30, height: 30, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.white, marginLeft: -8 },
  faceOne: { backgroundColor: COLORS.peach },
  faceTwo: { backgroundColor: COLORS.orgStatGreenBorder },
  faceThree: { backgroundColor: COLORS.orgStatBlueBorder },
  moreFace: { width: 30, height: 30, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.darkgray },
  ratingText: { alignItems: "stretch" },
  section: { marginTop: SPACING.xl },
  sectionCompact: { marginTop: SPACING.lg },
  availabilityRow: { marginTop: SPACING.lg, flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { textAlign: "auto", writingDirection: "rtl", marginBottom: SPACING.md },
  locationButton: { alignSelf: "flex-start", width: 170, marginTop: SPACING.xl },
});
