import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Share, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import ActionRow from "@/src/components/ui/ActionRow";
import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import IconButton from "@/src/components/ui/IconButton";
import MetaRow from "@/src/components/ui/MetaRow";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES, organizationDetailsRoute } from "@/src/navigation/routes";
import { COLORS, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";

const CUSTOM_FIRST_IMAGE = require("../../../../assets/images/dogg.png");
const REPORT_IMAGES = [
  CUSTOM_FIRST_IMAGE,
  { uri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop" },
  { uri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop" },
  { uri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop" },
];

const LOCATION = {
  latitude: 33.5138,
  longitude: 36.2765,
  label: "كلب مصاب - دمشق المزة",
};

const TIMELINE = [
  { title: "تم إرسال البلاغ", description: "تم توثيق الحالة بنجاح.", time: "08:30 ص", state: "done" as const },
  { title: "تم قبول البلاغ", description: "فريق ResQ استلم الحالة.", time: "08:40 ص", state: "done" as const },
  { title: "المتطوع في طريقه", description: 'المتطوع "أحمد س." توجه للموقع.', time: "08:50 ص", state: "active" as const },
  { title: "تم نقل الحيوان إلى العيادة", description: "", time: "قيد الانتظار", state: "pending" as const },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <AppText variant="h3" weight="bold" style={styles.sectionTitle}>
      {children}
    </AppText>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card disabled style={styles.infoCard} padding={SPACING.md} radius={RADIUS.lg}>
      <AppText variant="label" color={COLORS.textSecondary}>{label}</AppText>
      <AppText variant="body" weight="bold" style={styles.infoCardValue}>{value}</AppText>
    </Card>
  );
}

function TimelineNode({ state }: { state: "done" | "active" | "pending" }) {
  const color = state === "done" ? COLORS.success : state === "active" ? COLORS.primary : COLORS.borderStrong;
  return (
    <View style={[styles.timelineNodeOuter, { borderColor: color }]}>
      <View style={[styles.timelineNodeInner, { backgroundColor: color }]} />
    </View>
  );
}

function CommentCard({ name, time, body, avatarColor }: { name: string; time: string; body: string; avatarColor: string }) {
  return (
    <View style={styles.commentRow}>
      <View style={[styles.commentAvatar, { backgroundColor: avatarColor }]} />
      <Card disabled style={styles.commentCard} padding={SPACING.md} radius={RADIUS.lg}>
        <View style={styles.commentMetaRow}>
          <AppText variant="label" weight="bold" style={styles.flexText}>{name}</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>{time}</AppText>
        </View>
        <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.commentBody}>{body}</AppText>
      </Card>
    </View>
  );
}

export default function ReportDetailsScreen() {
  const { isGuest } = useSession();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(1);

  const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.max(1, Math.round(event.nativeEvent.layout.width));
    setCarouselWidth(nextWidth);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
    if (slide >= 0 && slide < REPORT_IMAGES.length) setActiveImageIndex(slide);
  }, [carouselWidth]);

  const handleShareReport = useCallback(() => {
    void Share.share({ message: "بلاغ إنقاذ على ResQ: كلب مصاب بالقرب من الطريق الرئيسي" });
  }, []);

  const mapUrl = useMemo(() => {
    const latLng = `${LOCATION.latitude},${LOCATION.longitude}`;
    if (Platform.OS === "ios") return `maps:0,0?q=${encodeURIComponent(LOCATION.label)}@${latLng}`;
    if (Platform.OS === "android") return `geo:0,0?q=${latLng}(${encodeURIComponent(LOCATION.label)})`;
    return `https://www.google.com/maps/search/?api=1&query=${latLng}`;
  }, []);

  const openRealMap = useCallback(() => {
    void Linking.openURL(mapUrl);
  }, [mapUrl]);

  return (
    <Screen
      scroll
      padded
      safeAreaEdges={["top", "bottom"]}
      surface="app"
      contentContainerStyle={styles.pageContent}
    >
      <ScreenHeader
        title="تفاصيل البلاغ"
        onBack={() => router.back()}
        horizontalPadding={0}
        right={<IconButton icon="share-social-outline" accessibilityLabel="مشاركة البلاغ" onPress={handleShareReport} />}
        style={styles.pageHeader}
      />

      <View style={styles.carouselShell} onLayout={handleCarouselLayout}>
        <ScrollView
          horizontal
          pagingEnabled
          snapToInterval={carouselWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {REPORT_IMAGES.map((imageSource, index) => (
            <Image key={index} source={imageSource} style={[styles.carouselImage, { width: carouselWidth }]} />
          ))}
        </ScrollView>

        <View style={styles.imageCounter}>
          <AppText variant="caption" direction="ltr" align="center" color={COLORS.white}>
            {activeImageIndex + 1} / {REPORT_IMAGES.length}
          </AppText>
        </View>
        <View style={styles.carouselDots}>
          {REPORT_IMAGES.map((_, index) => (
            <View key={index} style={[styles.carouselDot, index === activeImageIndex && styles.carouselDotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.statusRow}>
        <StatusBadge label="قيد الإنقاذ" color={COLORS.info} background={COLORS.infoSoft} icon="medkit-outline" style={styles.badgeStart} />
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <AppText variant="h1" weight="bold" style={styles.reportTitle}>
            كلب مصاب بالقرب من الطريق الرئيسي
          </AppText>
          <StatusBadge label="حالة عاجلة" color={COLORS.danger} background={COLORS.dangerSoft} size="sm" style={styles.badgeStart} />
        </View>
        <View style={styles.metaWrap}>
          <MetaRow text="منذ 25 دقيقة" icon="time-outline" style={styles.metaItem} />
          <MetaRow text="دمشق" icon="location-outline" style={styles.metaItem} />
          <MetaRow text="رقم البلاغ: RQ-2481" style={styles.metaItem} />
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.twoColumnRow}>
          <InfoCard label="نوع الحيوان" value="كلب" />
          <InfoCard label="الحجم" value="متوسط" />
        </View>
        <View style={styles.twoColumnRow}>
          <InfoCard label="العمر" value="بالغ" />
          <InfoCard label="الجنس" value="غير معروف" />
        </View>
        <View style={styles.twoColumnRow}>
          <InfoCard label="الحالة الصحية" value="إصابة ظاهرة في الساق" />
          <InfoCard label="السلوك" value="هادئ لكنه خائف" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle>وصف الحالة</SectionTitle>
        <AppText variant="body" color={COLORS.textSecondary}>
          تم العثور على الكلب بالقرب من الطريق الرئيسي في منطقة المزة. الكلب يعاني من إصابة واضحة في ساقه الخلفية تمنعه من الحركة بشكل طبيعي. يبدو أليفاً ولكنه يظهر علامات خوف وتوتر من السيارات المارة.
        </AppText>
      </View>

      <View style={styles.section}>
        <SectionTitle>الموقع</SectionTitle>
        <Card disabled padding={0} radius={RADIUS.xl} style={styles.mapCard}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: LOCATION.latitude,
              longitude: LOCATION.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker coordinate={{ latitude: LOCATION.latitude, longitude: LOCATION.longitude }} />
          </MapView>
          <View style={styles.mapFooter}>
            <View style={styles.mapInfoRow}>
              <View style={styles.locationCopy}>
                <AppText variant="body" weight="bold">دمشق، المزة، بالقرب من دوار الجلاء</AppText>
                <AppText variant="caption" color={COLORS.textMuted}>يبعد 2.4 كم عن موقعك الحالي</AppText>
              </View>
              <Button
                title="فتح الخريطة"
                icon="map-outline"
                size="small"
                fullWidth={false}
                variant="secondary"
                onPress={openRealMap}
              />
            </View>
            <MetaRow text="يتم إخفاء الدقة الكاملة للموقع حمايةً للحيوان والمبلّغ." icon="information-circle-outline" numberOfLines={2} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle>مسار الإنقاذ</SectionTitle>
        <Card disabled style={styles.timelineCard} padding={SPACING.md} radius={RADIUS.xl}>
          {TIMELINE.map((item, index) => (
            <View key={item.title} style={[styles.timelineRow, index === TIMELINE.length - 1 && styles.timelineRowLast]}>
              <View style={styles.timelineRail}>
                <TimelineNode state={item.state} />
                {index < TIMELINE.length - 1 ? <View style={styles.timelineLine} /> : null}
              </View>
              <View style={styles.timelineCopy}>
                <AppText variant="body" weight="bold" color={item.state === "pending" ? COLORS.textMuted : COLORS.text}>{item.title}</AppText>
                {item.description ? <AppText variant="caption" color={COLORS.textMuted}>{item.description}</AppText> : null}
              </View>
              <AppText variant="caption" direction="rtl" color={item.state === "pending" ? COLORS.textMuted : COLORS.textSecondary} style={styles.timelineTime}>
                {item.time}
              </AppText>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle>الأطراف المشاركة</SectionTitle>
        <ActionStack gap={SPACING.sm}>
          <Card disabled style={styles.personCard} padding={SPACING.md} radius={RADIUS.lg}>
            <View style={styles.personRow}>
              <View style={[styles.avatar, styles.reporterAvatar]}>
                <AppText variant="label" weight="bold" align="center">MR</AppText>
              </View>
              <View style={styles.personCopy}>
                <AppText variant="caption" color={COLORS.textMuted}>المبلّغ / المتطوع</AppText>
                <AppText variant="body" weight="bold">أحمد س.</AppText>
                <View style={styles.tagRow}>
                  <StatusBadge label="متطوع موثوق" color={COLORS.success} background={COLORS.successSoft} size="sm" />
                  <AppText variant="caption" color={COLORS.textMuted}>8 بلاغات</AppText>
                </View>
              </View>
            </View>
          </Card>

          <Card disabled style={styles.personCard} padding={SPACING.md} radius={RADIUS.lg}>
            <View style={styles.personRow}>
              <View style={[styles.avatar, styles.organizationAvatar]}>
                <MaterialCommunityIcons name="hand-heart" size={ICON_SIZES.md} color={COLORS.white} />
              </View>
              <View style={styles.personCopy}>
                <AppText variant="caption" color={COLORS.textMuted}>الجهة المستجيبة</AppText>
                <AppText variant="body" weight="bold">فريق إنقاذ ResQ</AppText>
                <AppText variant="caption" color={COLORS.textMuted}>جمعية إنقاذ حيوانات مرخصة</AppText>
              </View>
              <Button title="عرض الملف" size="small" variant="outline" fullWidth={false} onPress={() => router.push(organizationDetailsRoute("resq-syria"))} />
            </View>
          </Card>
        </ActionStack>
      </View>

      <View style={styles.section}>
        <View style={styles.commentsHeader}>
          <SectionTitle>التعليقات والتحديثات</SectionTitle>
          <StatusBadge label="2 تعليق" color={COLORS.textSecondary} background={COLORS.surfaceMuted} size="sm" />
        </View>
        <ActionStack gap={SPACING.sm}>
          <CommentCard
            name="أحمد س. (المتطوع)"
            time="منذ 5 د"
            avatarColor={COLORS.success}
            body="أنا الآن في المزة، سأصل إلى الموقع خلال دقيقتين. الكلب ما زال في مكانه؟"
          />
          <CommentCard
            name="المبلّغ"
            time="منذ 3 د"
            avatarColor={COLORS.tan}
            body="نعم، أنا بقربه تماماً. إنه هادئ الآن."
          />
        </ActionStack>

        {isGuest ? (
          <Card disabled style={styles.guestGate} padding={SPACING.md} radius={RADIUS.lg} borderColor={COLORS.borderStrong}>
            <AppText variant="bodySmall" weight="medium">سجّل الدخول لإضافة تعليق أو تحديث للحالة.</AppText>
            <Button title="تسجيل الدخول" size="small" onPress={() => router.push(ROUTES.login)} style={styles.guestGateButton} />
          </Card>
        ) : null}
      </View>

      <View style={styles.section}>
        <SectionTitle>إجراءات البلاغ</SectionTitle>
        <ActionStack>
          <Button
            title="الإبلاغ عن حالة مشابهة"
            icon="add-circle-outline"
            onPress={() => router.push(ROUTES.createReport)}
          />
          <ActionRow>
            <Button title="مشاركة" icon="share-social-outline" variant="outline" onPress={handleShareReport} style={styles.halfAction} />
            <Button
              title={saved ? "إزالة من المحفوظات" : "حفظ البلاغ"}
              icon={saved ? "bookmark" : "bookmark-outline"}
              variant="outline"
              onPress={() => setSaved((value) => !value)}
              style={styles.halfAction}
            />
          </ActionRow>
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    gap: SPACING.lg,
  },
  pageHeader: {
    marginBottom: SPACING.xs,
  },
  carouselShell: {
    width: "100%",
    height: 230,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.surfaceMuted,
  },
  carouselImage: {
    height: 230,
    resizeMode: "cover",
  },
  imageCounter: {
    position: "absolute",
    bottom: SPACING.md,
    left: SPACING.md,
    minWidth: 42,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backdrop,
  },
  carouselDots: {
    position: "absolute",
    bottom: SPACING.md,
    alignSelf: "center",
    flexDirection: "row",
    direction: "rtl",
    gap: 6,
  },
  carouselDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  carouselDotActive: {
    width: 16,
    backgroundColor: COLORS.white,
  },
  badgeStart: {
    alignSelf: "flex-start",
  },
  statusRow: {
    width: "100%",
    direction: "rtl",
    alignItems: "flex-start",
  },
  titleBlock: {
    width: "100%",
    direction: "rtl",
    gap: SPACING.sm,
  },
  titleRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  reportTitle: {
    flex: 1,
    minWidth: 0,
  },
  metaWrap: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    alignItems: "center",
    gap: SPACING.sm,
  },
  metaItem: {
    alignSelf: "auto",
    width: "auto",
  },
  infoGrid: {
    width: "100%",
    gap: SPACING.sm,
  },
  twoColumnRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
  },
  infoCard: {
    flex: 1,
    minWidth: 0,
  },
  infoCardValue: {
    marginTop: SPACING.xs,
  },
  section: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    gap: SPACING.sm,
  },
  sectionTitle: {
    width: "100%",
  },
  mapCard: {
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: 170,
  },
  mapFooter: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  mapInfoRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
  },
  locationCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
    gap: SPACING.xxs,
  },
  timelineCard: {
    gap: 0,
  },
  timelineRow: {
    width: "100%",
    minHeight: 66,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  timelineRowLast: {
    minHeight: 48,
  },
  timelineRail: {
    width: 20,
    alignItems: "center",
    alignSelf: "stretch",
  },
  timelineNodeOuter: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  timelineNodeInner: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 36,
    backgroundColor: COLORS.divider,
  },
  timelineCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
    paddingBottom: SPACING.md,
  },
  timelineTime: {
    width: 72,
    flexShrink: 0,
    textAlign: "left",
  },
  personCard: {
    width: "100%",
  },
  personRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reporterAvatar: {
    backgroundColor: COLORS.primarySoft,
  },
  organizationAvatar: {
    backgroundColor: COLORS.secondaryStrong,
  },
  personCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "stretch",
  },
  tagRow: {
    marginTop: SPACING.xs,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  commentsHeader: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  commentRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    flexShrink: 0,
    marginTop: SPACING.xs,
  },
  commentCard: {
    flex: 1,
    minWidth: 0,
  },
  commentMetaRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  flexText: {
    flex: 1,
  },
  commentBody: {
    marginTop: SPACING.xs,
  },
  guestGate: {
    marginTop: SPACING.sm,
    borderStyle: "dashed",
  },
  guestGateButton: {
    marginTop: SPACING.sm,
  },
  halfAction: {
    flex: 1,
  },
});
