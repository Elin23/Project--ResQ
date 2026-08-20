import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import Chip from "@/src/components/ui/Chip";
import ErrorState from "@/src/components/ui/ErrorState";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SectionHeader from "@/src/components/ui/SectionHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import {
  adoptionListingApplicationsRoute,
  adoptionMyListingEditRoute,
  adoptionMyListingsRoute,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useOwnedAdoptionListingDetails } from "../hooks/useOwnedAdoptionListingDetails";
import { useListingApplications } from "../hooks/useListingApplications";
import { ADOPTION_MODERATION_META } from "../utils/moderation";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ageLabel(age: number, unit: "months" | "years") {
  if (unit === "months") return `${age} شهر`;
  return `${age} سنة`;
}

export default function MyAdoptionListingDetailsScreen() {
  const router = useRouter();
  const [closeDialogVisible, setCloseDialogVisible] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, accountKind } = useSession();
  const {
    listing,
    loading,
    error,
    reload,
    closeListing,
    closing,
  } = useOwnedAdoptionListingDetails(id, account?.id);
  const applicationsState = useListingApplications(id, account?.id);

  if (loading || applicationsState.loading) {
    return (
      <Screen>
        <LoadingState label="جاري تحميل الإعلان..." />
      </Screen>
    );
  }

  if (error || applicationsState.error || !listing) {
    return (
      <Screen>
        <ErrorState
          description={error ?? applicationsState.error ?? "الإعلان غير موجود أو لا تملك صلاحية الوصول إليه."}
          onRetry={() => void reload()}
        />
      </Screen>
    );
  }

  const meta = ADOPTION_MODERATION_META[listing.moderationStatus];
  const isRejected = listing.moderationStatus === "rejected";
  const isPending = listing.moderationStatus === "pending_review";
  const isApproved = listing.moderationStatus === "approved";
  const isArchived = listing.moderationStatus === "archived";
  const applications = applicationsState.applications;
  const pendingApplications = applications.filter((item) => item.status === "pending").length;
  const isReserved = listing.status === "reserved";

  const handleClose = () => setCloseDialogVisible(true);

  const confirmClose = async () => {
    await closeListing();
    setCloseDialogVisible(false);
  };

  return (
    <Screen scroll padded={false} safeAreaEdges={["top", "right", "bottom", "left"]}>
      <ScreenHeader
        title="إدارة إعلان التبني"
        subtitle={listing.animalName}
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Image source={{ uri: listing.imageUrl }} style={styles.hero} />

        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <AppText variant="h2" weight="bold" style={styles.flex}>
              {listing.animalName}
            </AppText>
            <StatusBadge
              label={meta.label}
              color={meta.color}
              background={meta.background}
              icon={meta.icon}
            />
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="paw-outline" size={17} color={COLORS.textSecondary} />
            <AppText variant="bodySmall" color={COLORS.textSecondary}>
              {listing.animalType}
              {listing.breed ? ` • ${listing.breed}` : ""}
              {" • "}
              {ageLabel(listing.age, listing.ageUnit)}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={17} color={COLORS.textSecondary} />
            <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.flex}>
              {listing.location.address}
            </AppText>
          </View>
        </View>

        {isPending ? (
          <Card disabled style={[styles.stateCard, styles.pendingCard]}>
            <Ionicons name="time-outline" size={24} color={COLORS.warning} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">الإعلان قيد المراجعة</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>
                لن يظهر الحيوان للعامة حتى تنتهي مراجعة الإدارة والموافقة على الإعلان.
              </AppText>
            </View>
          </Card>
        ) : null}

        {isRejected ? (
          <Card disabled style={[styles.stateCard, styles.rejectedCard]}>
            <Ionicons name="close-circle-outline" size={24} color={COLORS.danger} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold" color={COLORS.danger}>
                سبب رفض الإعلان
              </AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>
                {listing.rejectionReason ?? "لم يتم تسجيل سبب واضح للرفض."}
              </AppText>
            </View>
          </Card>
        ) : null}

        {isApproved ? (
          <>
            <Card disabled style={[styles.stateCard, styles.approvedCard]}>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
              <View style={styles.flex}>
                <AppText variant="label" weight="bold" color={COLORS.success}>
                  {isReserved ? "تم حجز الحيوان" : "الإعلان منشور"}
                </AppText>
                <AppText variant="bodySmall" color={COLORS.textSecondary}>
                  {isReserved
                    ? "تم اختيار متقدم لهذا الحيوان، لذلك توقف الإعلان عن استقبال طلبات جديدة."
                    : "الحيوان ظاهر الآن في قوائم التبني ويمكن للمستخدمين مشاهدة تفاصيله."}
                </AppText>
              </View>
            </Card>

            <SectionHeader title="لوحة إدارة الإعلان" />
            <View style={styles.managementGrid}>
              <Card disabled style={styles.managementCard}>
                <Ionicons name="mail-unread-outline" size={24} color={COLORS.primaryStrong} />
                <AppText variant="h3" weight="bold">{applications.length}</AppText>
                <AppText variant="caption" color={COLORS.textMuted}>
                  {pendingApplications > 0 ? `${pendingApplications} بانتظار قرارك` : "طلبات تبنٍ"}
                </AppText>
              </Card>
              <Card disabled style={styles.managementCard}>
                <Ionicons name="eye-outline" size={24} color={COLORS.textSecondary} />
                <AppText variant="bodySmall" weight="medium">منشور للعامة</AppText>
                <AppText variant="caption" color={COLORS.textMuted}>
                  يستقبل المشاهدات
                </AppText>
              </Card>
            </View>

            <Button
              title={applications.length > 0 ? `عرض طلبات التبني (${applications.length})` : "عرض طلبات التبني"}
              icon="people-outline"
              variant="outline"
              onPress={() => router.push(adoptionListingApplicationsRoute(listing.id, accountKind))}
            />
          </>
        ) : null}

        {isArchived ? (
          <Card disabled style={styles.stateCard}>
            <Ionicons name="archive-outline" size={24} color={COLORS.textMuted} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">الإعلان مغلق</AppText>
              <AppText variant="bodySmall" color={COLORS.textSecondary}>
                لم يعد الإعلان ظاهرًا في القوائم العامة ولا يستقبل طلبات جديدة.
              </AppText>
            </View>
          </Card>
        ) : null}

        <SectionHeader title="بيانات الإعلان" />
        <View style={styles.chipsRow}>
          {listing.traits.map((trait) => (
            <Chip key={trait} label={trait} soft />
          ))}
        </View>

        <Card disabled style={styles.infoCard}>
          <View style={styles.infoRow}>
            <AppText variant="caption" color={COLORS.textMuted}>الحالة الصحية</AppText>
            <AppText variant="bodySmall" style={styles.value}>{listing.healthCondition}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText variant="caption" color={COLORS.textMuted}>تاريخ الإرسال</AppText>
            <AppText variant="label">{formatDate(listing.submittedAt)}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText variant="caption" color={COLORS.textMuted}>تاريخ المراجعة</AppText>
            <AppText variant="label">{formatDate(listing.reviewedAt)}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText variant="caption" color={COLORS.textMuted}>آخر تحديث</AppText>
            <AppText variant="label">{formatDate(listing.updatedAt)}</AppText>
          </View>
        </Card>

        <SectionHeader title="السجل الصحي" />
        <View style={styles.healthList}>
          {listing.healthChecklist.map((item) => (
            <View key={item.id} style={styles.healthRow}>
              <Ionicons
                name={item.checked ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={item.checked ? COLORS.success : COLORS.textMuted}
              />
              <AppText variant="bodySmall" style={styles.flex}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>

        <ActionStack gap={SPACING.sm}>
          {isRejected ? (
            <Button
              title="تعديل وإعادة الإرسال"
              icon="create-outline"
              onPress={() => router.push(adoptionMyListingEditRoute(listing.id))}
            />
          ) : null}

          {isApproved ? (
            <Button
              title="إغلاق الإعلان"
              icon="archive-outline"
              variant="outline"
              loading={closing}
              onPress={handleClose}
            />
          ) : null}

          <Button
            title="العودة إلى إعلاناتي"
            variant="ghost"
            onPress={() => router.replace(adoptionMyListingsRoute(accountKind))}
          />
        </ActionStack>
      </View>
      <ConfirmDialog
        visible={closeDialogVisible}
        title="إغلاق إعلان التبني"
        message="سيختفي الإعلان من القوائم العامة ولن يستقبل طلبات جديدة. يمكنك الاحتفاظ بسجل الطلبات السابقة."
        confirmLabel="إغلاق الإعلان"
        icon="archive-outline"
        loading={closing}
        onCancel={() => setCloseDialogVisible(false)}
        onConfirm={() => void confirmClose()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  hero: {
    width: "100%",
    height: 240,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceSubtle,
  },
  titleBlock: {
    alignItems: "stretch",
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  metaRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
  },
  stateCard: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
  },
  pendingCard: {
    backgroundColor: COLORS.warningSoft,
  },
  rejectedCard: {
    backgroundColor: COLORS.dangerSoft,
  },
  approvedCard: {
    backgroundColor: COLORS.successSoft,
  },
  managementGrid: {
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
  },
  managementCard: {
    flex: 1,
    minHeight: 105,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
  applicantsNotice: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.primarySoft,
  },
  chipsRow: {
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  infoCard: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  value: {
    flex: 1,
  },
  healthList: {
    gap: SPACING.sm,
  },
  healthRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
});
