import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Share, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import ActionStack from "@/src/components/ui/ActionStack";
import ActionRow from "@/src/components/ui/ActionRow";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import IconButton from "@/src/components/ui/IconButton";
import MetaRow from "@/src/components/ui/MetaRow";
import RemoteImage from "@/src/components/ui/RemoteImage";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { ROUTES, organizationDetailsRoute } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { Report } from "@/src/domain";
import { useFavorites } from "@/src/features/favorites";

import ReportLocationMap from "./ReportLocationMap";

const ANIMAL_LABEL: Record<string, string> = { dog: "كلب", cat: "قطة", bird: "طائر", other: "حيوان آخر" };
const STATUS_VIEW = {
  pending: { label: "قيد المراجعة", color: COLORS.warning, background: COLORS.warningSoft },
  approved: { label: "تم استلام البلاغ", color: COLORS.info, background: COLORS.infoSoft },
  assigned: { label: "قيد الإنقاذ", color: COLORS.info, background: COLORS.infoSoft },
  closed: { label: "مغلق", color: COLORS.success, background: COLORS.successSoft },
} as const;

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SY", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <AppText variant="h3" weight="bold" style={styles.sectionTitle}>{children}</AppText>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card disabled style={styles.infoCard} padding={SPACING.md} radius={RADIUS.lg}>
      <AppText variant="label" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="body" weight="bold" style={styles.infoCardValue}>{value}</AppText>
    </Card>
  );
}

function Timeline({ report }: { report: Report }) {
  const items = [
    { label: "تم إنشاء البلاغ", at: report.createdAt },
    ...(report.assignedAt ? [{ label: "تم إسناد البلاغ", at: report.assignedAt }] : []),
    ...(report.receivedAt ? [{ label: "تم استلام الحالة", at: report.receivedAt }] : []),
    ...(report.closedAt ? [{ label: "تم إغلاق البلاغ", at: report.closedAt }] : []),
  ];
  return (
    <Card disabled padding={SPACING.md} radius={RADIUS.xl}>
      {items.map((item, index) => (
        <View key={`${item.label}-${item.at}`} style={[styles.timelineRow, index === items.length - 1 && styles.timelineLast]}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineCopy}>
            <AppText variant="body" weight="bold">{item.label}</AppText>
            <AppText variant="caption" color={COLORS.textMuted}>{formatDate(item.at)}</AppText>
          </View>
        </View>
      ))}
    </Card>
  );
}

