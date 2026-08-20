import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import {
  formatOpeningHours,
  getPlaceOpenState,
  type ServicePlace,
} from "@/src/domain/service-places";
import ServicePlacesMap from "@/src/features/map/components/ServicePlacesMap";
import { useSession } from "@/src/features/session/SessionContext";
import { donationCampaignDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useVeterinaryClinicDetails } from "../hooks/useVeterinaryClinicDetails";

function openDirections(clinic: ServicePlace) {
  const query = encodeURIComponent(`${clinic.latitude},${clinic.longitude}`);
  return Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
}

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

export default function VeterinaryClinicDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accountKind } = useSession();
  const state = useVeterinaryClinicDetails(id);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل بيانات العيادة..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.clinic) {
    return <Screen><EmptyState title="العيادة غير موجودة" description="قد تكون بيانات العيادة غير متاحة حاليًا." /></Screen>;
  }

  const clinic = state.clinic;
  const openState = getPlaceOpenState(clinic);

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="تفاصيل العيادة" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card disabled style={styles.identityCard}>
          <View style={styles.logo}>
            <Ionicons name="medkit-outline" size={34} color={COLORS.primaryStrong} />
          </View>
          <View style={styles.flex}>
            <View style={styles.nameRow}>
              <AppText variant="h2" weight="bold">{clinic.name}</AppText>
              {clinic.verified ? <Ionicons name="shield-checkmark" size={19} color={COLORS.success} /> : null}
            </View>
            <AppText color={COLORS.textSecondary}>{clinic.address}</AppText>
            <View style={styles.badges}>
              <StatusBadge
                label={openState.label}
                color={openState.isOpen ? COLORS.success : COLORS.textMuted}
              />
              {clinic.emergency24h ? <StatusBadge label="طوارئ 24 ساعة" color={COLORS.danger} /> : null}
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="اتصال الآن"
            icon="call-outline"
            onPress={() => void Linking.openURL(`tel:${clinic.phone}`)}
          />
          <Button
            title="الاتجاهات"
            icon="navigate-outline"
            variant="outline"
            onPress={() => void openDirections(clinic)}
          />
        </View>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">بيانات العيادة</AppText>
          {clinic.responsiblePerson ? <InfoRow label="الشخص المسؤول" value={clinic.responsiblePerson} /> : null}
          <InfoRow label="رقم الهاتف" value={clinic.phone} />
          {clinic.whatsapp ? <InfoRow label="واتساب" value={clinic.whatsapp} /> : null}
          <InfoRow label="العنوان" value={clinic.address} />
          {clinic.description ? (
            <View style={styles.description}>
              <AppText variant="caption" color={COLORS.textSecondary}>نبذة</AppText>
              <AppText variant="bodySmall">{clinic.description}</AppText>
            </View>
          ) : null}
        </Card>

        <Card disabled style={styles.card}>
          <AppText variant="h3" weight="bold">ساعات العمل</AppText>
          {clinic.emergency24h ? (
            <View style={styles.emergencyNote}>
              <Ionicons name="flash-outline" size={19} color={COLORS.danger} />
              <AppText variant="bodySmall" weight="bold" color={COLORS.danger}>
                استقبال الحالات الطارئة على مدار الساعة
              </AppText>
            </View>
          ) : null}
          {clinic.openingHours.map((item) => (
            <AppText key={item.day} variant="bodySmall" color={COLORS.textSecondary}>
              {formatOpeningHours(item)}
            </AppText>
          ))}
        </Card>

        <View style={styles.mapWrap}>
          <AppText variant="h3" weight="bold">الموقع على الخريطة</AppText>
          <ServicePlacesMap
            places={[clinic]}
            selectedId={clinic.id}
            onSelectPlace={() => undefined}
            height={240}
          />
        </View>

        {state.campaigns.length ? (
          <View style={styles.campaignSection}>
            <AppText variant="h3" weight="bold">حملات التبرع النشطة</AppText>
            {state.campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                onPress={() => router.push(donationCampaignDetailsRoute(campaign.id, accountKind))}
                style={styles.campaignCard}
              >
                <View style={styles.campaignIcon}>
                  <Ionicons name="heart-outline" size={22} color={COLORS.primaryStrong} />
                </View>
                <View style={styles.flex}>
                  <AppText variant="label" weight="bold">{campaign.title}</AppText>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    {money(campaign.raisedAmount)} من {money(campaign.targetAmount)}
                  </AppText>
                </View>
                <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
              </Card>
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
      <AppText weight="medium">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.lg },
  identityCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  logo: { width: 72, height: 72, borderRadius: RADIUS.xl, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  nameRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  badges: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.xs, marginTop: SPACING.sm },
  actions: { gap: SPACING.sm },
  card: { gap: SPACING.sm },
  infoRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.md },
  description: { gap: SPACING.xs, paddingTop: SPACING.xs },
  emergencyNote: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, padding: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.dangerSoft },
  mapWrap: { gap: SPACING.sm },
  campaignSection: { gap: SPACING.sm },
  campaignCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  campaignIcon: { width: 46, height: 46, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
});
