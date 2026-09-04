import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useMemo, useState } from "react";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import IconButton from "@/src/components/ui/IconButton";
import Input from "@/src/components/ui/Input";
import RefreshStatus from "@/src/components/ui/RefreshStatus";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { useSession } from "@/src/features/session/SessionContext";
import {
  createCampaignRoute,
  donationCampaignDetailsRoute,
  donationDetailsRoute,
  myCampaignsRoute,
  myDonationsRoute,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationCampaign, DonationTransfer } from "@/src/domain";
import { useDonationDiscovery, type DonationCategoryFilter } from "../hooks/useDonationDiscovery";

const CATEGORY_ITEMS: {
  key: DonationCategoryFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "all", label: "الكل", icon: "apps-outline" },
  { key: "medical", label: "علاج", icon: "medkit-outline" },
  { key: "food", label: "طعام", icon: "restaurant-outline" },
  { key: "shelter", label: "مأوى", icon: "home-outline" },
  { key: "rescue", label: "إنقاذ", icon: "heart-outline" },
];

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function compactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}م`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}k`;
  return new Intl.NumberFormat("ar-SY").format(value);
}

function progressFor(campaign: DonationCampaign) {
  if (!campaign.targetAmount) return 0;
  return Math.min(1, campaign.raisedAmount / campaign.targetAmount);
}