export default function ReportDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const loader = useCallback(async () => {
    if (!id) return undefined;
    return repositories.reports.getById(id);
  }, [id]);
  const resource = useAsyncResource<Report | undefined>(loader, undefined, "تعذر تحميل تفاصيل البلاغ.");
  const report = resource.data;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = report ? isFavorite("report", report.id) : false;
  const setSaved = useCallback(() => {
    if (!report) return;
    toggleFavorite({ kind: "report", id: report.id, title: report.title });
  }, [report, toggleFavorite]);
  const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
    setCarouselWidth(Math.max(1, Math.round(event.nativeEvent.layout.width)));
  }, []);

  const images = useMemo(() => report ? Array.from(new Set([...(report.mediaUrls ?? []), report.imageUrl].filter(Boolean))) : [], [report]);
  const status = report ? STATUS_VIEW[report.status] : STATUS_VIEW.pending;

  const mapUrl = useMemo(() => {
    if (!report) return "";
    const latLng = `${report.latitude},${report.longitude}`;
    const label = report.address || report.locationName || report.title;
    if (Platform.OS === "ios") return `maps:0,0?q=${encodeURIComponent(label)}@${latLng}`;
    if (Platform.OS === "android") return `geo:0,0?q=${latLng}(${encodeURIComponent(label)})`;
    return `https://www.google.com/maps/search/?api=1&query=${latLng}`;
  }, [report]);

  const handleShare = useCallback(() => {
    if (!report) return;
    void Share.share({ message: `${report.title}\nرقم البلاغ: ${report.code}\n${report.locationName}` });
  }, [report]);

  if (resource.loading && !report) {
    return <Screen padded safeAreaEdges={["top", "bottom"]}><ScreenHeader title="تفاصيل البلاغ" onBack={() => router.back()} /><AppText align="center" color={COLORS.textMuted}>جاري تحميل البلاغ...</AppText></Screen>;
  }

  if (!report) {
    return (
      <Screen padded safeAreaEdges={["top", "bottom"]}>
        <ScreenHeader title="تفاصيل البلاغ" onBack={() => router.back()} />
        <Card disabled padding={SPACING.lg}>
          <AppText align="center" weight="bold">{resource.error ?? "البلاغ غير موجود."}</AppText>
          <Button title="إعادة المحاولة" onPress={() => void resource.reload().catch(() => undefined)} style={styles.retryButton} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll padded safeAreaEdges={["top", "bottom"]} surface="app" contentContainerStyle={styles.pageContent}>
      <ScreenHeader title="تفاصيل البلاغ" onBack={() => router.back()} right={<IconButton icon="share-social-outline" accessibilityLabel="مشاركة البلاغ" onPress={handleShare} />} />

      {images.length > 0 ? (
        <View style={styles.carouselShell} onLayout={handleCarouselLayout}>
          <ScrollView horizontal pagingEnabled snapToInterval={carouselWidth} decelerationRate="fast" showsHorizontalScrollIndicator={false}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
              const slide = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
              if (slide >= 0 && slide < images.length) setActiveImageIndex(slide);
            }} scrollEventThrottle={16}>
            {images.map((uri) => <RemoteImage key={uri} uri={uri} style={[styles.carouselImage, { width: carouselWidth }]} accessibilityLabel="صورة البلاغ" />)}
          </ScrollView>
          <View style={styles.imageCounter}><AppText variant="caption" direction="ltr" align="center" color={COLORS.white}>{activeImageIndex + 1} / {images.length}</AppText></View>
        </View>
      ) : null}

      <View style={styles.titleRow}>
        <AppText variant="h1" weight="bold" style={styles.titleText}>{report.title}</AppText>
        {report.priority === "urgent" ? <StatusBadge label="حالة عاجلة" color={COLORS.danger} background={COLORS.dangerSoft} size="sm" /> : null}
      </View>
      <View style={styles.statusRow}>
        <StatusBadge label={status.label} color={status.color} background={status.background} />
      </View>
      <View style={styles.metaWrap}>
        <MetaRow text={formatDate(report.createdAt) ?? ""} icon="time-outline" />
        <MetaRow text={report.locationName || report.address || "الموقع غير محدد"} icon="location-outline" />
        <MetaRow text={`رقم البلاغ: ${report.code}`} />
      </View>

      <View style={styles.twoColumnRow}>
        <InfoCard label="نوع الحيوان" value={ANIMAL_LABEL[report.animalType ?? "other"] ?? "غير محدد"} />
        <InfoCard label="الأولوية" value={report.priority === "urgent" ? "عاجلة" : "عادية"} />
      </View>

      <View style={styles.section}><SectionTitle>وصف الحالة</SectionTitle><View style={styles.commentRow}><AppText variant="body" color={COLORS.textSecondary} style={styles.titleText}>{report.description || report.subtitle || "لا يوجد وصف إضافي."}</AppText></View></View>

      <View style={styles.section}>
        <SectionTitle>الموقع</SectionTitle>
        <Card disabled padding={0} radius={RADIUS.xl} style={styles.mapCard}>
          <ReportLocationMap latitude={report.latitude} longitude={report.longitude} style={styles.map} />
          <View style={styles.mapFooter}>
            <AppText variant="body" weight="bold">{report.address || report.locationName}</AppText>
            <Button title="فتح الخريطة" icon="map-outline" size="small" variant="secondary" onPress={() => mapUrl && void Linking.openURL(mapUrl)} />
          </View>
        </Card>
      </View>

      <View style={styles.section}><SectionTitle>مسار البلاغ</SectionTitle><Timeline report={report} /></View>

      {report.assignedOrganizationId && report.assignedOrganizationName ? (
        <View style={styles.section}>
          <SectionTitle>الجهة المستجيبة</SectionTitle>
          <Card disabled padding={SPACING.md} radius={RADIUS.lg}>
            <View style={styles.personRow}>
              <AppText variant="body" weight="bold" style={styles.titleText}>{report.assignedOrganizationName}</AppText>
              <StatusBadge label="الجهة المستجيبة" color={COLORS.info} background={COLORS.infoSoft} size="sm" />
            </View>
            <Button title="عرض الملف" size="small" variant="outline" onPress={() => router.push(organizationDetailsRoute(report.assignedOrganizationId!))} style={styles.retryButton} />
          </Card>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionTitle>الإجراءات</SectionTitle>
        <ActionStack>
          <ActionRow>
            <Button title={saved ? "إزالة من المحفوظات" : "حفظ البلاغ"} icon={saved ? "bookmark" : "bookmark-outline"} variant="outline" onPress={setSaved} />
            <Button title="مشاركة" icon="share-social-outline" variant="outline" onPress={handleShare} />
          </ActionRow>
          <Button title="الإبلاغ عن حالة جديدة" icon="add-circle-outline" onPress={() => router.push(ROUTES.createReport)} />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageContent: { gap: SPACING.lg },
  titleRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", justifyContent: "space-between", gap: SPACING.sm },
  titleText: { flex: 1, minWidth: 0 },
  personRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  commentRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start" },
  retryButton: { marginTop: SPACING.md },
  carouselShell: { width: "100%", height: 230, borderRadius: RADIUS.xl, overflow: "hidden", position: "relative", backgroundColor: COLORS.surfaceMuted },
  carouselImage: { height: 230 },
  imageCounter: { position: "absolute", bottom: SPACING.md, left: SPACING.md, minWidth: 42, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.backdrop },
  statusRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, flexWrap: "wrap" },
  metaWrap: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.xs },
  twoColumnRow: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  infoCard: { flex: 1, minWidth: 0 },
  infoCardValue: { marginTop: SPACING.xs },
  section: { gap: SPACING.sm },
  sectionTitle: { alignSelf: "stretch" },
  mapCard: { overflow: "hidden" },
  map: { height: 220 },
  mapFooter: { padding: SPACING.md, gap: SPACING.sm },
  timelineRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.sm, paddingBottom: SPACING.md },
  timelineLast: { paddingBottom: 0 },
  timelineDot: { width: 12, height: 12, borderRadius: RADIUS.full, backgroundColor: COLORS.success, marginTop: 5 },
  timelineCopy: { flex: 1, minWidth: 0, gap: 2 },
});
