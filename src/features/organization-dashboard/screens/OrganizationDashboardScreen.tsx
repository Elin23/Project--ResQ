import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import { ROUTES } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import {
  ORGANIZATION_ACHIEVEMENTS,
  ORGANIZATION_DASHBOARD_METRICS,
} from "../constants/organizationDashboard";
import { useOrganizationDashboard } from "../hooks/useOrganizationDashboard";
import ActiveRescueTaskCard from "../components/ActiveRescueTaskCard";
import EmergencyCasesSection from "../components/EmergencyCasesSection";
import OrganizationAchievements from "../components/OrganizationAchievements";
import OrganizationBottomNavigation from "../components/OrganizationBottomNavigation";
import OrganizationDashboardHeader from "../components/OrganizationDashboardHeader";
import OrganizationMapPreview from "../components/OrganizationMapPreview";
import OrganizationMetricCards from "../components/OrganizationMetricCards";
import OrganizationQuickActions from "../components/OrganizationQuickActions";
import OrganizationSummaryCard from "../components/OrganizationSummaryCard";

export default function OrganizationDashboardScreen() {
  const dashboard = useOrganizationDashboard();

  return (
    <Screen
      scroll
      padded={false}
      backgroundColor={COLORS.surface}
      safeAreaEdges={["top", "left", "right", "bottom"]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <OrganizationDashboardHeader onNotificationsPress={dashboard.openNotifications} />
        <OrganizationSummaryCard />
        <OrganizationMetricCards metrics={ORGANIZATION_DASHBOARD_METRICS} />

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

        <OrganizationQuickActions onReportsPress={dashboard.openReports} />

        <EmergencyCasesSection
          items={dashboard.emergencyCases}
          acceptedIds={dashboard.acceptedCaseIds}
          onOpenCase={dashboard.openCaseDetails}
          onAcceptCase={dashboard.acceptCase}
        />

        <View style={styles.section}>
          <AppText size={FONT_SIZES.headline} weight="medium" style={styles.sectionTitle}>مهام الجمعية الحالية</AppText>
          <ActiveRescueTaskCard
            task={dashboard.activeTask}
            onOpen={() => dashboard.openCaseDetails(dashboard.activeTask.id)}
            onUpdate={dashboard.updateTaskProgress}
          />
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
          backgroundColor={COLORS.primary}
          borderColor={COLORS.primary}
          textColor={COLORS.white}
          radius={RADIUS.lg}
          style={styles.locationButton}
        />
      </View>

      <OrganizationBottomNavigation
        onHome={() => dashboard.router.replace(ROUTES.organizationDashboard)}
        onTasks={dashboard.openReports}
        onMap={dashboard.openMap}
        onNotifications={dashboard.openNotifications}
        onProfile={dashboard.openOrganizationProfile}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 0 },
  content: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  ratingCard: {
    minHeight: 74,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  memberFaces: { flexDirection: "row-reverse", alignItems: "center" },
  face: { width: 30, height: 30, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.white, marginLeft: -8 },
  faceOne: { backgroundColor: COLORS.peach },
  faceTwo: { backgroundColor: COLORS.orgStatGreenBorder },
  faceThree: { backgroundColor: COLORS.orgStatBlueBorder },
  moreFace: { width: 30, height: 30, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.darkgray },
  ratingText: { alignItems: "flex-end" },
  section: { marginTop: SPACING.xl },
  sectionTitle: { textAlign: "right", writingDirection: "rtl", marginBottom: SPACING.md },
  locationButton: { alignSelf: "flex-start", width: 170, marginTop: SPACING.xl },
});
