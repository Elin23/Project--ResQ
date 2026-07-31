import { View } from "react-native";
import QuickActionGrid from "@/src/components/ui/QuickActionGrid";
import Screen from "@/src/components/ui/Screen";
import CommunityStatsCard from "../components/CommunityStatsCard";
import ContributionHeroCard from "../components/ContributionHeroCard";
import UserWelcomeHeader from "../components/UserWelcomeHeader";
import { COMMUNITY_STATS } from "../constants/home";
import { useHomeScreen } from "../hooks/useHomeScreen";
import HomeAdoptionSection from "../sections/HomeAdoptionSection";
import HomeReportsSection from "../sections/HomeReportsSection";
import HomeSuggestionsSection from "../sections/HomeSuggestionsSection";
import { styles } from "./Home.styles";

export default function HomeScreen() {
  const { router, quickActions, showTemporaryMessage } = useHomeScreen();
  return <Screen scroll safeAreaEdges={["left", "right"]}>
    <View style={styles.container}>
      <UserWelcomeHeader name="أحمد" avatarUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" />
      <ContributionHeroCard />
      <QuickActionGrid actions={quickActions} columns={3} />
      <HomeReportsSection onOpenReports={() => router.push("/reports")} />
      <HomeAdoptionSection onOpenAdoption={() => router.push("/adoption")} />
      <CommunityStatsCard stats={[...COMMUNITY_STATS]} />
      <HomeSuggestionsSection onOpenMap={() => router.push("/map")} onOpenOrganizations={() => showTemporaryMessage("الجمعيات التطوعية")} />
    </View>
  </Screen>;
}
