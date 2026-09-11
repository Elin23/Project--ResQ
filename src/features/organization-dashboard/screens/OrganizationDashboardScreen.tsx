import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import SectionHeader from "@/src/components/ui/SectionHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import WorkspaceMetricGrid from "@/src/components/ui/WorkspaceMetricGrid";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { useOrganizationDashboard } from "../hooks/useOrganizationDashboard";
import ActiveRescueTaskCard from "../components/ActiveRescueTaskCard";
import EmergencyCasesSection from "../components/EmergencyCasesSection";
import OrganizationDashboardHeader from "../components/OrganizationDashboardHeader";
import OrganizationMapPreview from "../components/OrganizationMapPreview";
import OrganizationQuickActions from "../components/OrganizationQuickActions";
import OrganizationSummaryCard from "../components/OrganizationSummaryCard";
import HomeContentSection from "@/src/features/content/components/HomeContentSection";
import HomeSponsoredAdSection from "@/src/features/advertising/components/HomeSponsoredAdSection";

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
      <OrganizationDashboardHeader
        onNotificationsPress={dashboard.openNotifications}
        unreadNotificationCount={dashboard.unreadNotificationCount}
        organizationName={dashboard.organizationName}
        logoUrl={dashboard.organizationLogoUrl}
        verified={dashboard.organizationVerified}
        statusLabel={dashboard.organizationStatusLabel}
      />
      <View style={styles.content}>
        <OrganizationSummaryCard totalRescueTasks={dashboard.totalRescueTasks} />
        <View style={styles.sectionCompact}>
          <SectionHeader title="حالة العمليات" />
          <View style={styles.availabilityRow}>
            <StatusBadge
              label={dashboard.operationsAvailabilityLabel}
              color={dashboard.operationsAvailable ? COLORS.successDark : COLORS.warning}
              background={dashboard.operationsAvailable ? COLORS.successSoft : COLORS.warningSoft}
            />
            {dashboard.operationsAvailable ? (
              <AppText color={COLORS.successDark}>الفريق يستقبل حالات جديدة</AppText>
            ) : null}
          </View>
          <WorkspaceMetricGrid metrics={dashboard.metrics} />
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
          <HomeContentSection kind="article" onViewAll={dashboard.openArticles} onOpen={dashboard.openArticle} />
        </View>
        <View style={styles.section}>
          <HomeContentSection kind="success-story" onViewAll={dashboard.openSuccessStories} onOpen={dashboard.openSuccessStory} />
        </View>

        <View style={styles.section}>
          <HomeSponsoredAdSection />
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

    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 0 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.lg },
  section: { marginTop: SPACING.xl },
  sectionCompact: { marginTop: SPACING.lg },
  availabilityRow: { width: "100%", alignItems: "flex-start", gap: SPACING.xs, marginBottom: SPACING.sm },
  sectionTitle: { textAlign: "auto", writingDirection: "rtl", marginBottom: SPACING.md },
  locationButton: { alignSelf: "flex-start", width: 170, marginTop: SPACING.xl },
});
