import { Image, Share, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Card from "@/src/components/ui/Card";
import DetailRow from "@/src/components/ui/DetailRow";
import ReadingSection from "@/src/components/ui/ReadingSection";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { adoptionApplyRoute, adoptionMyListingDetailsRoute, adoptionRoute } from "@/src/navigation/routes";
import { COLORS, SPACING } from "@/src/theme";
import { useSession } from "@/src/features/session/SessionContext";
import { useAdoptionDetails } from "../hooks/useAdoptionDetails";

export default function AdoptionDetailsScreen() {
  const router = useRouter();
  const details = useAdoptionDetails();
  const { account, accountKind } = useSession();
  if (details.loading) return <Screen><LoadingState label="جاري تحميل حالة التبني..." /></Screen>;
  if (details.error) return <Screen><ErrorState description={details.error} onRetry={() => void details.reload()} /></Screen>;
  if (!details.listing) return <Screen><EmptyState title="الحالة غير موجودة" description="قد لا تكون حالة التبني متاحة بعد الآن." actionTitle="العودة للتبني" onActionPress={() => router.replace(adoptionRoute(accountKind))} /></Screen>;

  const listing = details.listing;
  return <Screen scroll padded={false} contentContainerStyle={styles.content}>
    <ScreenHeader title="تفاصيل التبني" onBack={() => router.back()} />
    <Image source={{ uri: listing.imageUrl }} style={styles.image} resizeMode="cover" />
    <View style={styles.body}>
      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <StatusBadge label="متاح للتبني" color={COLORS.success} />
          <AppText variant="h1" weight="bold" style={styles.flex}>{listing.animalName}</AppText>
        </View>
        <View style={styles.metaGrid}>
          <DetailRow label="نوع الحيوان" value={listing.animalType} icon="paw-outline" tone="soft" />
          <DetailRow label="الموقع" value={listing.locationName} icon="location-outline" tone="soft" />
        </View>
      </View>
      <ReadingSection title="عن الحالة">
        <Card disabled style={styles.card}>
          <AppText variant="bodyLarge" color={COLORS.textSecondary}>{listing.description}</AppText>
        </Card>
      </ReadingSection>
      <ActionStack>
        {account?.id === listing.ownerAccountId ? <Button title="إدارة الإعلان" icon="settings-outline" onPress={() => router.push(adoptionMyListingDetailsRoute(listing.id, accountKind))} /> : <Button title="إرسال طلب اهتمام" icon="heart-outline" onPress={() => router.push(adoptionApplyRoute(listing.id))} />}
        <Button title="مشاركة الحالة" variant="outline" icon="share-social-outline" onPress={() => void Share.share({ message: `${listing.animalName} متاح للتبني عبر ResQ\n${listing.description}` })} />
      </ActionStack>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingVertical: 0 },
  image: { width: "100%", height: 280, backgroundColor: COLORS.lightgray },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  titleBlock: { gap: SPACING.md },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.md },
  metaGrid: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, flexWrap: "wrap" },
  card: { gap: SPACING.sm },
  flex: { flex: 1 },
});
