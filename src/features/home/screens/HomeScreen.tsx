import { View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import GuestPromoCard from "@/src/components/ui/GuestPromoCard";
import QuickActionGrid from "@/src/components/ui/QuickActionGrid";
import Screen from "@/src/components/ui/Screen";
import WorkspaceMetricGrid from "@/src/components/ui/WorkspaceMetricGrid";
import SectionHeader from "@/src/components/ui/SectionHeader";
import ContributionHeroCard from "../components/ContributionHeroCard";
import GuestHomeIntro from "../components/GuestHomeIntro";
import { adoptionDetailsRoute, articleDetailsRoute, articlesRoute, successStoriesRoute, successStoryDetailsRoute } from "@/src/navigation/routes";
import { useHomeScreen } from "../hooks/useHomeScreen";
import HomeAdoptionSection from "../sections/HomeAdoptionSection";
import HomeSuggestionsSection from "../sections/HomeSuggestionsSection";
import HomeContentSection from "@/src/features/content/components/HomeContentSection";
import HomeSponsoredAdSection from "@/src/features/advertising/components/HomeSponsoredAdSection";
import { useSession } from "@/src/features/session/SessionContext";
import { COLORS, SPACING } from "@/src/theme";
import { styles } from "./Home.styles";

export default function HomeScreen() {
  const { router, quickActions, isGuest, isPendingOrganization, memberMetrics } = useHomeScreen();
  const USER_HOME_METRICS = memberMetrics;
  const { accountKind } = useSession();

  return (
    <Screen scroll safeAreaEdges={["left", "right"]}>
      <View style={styles.container}>
        {isGuest ? <GuestHomeIntro /> : null}

        {isPendingOrganization ? (
          <Card disabled style={{ gap: SPACING.sm, borderColor: COLORS.warning }}>
            <AppText variant="h3" weight="bold">طلب الجمعية قيد المراجعة</AppText>
            <AppText variant="bodySmall" color={COLORS.textSecondary}>يمكنك التصفح واستخدام الخريطة ومتابعة مركز الإشعارات حتى يصدر قرار الإدارة.</AppText>
            <Button title="فتح الإشعارات" variant="outline" onPress={() => router.push("/notifications")} />
          </Card>
        ) : isGuest ? (
          <GuestPromoCard
            onCreateAccount={() => router.push("/choose-account")}
            onLogin={() => router.push("/login")}
          />
        ) : (
          <>
            <ContributionHeroCard />
            <View style={styles.section}>
              <SectionHeader title="ملخص نشاطك" actionLabel="عرض بلاغاتي" onActionPress={() => router.push("/reports")} />
              <WorkspaceMetricGrid metrics={USER_HOME_METRICS} />
            </View>
          </>
        )}

        <View style={styles.section}>
          <SectionHeader title={isGuest ? "خدمات متاحة للزائر" : "إجراءات سريعة"} />
          <QuickActionGrid actions={quickActions} columns={3} />
        </View>

        <HomeAdoptionSection onOpenAdoption={() => router.push("/adoptions")} onOpenAnimal={(id) => router.push(adoptionDetailsRoute(id))} />

        <HomeContentSection
          kind="article"
          onViewAll={() => router.push(articlesRoute(accountKind))}
          onOpen={(id) => router.push(articleDetailsRoute(id, accountKind))}
        />
        <HomeContentSection
          kind="success-story"
          onViewAll={() => router.push(successStoriesRoute(accountKind))}
          onOpen={(id) => router.push(successStoryDetailsRoute(id, accountKind))}
        />

        <HomeSponsoredAdSection />

        <HomeSuggestionsSection
          onOpenMap={() => router.push("/map")}
          onOpenOrganizations={() => router.push("/organizations")}
        />
      </View>
    </Screen>
  );
}
