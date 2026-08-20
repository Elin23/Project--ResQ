import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useDonationCampaignDetails } from "../hooks/useDonationCampaignDetails";

export default function DonationCampaignOwnerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useDonationCampaignDetails(id);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل بيانات الجهة..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.campaign) return <Screen><EmptyState title="الجهة غير متاحة" description="تعذر تحميل بيانات الجهة صاحبة الحملة." /></Screen>;

  const campaign = state.campaign;
  return (
    <Screen scroll padded={false}>
      <ScreenHeader title={"الجهة المنظمة"} onBack={() => router.back()} />
      <View style={styles.content}>
        <Card disabled style={styles.identityCard}>
          {campaign.ownerLogoUrl ? (
            <Image source={{ uri: campaign.ownerLogoUrl }} style={styles.logo} />
          ) : (
            <View style={styles.logoFallback}>
              <Ionicons name={"people-outline"} size={30} color={COLORS.primaryStrong} />
            </View>
          )}
          <View style={styles.flex}>
            <AppText variant="h2" weight="bold">{campaign.ownerDisplayName}</AppText>
            <AppText color={COLORS.textSecondary}>
              {campaign.location.city ?? campaign.location.governorate} • سوريا
            </AppText>
          </View>
          {campaign.ownerVerified ? <StatusBadge label="جهة موثقة" color={COLORS.success} /> : null}
        </Card>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">عن الجهة</AppText>
          <AppText color={COLORS.textSecondary}>
            جهة موثقة تعمل في رعاية وإنقاذ الحيوانات وتدير حملات دعم عبر ResQ.
          </AppText>
        </Card>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">الحملة الحالية</AppText>
          <AppText weight="bold">{campaign.title}</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>{campaign.shortDescription}</AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md },
  identityCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  logo: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceMuted },
  logoFallback: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  card: { gap: SPACING.sm },
  flex: { flex: 1 },
});
