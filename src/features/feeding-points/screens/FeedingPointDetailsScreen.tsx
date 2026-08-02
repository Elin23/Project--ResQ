import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Share,
  StyleSheet,
  View,
} from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";
import IconButton from "../../../components/ui/IconButton";
import QuickActionGrid, {
  type QuickAction,
} from "../../../components/ui/QuickActionGrid";
import RatingStars from "../../../components/ui/RatingStars";
import Screen from "../../../components/ui/Screen";
import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";

import ActivityTimeline from "../components/ActivityTimeline";
import ReportIssueSheet from "../components/ReportIssueSheet";
import UpdateStatusSheet from "../components/UpdateStatusSheet";
import { createFeedingPointIssue, createStatusUpdate } from "../api/feedingPoints.api";
import { FACILITY_META, STATUS_META } from "../constants";
import { useFeedingPointDetails } from "../hooks/useFeedingPointDetails";
import type { FeedingPointIssueReason, ReportedStatus } from "../types";
import { formatDistance } from "../utils/format";
import { formatRelativeTime, getDisplayStatus } from "../utils/status";

export default function FeedingPointDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [statusSheetVisible, setStatusSheetVisible] = useState(false);
  const [issueSheetVisible, setIssueSheetVisible] = useState(false);
  const { point, updates, isLoading, error, refetch } = useFeedingPointDetails(id);

  if (isLoading) {
    return (
      <Screen centered>
        <ActivityIndicator color={COLORS.primary} />
      </Screen>
    );
  }

  if (error || !point) {
    return (
      <Screen centered>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.placeholder} />
        <AppText color={COLORS.textSecondary}>{error ?? "النقطة غير موجودة"}</AppText>
        <Button title="إعادة المحاولة" onPress={refetch} />
      </Screen>
    );
  }

  const display = getDisplayStatus(point.status, point.lastStatusUpdateAt);
  const meta = STATUS_META[display];
  const distance = formatDistance(point.distanceInMeters);

  const openInMaps = () => {
    const { latitude, longitude } = point.coordinate;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    );
  };

  const handleShare = () => {
    Share.share({
      message: `${point.name} — ${point.address}`,
    }).catch(() => {});
  };

  const handleSubmitStatusUpdate = async (input: {
    reportedStatus: ReportedStatus;
    photoUri: string;
    note?: string;
  }) => {
    await createStatusUpdate({ feedingPointId: point.id, ...input });
    setStatusSheetVisible(false);
    await refetch();
    Alert.alert("تم الإرسال", "تحديثك بانتظار مراجعة الإدارة، رح يظهر بتاريخ النشاط.");
  };

  const handleSubmitIssue = async (input: {
    reason: FeedingPointIssueReason;
    note?: string;
  }) => {
    await createFeedingPointIssue({ feedingPointId: point.id, ...input });
    setIssueSheetVisible(false);
    Alert.alert("تم إرسال البلاغ", "شكراً إلك — رح تراجع الإدارة البلاغ قريباً.");
  };

  const infoActions: QuickAction[] = [
    {
      key: "directions",
      label: "الاتجاهات",
      icon: "navigate-outline",
      color: COLORS.accent,
      onPress: openInMaps,
    },
    {
      key: "share",
      label: "مشاركة",
      icon: "share-social-outline",
      color: COLORS.textgreen,
      onPress: handleShare,
    },
  ];

  return (
    <>
    <Screen scroll padded={false} keyboardAware={false} safeAreaEdges={["top", "right", "left"]}>
      <View style={styles.body}>
        <View style={styles.hero}>
          {point.photoUrl ? (
            <Image source={{ uri: point.photoUrl }} style={styles.heroImage} />
          ) : (
            <Ionicons name="restaurant-outline" size={40} color={COLORS.placeholder} />
          )}

          <View style={styles.heroTopRow}>
            <IconButton
              icon="chevron-forward"
              accessibilityLabel="رجوع"
              onPress={() => router.back()}
              size={20}
              color={COLORS.text}
              style={styles.heroIconButton}
            />

            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              accessibilityLabel={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              onPress={() => setIsFavorite((v) => !v)}
              size={20}
              color={isFavorite ? COLORS.danger : COLORS.text}
              style={styles.heroIconButton}
            />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <AppText weight="bold" size={FONT_SIZES.headline}>
            {point.name}
          </AppText>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <AppText size={FONT_SIZES.label} color={COLORS.textSecondary} style={styles.flex}>
              {point.address}
            </AppText>
          </View>

          {point.rating != null && (
            <RatingStars rating={point.rating} ratingsCount={point.ratingsCount} />
          )}
        </View>

        <SectionHeader title="معلومات النقطة" />
        <QuickActionGrid actions={infoActions} columns={2} />

        <SectionHeader title="حالة النقطة" />

        <View style={styles.statusBlock}>
          <View style={styles.metaRow}>
            <StatusBadge
              label={meta.label}
              color={meta.color}
              background={meta.background}
              icon={meta.icon}
            />
            <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
              آخر تحديث {formatRelativeTime(point.lastStatusUpdateAt)}
              {distance ? ` · ${distance}` : ""}
            </AppText>
          </View>

          {point.facilities && point.facilities.length > 0 && (
            <View style={styles.facilitiesRow}>
              {point.facilities.map((key) => {
                const facility = FACILITY_META[key];
                return (
                  <Chip
                    key={key}
                    label={facility.label}
                    icon={facility.icon}
                    color={facility.color}
                    soft
                  />
                );
              })}
            </View>
          )}

          {point.description && (
            <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
              {point.description}
            </AppText>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="إبلاغ عن مشكلة"
            onPress={() => setIssueSheetVisible(true)}
            variant="outline"
            icon="flag-outline"
            borderColor={COLORS.danger}
            textColor={COLORS.danger}
            style={styles.flex}
          />
          <Button
            title="تسجيل تغذية"
            onPress={() => setStatusSheetVisible(true)}
            variant="custom"
            icon="checkmark-circle-outline"
            backgroundColor={COLORS.textgreen}
            borderColor={COLORS.textgreen}
            textColor={COLORS.white}
            style={styles.flex}
          />
        </View>

        <SectionHeader title="الموقع" />

        <View style={styles.mapSlot}>
          <Ionicons name="map-outline" size={28} color={COLORS.placeholder} />
          <AppText size={FONT_SIZES.caption} color={COLORS.placeholder}>
            الخريطة قيد الإنشاء
          </AppText>
        </View>

        <Button title="فتح في الخرائط" onPress={openInMaps} />

        <SectionHeader title="تاريخ النشاط" />
        <ActivityTimeline updates={updates} />
      </View>
    </Screen>

    <UpdateStatusSheet
      visible={statusSheetVisible}
      initialStatus="stocked"
      onClose={() => setStatusSheetVisible(false)}
      onSubmit={handleSubmitStatusUpdate}
    />

    <ReportIssueSheet
      visible={issueSheetVisible}
      onClose={() => setIssueSheetVisible(false)}
      onSubmit={handleSubmitIssue}
    />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  hero: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.lightgray,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTopRow: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroIconButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white + "E6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  titleBlock: {
    gap: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    flexWrap: "wrap",
  },
  flex: {
    flex: 1,
  },
  statusBlock: {
    gap: SPACING.sm,
  },
  facilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  mapSlot: {
    width: "100%",
    height: 140,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.lightgray,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
});