function daysRemaining(campaign: DonationCampaign) {
  if (!campaign.endsAt) return undefined;
  const diff = Math.ceil((Date.parse(campaign.endsAt) - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, diff);
}

const TRANSFER_META = {
  submitted: { label: "قيد المراجعة", color: COLORS.warning, icon: "time-outline" as const },
  verifying: { label: "قيد التحقق", color: COLORS.warning, icon: "search-outline" as const },
  approved: { label: "مكتمل", color: COLORS.success, icon: "checkmark-circle-outline" as const },
  rejected: { label: "مرفوض", color: COLORS.danger, icon: "close-circle-outline" as const },
};

export default function DonationsScreen() {
  const router = useRouter();
  const { account, accountKind, can } = useSession();
  const state = useDonationDiscovery(account?.id);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [query, setQuery] = useState("");
  const { isNarrow } = useResponsiveLayout();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.campaigns;
    return state.campaigns.filter((campaign) =>
      [
        campaign.title,
        campaign.ownerDisplayName,
        campaign.location.governorate,
        campaign.location.city,
        campaign.shortDescription,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [query, state.campaigns]);

  const mostNeeded = useMemo(() => {
    if (!query.trim()) return state.mostNeeded;
    return [...filtered]
      .filter((campaign) => campaign.status === "active")
      .sort((a, b) => Number(b.urgent) - Number(a.urgent) || progressFor(a) - progressFor(b))[0];
  }, [filtered, query, state.mostNeeded]);

  const activeCampaigns = useMemo(
    () => filtered.filter((campaign) => campaign.status === "active" && campaign.id !== mostNeeded?.id),
    [filtered, mostNeeded?.id],
  );

  if (state.loading) {
    return <Screen scroll><SkeletonList count={3} /></Screen>;
  }

  if (state.error) {
    return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  }

  return (
    <Screen
      scroll
      padded={false}
      contentContainerStyle={styles.screenContent}
      scrollProps={{
        refreshControl: <RefreshControl refreshing={state.refreshing} onRefresh={() => void state.reload()} tintColor={COLORS.primary} colors={[COLORS.primary]} />,
      }}
    >
      <ScreenHeader
        title="التبرعات"
        onBack={() => router.back()}
        right={
          <View style={styles.headerActions}>
            <IconButton
              icon="search-outline"
              accessibilityLabel={showSearch ? "إخفاء البحث" : "البحث في الحملات"}
              onPress={() => setShowSearch((value) => !value)}
            />
            <IconButton
              icon="options-outline"
              accessibilityLabel={showFilters ? "إخفاء التصنيفات" : "إظهار التصنيفات"}
              onPress={() => setShowFilters((value) => !value)}
            />
          </View>
        }
      />

      <View style={[styles.body, isNarrow && styles.bodyNarrow]}>
        <RefreshStatus refreshing={state.refreshing} error={state.refreshError} stale={state.isStale} lastUpdatedAt={state.lastUpdatedAt} onRetry={() => void state.reload()} />
        {showSearch ? (
          <Input
            label="البحث في الحملات"
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث عن حملة أو جهة أو مدينة..."
            icon="search-outline"
          />
        ) : null}

        {can("manage-campaigns") ? (
          <View style={styles.managerStack}>
            <Card
              onPress={() => router.push(createCampaignRoute(accountKind))}
              backgroundColor={COLORS.primarySoft}
              borderColor={`${COLORS.primaryStrong}33`}
              style={styles.managerCard}
            >
              <View style={styles.managerIcon}>
                <Ionicons name="megaphone-outline" size={24} color={COLORS.primaryStrong} />
              </View>
              <View style={styles.flex}>
                <AppText variant="label" weight="bold">افتح حملة تبرع جديدة</AppText>
                <AppText variant="caption" color={COLORS.textSecondary}>
                  أنشئ الحملة واحفظها كمسودة أو أرسلها للمراجعة.
                </AppText>
              </View>
              <Ionicons name="chevron-back" size={18} color={COLORS.primaryStrong} />
            </Card>
            <Button
              title="حملاتي"
              icon="folder-open-outline"
              variant="outline"
              onPress={() => router.push(myCampaignsRoute(accountKind))}
            />
          </View>
        ) : null}

        {state.heroCampaign && !query.trim() ? (
          <HeroCampaign
            compact={isNarrow}
            campaign={state.heroCampaign}
            onPress={() => router.push(donationCampaignDetailsRoute(state.heroCampaign!.id, accountKind))}
          />
        ) : null}

        {showFilters ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORY_ITEMS.map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                icon={item.icon}
                selected={state.category === item.key}
                color={state.category === item.key ? COLORS.primary : COLORS.textSecondary}
                onPress={() => state.setCategory(item.key)}
              />
            ))}
          </ScrollView>
        ) : null}

        <SectionHeader title="الأكثر احتياجًا" actionLabel="عرض الكل" onActionPress={() => { setQuery(""); state.setCategory("all"); }} />
        {mostNeeded ? (
          <PrimaryCampaignCard
            compact={isNarrow}
            campaign={mostNeeded}
            onPress={() => router.push(donationCampaignDetailsRoute(mostNeeded.id, accountKind))}
          />
        ) : (
          <EmptyState
            title="لا توجد حملات مطابقة"
            description="جرّب تغيير البحث أو التصنيف لعرض حملات أخرى."
          />
        )}

        {activeCampaigns.length ? (
          <>
            <SectionHeader title="الحملات النشطة" subtitle="حملات مفتوحة للمساهمة الآن" />
            <View style={styles.compactList}>
              {activeCampaigns.slice(0, 4).map((campaign) => (
                <CompactCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onPress={() => router.push(donationCampaignDetailsRoute(campaign.id, accountKind))}
                />
              ))}
            </View>
          </>
        ) : null}

        <SectionHeader title="أثر مساهمات المجتمع" subtitle="ملخص سريع عن أثر الدعم داخل المنصة" />
        <View style={styles.metricsGrid}>
          <MetricCard icon="paw-outline" value={compactNumber(state.community.activeCampaigns * 120 + state.community.donors)} label="حيوانًا مستفيدًا" tone="green" />
          <MetricCard icon="cash-outline" value={compactNumber(state.community.raisedAmount)} label="إجمالي التبرعات (ل.س)" tone="orange" />
          <MetricCard icon="people-outline" value={compactNumber(state.community.donors)} label="المتبرعون" tone="blue" />
          <MetricCard icon="home-outline" value={compactNumber(state.community.organizations)} label="الجهات المستفيدة" tone="gray" />
        </View>

        {account ? (
          <>
            <SectionHeader
              title="آخر تبرعاتك"
              actionLabel={state.transfers.length ? "عرض الكل" : undefined}
              onActionPress={state.transfers.length ? () => router.push(myDonationsRoute(accountKind)) : undefined}
            />
            {state.transfers.length ? (
              <View style={styles.transfersList}>
                {state.transfers.map((transfer) => (
                  <RecentTransferRow
                    key={transfer.id}
                    transfer={transfer}
                    onPress={() => router.push(donationDetailsRoute(transfer.id, accountKind))}
                  />
                ))}
              </View>
            ) : (
              <Card disabled style={styles.emptyDonationCard}>
                <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                <View style={styles.flex}>
                  <AppText variant="label" weight="bold">لم تسجل تبرعات بعد</AppText>
                  <AppText variant="caption" color={COLORS.textSecondary}>
                    عندما ترسل حوالة لدعم إحدى الحملات ستظهر حالتها هنا.
                  </AppText>
                </View>
              </Card>
            )}
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function HeroCampaign({ campaign, onPress, compact = false }: { campaign: DonationCampaign; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`فتح حملة ${campaign.title}`} onPress={onPress}>
      <ImageBackground source={{ uri: campaign.coverImageUrl }} style={[styles.hero, compact && styles.heroNarrow]} imageStyle={styles.heroImage}>
        <View style={styles.heroScrim} />
        <View style={[styles.heroCopy, compact && styles.heroCopyNarrow]}>
          <AppText variant="h1" weight="bold" color={COLORS.white} style={styles.heroTitle}>
            كل تبرع يصنع فرقًا ❤️
          </AppText>
          <AppText variant="bodySmall" color={COLORS.white} style={styles.heroDescription}>
            ساهم في إنقاذ الحيوانات ودعم الجمعيات والجهات التي تعتني بها.
          </AppText>
          <View style={styles.heroButton}>
            <AppText variant="label" weight="bold" color={COLORS.textInverse}>تبرع الآن</AppText>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function PrimaryCampaignCard({ campaign, onPress, compact = false }: { campaign: DonationCampaign; onPress: () => void; compact?: boolean }) {
  const progress = progressFor(campaign);
  const remaining = daysRemaining(campaign);
  return (
    <Card onPress={onPress} padding={0} elevation="sm" style={styles.primaryCard}>
      <View style={[styles.primaryImageWrap, compact && styles.primaryImageWrapNarrow]}>
        <Image source={{ uri: campaign.coverImageUrl }} style={styles.primaryImage} />
        {campaign.urgent ? (
          <View style={styles.urgentBadge}>
            <AppText variant="caption" weight="bold" color={COLORS.textInverse}>! عاجل</AppText>
          </View>
        ) : null}
      </View>
      <View style={styles.primaryBody}>
        <View style={styles.primaryTitleRow}>
          <View style={styles.flex}>
            <AppText variant="h3" weight="bold">{campaign.title}</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>{campaign.ownerDisplayName}</AppText>
          </View>
          {campaign.ownerVerified ? <Ionicons name="shield-checkmark" size={18} color={COLORS.success} /> : null}
        </View>
        <View style={styles.moneyRow}>
          <AppText variant="label" weight="bold" color={COLORS.primaryStrong}>{money(campaign.raisedAmount)}</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>من {money(campaign.targetAmount)}</AppText>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
        <View style={styles.primaryMeta}>
          <AppText variant="caption" color={COLORS.textSecondary}>{Math.round(progress * 100)}% اكتمل</AppText>
          <AppText variant="caption" color={COLORS.textSecondary}>{campaign.donorCount} متبرع</AppText>
          {remaining !== undefined ? <AppText variant="caption" color={COLORS.textSecondary}>{remaining} أيام متبقية</AppText> : null}
        </View>
        <Button title="تبرع الآن" onPress={onPress} />
      </View>
    </Card>
  );
}

function CompactCampaignCard({ campaign, onPress }: { campaign: DonationCampaign; onPress: () => void }) {
  const progress = progressFor(campaign);
  return (
    <Card onPress={onPress} style={styles.compactCard}>
      <Image source={{ uri: campaign.coverImageUrl }} style={styles.compactImage} />
      <View style={styles.compactBody}>
        <AppText variant="label" weight="bold" numberOfLines={2}>{campaign.title}</AppText>
        <AppText variant="caption" color={COLORS.textSecondary} numberOfLines={2}>{campaign.ownerDisplayName}</AppText>
        <View style={styles.progressTrackSmall}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
        <View style={styles.compactFooter}>
          <AppText variant="caption" color={COLORS.success}>{Math.round(progress * 100)}%</AppText>
          <View style={styles.miniDonate}>
            <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>تبرع</AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

function MetricCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  tone: "green" | "orange" | "blue" | "gray";
}) {
  const background = {
    green: COLORS.successSoft,
    orange: COLORS.primarySoft,
    blue: COLORS.infoSoft,
    gray: COLORS.surfaceMuted,
  }[tone];
  const color = {
    green: COLORS.success,
    orange: COLORS.primaryStrong,
    blue: COLORS.info,
    gray: COLORS.textSecondary,
  }[tone];
  return (
    <Card disabled backgroundColor={background} borderColor={`${color}33`} style={styles.metricCard}>
      <Ionicons name={icon} size={28} color={color} />
      <AppText variant="h2" weight="bold">{value}</AppText>
      <AppText variant="caption" color={COLORS.textSecondary} style={styles.centerText}>{label}</AppText>
    </Card>
  );
}

function RecentTransferRow({ transfer, onPress }: { transfer: DonationTransfer; onPress: () => void }) {
  const meta = TRANSFER_META[transfer.status];
  return (
    <Card onPress={onPress} style={styles.transferCard}>
      <View style={[styles.transferIcon, { backgroundColor: `${meta.color}18` }]}>
        <Ionicons name={meta.icon} size={22} color={meta.color} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label" weight="bold" numberOfLines={2}>{transfer.campaignTitle}</AppText>
        <AppText variant="caption" color={meta.color}>{meta.label}</AppText>
      </View>
      <AppText variant="label" weight="bold">{money(transfer.amount)}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  bodyNarrow: { padding: SPACING.md, gap: SPACING.md },
  headerActions: { flexDirection: "row", direction: "rtl", alignItems: "center" },
  categories: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, paddingEnd: SPACING.xs },
  hero: { minHeight: 310, justifyContent: "flex-end" },
  heroNarrow: { minHeight: 250 },
  heroImage: { borderRadius: RADIUS.xl },
  heroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.backdrop, borderRadius: RADIUS.xl },
  heroCopy: { padding: SPACING.xl, gap: SPACING.sm, alignItems: "flex-start" },
  heroCopyNarrow: { padding: SPACING.lg },
  heroTitle: { width: "100%" },
  heroDescription: { textAlign: "auto", width: "100%", maxWidth: 310 },
  heroButton: { marginTop: SPACING.sm, alignSelf: "flex-start", minHeight: 42, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  primaryCard: { overflow: "hidden" },
  primaryImageWrap: { height: 230, position: "relative" },
  primaryImageWrapNarrow: { height: 190 },
  primaryImage: { width: "100%", height: "100%" },
  urgentBadge: { position: "absolute", top: SPACING.md, right: SPACING.md, backgroundColor: COLORS.danger, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  primaryBody: { padding: SPACING.md, gap: SPACING.sm },
  primaryTitleRow: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.sm },
  moneyRow: { flexDirection: "row", direction: "rtl", alignItems: "baseline", gap: SPACING.xs },
  progressTrack: { height: 10, backgroundColor: COLORS.surfaceMuted, borderRadius: RADIUS.full, overflow: "hidden" },
  progressTrackSmall: { height: 7, backgroundColor: COLORS.surfaceMuted, borderRadius: RADIUS.full, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.success, borderRadius: RADIUS.full },
  primaryMeta: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", justifyContent: "space-between", gap: SPACING.sm },
  compactList: { gap: SPACING.sm },
  compactCard: { flexDirection: "row", direction: "rtl", alignItems: "stretch", gap: SPACING.md, padding: SPACING.sm },
  compactImage: { width: 92, minHeight: 104, borderRadius: RADIUS.md },
  compactBody: { flex: 1, justifyContent: "space-between", gap: SPACING.xs },
  compactFooter: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", alignItems: "center" },
  miniDonate: { backgroundColor: COLORS.primarySoft, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xxs },
  metricsGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  metricCard: { width: "48%", flexGrow: 1, minHeight: 132, alignItems: "center", justifyContent: "center", gap: SPACING.xs },
  centerText: { textAlign: "center" },
  transfersList: { gap: SPACING.sm },
  transferCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm },
  transferIcon: { width: 44, height: 44, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center" },
  emptyDonationCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, backgroundColor: COLORS.surfaceSubtle },
  managerStack: { gap: SPACING.sm },
  managerCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  managerIcon: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
});
