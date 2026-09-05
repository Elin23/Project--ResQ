import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ImageBackground, Pressable, Share, StyleSheet, View } from "react-native";
import { useMemo, useState } from "react";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import IconButton from "@/src/components/ui/IconButton";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ReadingSection from "@/src/components/ui/ReadingSection";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useFavorites } from "@/src/features/favorites";
import { useSession } from "@/src/features/session/SessionContext";
import { donationCampaignOwnerRoute, donationCheckoutRoute, organizationDetailsRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationCampaign } from "@/src/domain";
import { useDonationCampaignDetails } from "../hooks/useDonationCampaignDetails";

const QUICK_AMOUNTS = [25000, 50000, 100000, 250000] as const;

function money(value: number) {
  return `${new Intl.NumberFormat("ar-SY").format(Math.round(value))} ل.س`;
}

function progressFor(campaign: DonationCampaign) {
  return Math.min(1, campaign.targetAmount ? campaign.raisedAmount / campaign.targetAmount : 0);
}

function daysRemaining(campaign: DonationCampaign) {
  if (!campaign.endsAt) return undefined;
  return Math.max(0, Math.ceil((Date.parse(campaign.endsAt) - Date.now()) / 86400000));
}

export default function DonationCampaignDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accountKind } = useSession();
  const { showFeedback } = useFeedback();
  const { isFavorite, toggleFavorite } = useFavorites();
  const state = useDonationCampaignDetails(id);
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const amount = useMemo(() => {
    const custom = Number(customAmount.replace(/[^\d]/g, ""));
    return custom > 0 ? custom : selectedAmount;
  }, [customAmount, selectedAmount]);

  if (state.loading) return <Screen><LoadingState label="جاري تحميل الحملة..." /></Screen>;
  if (state.error) return <Screen><ErrorState description={state.error} onRetry={() => void state.reload()} /></Screen>;
  if (!state.campaign) {
    return <Screen><EmptyState title="الحملة غير موجودة" description="قد تكون الحملة مغلقة أو لم تعد متاحة للعامة." /></Screen>;
  }

  const campaign = state.campaign;
  const progress = progressFor(campaign);
  const remaining = daysRemaining(campaign);
  const canDonate = campaign.status === "active";
  const favorite = isFavorite("campaign", campaign.id);

  const handleToggleFavorite = () => {
    const added = toggleFavorite({ kind: "campaign", id: campaign.id, title: campaign.title });
    showFeedback({
      title: added ? "تمت الإضافة إلى المحفوظات" : "تمت الإزالة من المحفوظات",
      message: added
        ? `${campaign.title} صارت ضمن حملاتك المحفوظة.`
        : `${campaign.title} انشالت من حملاتك المحفوظة.`,
      tone: added ? "success" : "info",
    });
  };

  const shareCampaign = () =>
    Share.share({
      title: campaign.title,
      message: `${campaign.title}\n${campaign.shortDescription}\n${campaign.ownerDisplayName}`,
    });

  const openOwner = () => {
    if (campaign.ownerKind === "organization") {
      router.push(organizationDetailsRoute(campaign.ownerAccountId));
      return;
    }
    router.push(donationCampaignOwnerRoute(campaign.id, accountKind));
  };

  const goToCheckout = () => {
    if (!canDonate || amount <= 0) return;
    router.push(
      donationCheckoutRoute(campaign.id, accountKind, {
        amount,
        supportMessage: supportMessage.trim() || undefined,
      }),
    );
  };

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.screenContent}>
      <ScreenHeader
        title="تفاصيل الحملة"
        onBack={() => router.back()}
        right={
          <View style={styles.headerActions}>
            <IconButton icon="share-social-outline" accessibilityLabel="مشاركة الحملة" onPress={() => void shareCampaign()} />
            <IconButton
              icon={favorite ? "heart" : "heart-outline"}
              color={favorite ? COLORS.danger : COLORS.icon}
              accessibilityLabel={favorite ? "إزالة من المحفوظات" : "حفظ الحملة"}
              selected={favorite}
              onPress={handleToggleFavorite}
            />
            <IconButton icon="ellipsis-vertical" accessibilityLabel="خيارات الحملة" onPress={() => void shareCampaign()} />
          </View>
        }
      />

      <View style={styles.body}>
        <ImageBackground source={{ uri: campaign.coverImageUrl }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroScrim} />
          {campaign.urgent ? (
            <View style={styles.urgentPill}>
              <Ionicons name="sparkles" size={14} color={COLORS.textInverse} />
              <AppText variant="caption" weight="bold" color={COLORS.textInverse}>الأكثر احتياجًا</AppText>
            </View>
          ) : null}
          <View style={styles.heroDonationPill}>
            <AppText variant="caption" weight="bold" color={COLORS.textInverse}>تبرعات طارئة</AppText>
          </View>
          <AppText variant="h1" weight="bold" color={COLORS.textInverse} style={styles.heroCampaignTitle}>
            {campaign.title}
          </AppText>
        </ImageBackground>

        <View style={styles.ownerRow}>
          {campaign.ownerLogoUrl ? (
            <Image source={{ uri: campaign.ownerLogoUrl }} style={styles.ownerLogo} />
          ) : (
            <View style={styles.ownerLogoFallback}>
              <Ionicons name={"people-outline"} size={22} color={COLORS.primaryStrong} />
            </View>
          )}
          <View style={styles.flex}>
            <View style={styles.verifiedRow}>
              <AppText variant="label" weight="bold">{campaign.ownerDisplayName}</AppText>
              {campaign.ownerVerified ? <Ionicons name="shield-checkmark" size={17} color={COLORS.success} /> : null}
            </View>
            <AppText variant="caption" color={COLORS.textSecondary}>
              {campaign.location.city ?? campaign.location.governorate} • سوريا
            </AppText>
          </View>
        </View>

        <Card disabled style={styles.progressCard}>
          <AppText variant="caption" color={COLORS.textSecondary}>المبلغ المجموع</AppText>
          <View style={styles.amountRow}>
            <AppText variant="h1" weight="bold" color={COLORS.primaryStrong}>{money(campaign.raisedAmount)}</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>الهدف: {money(campaign.targetAmount)}</AppText>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
          <View style={styles.statsRow}>
            <Stat icon="people-outline" label={`${campaign.donorCount} متبرع`} />
            {remaining !== undefined ? <Stat icon="time-outline" label={`متبقي ${remaining} يومًا`} /> : null}
          </View>
        </Card>

        <ReadingSection title="عن الحملة">
          <AppText variant="bodyLarge" color={COLORS.textSecondary}>{campaign.description}</AppText>
        </ReadingSection>

        <ReadingSection title="ماذا سيحقق تبرعك؟" subtitle="أثر المساهمة كما حددته الجهة صاحبة الحملة">
          <View style={styles.impactGrid}>
            {campaign.impactItems.map((item) => (
              <Card key={item.id} disabled style={styles.impactCard}>
                <View style={styles.impactIcon}>
                  <Ionicons
                    name={(item.icon as keyof typeof Ionicons.glyphMap) ?? "heart-outline"}
                    size={22}
                    color={COLORS.primaryStrong}
                  />
                </View>
                <AppText variant="label" weight="medium" align="center">{item.title}</AppText>
                {item.description ? (
                  <AppText variant="caption" color={COLORS.textSecondary} align="center">{item.description}</AppText>
                ) : null}
              </Card>
            ))}
          </View>
        </ReadingSection>

        <Card disabled style={styles.ownerCard}>
          <View style={styles.ownerProfileRow}>
            <View style={styles.ownerProfileIcon}>
              <Ionicons
                name={"home-outline"}
                size={23}
                color={COLORS.primaryStrong}
              />
            </View>
            <View style={styles.flex}>
              <AppText variant="h3" weight="bold">{campaign.ownerDisplayName}</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>
                جهة موثقة تعمل في رعاية وإنقاذ الحيوانات
              </AppText>
            </View>
          </View>
          <Button title="عرض الملف التعريفي" variant="outline" onPress={openOwner} />
        </Card>

        <ReadingSection title="اختر مبلغ التبرع" subtitle="يمكنك اختيار مبلغ سريع أو إدخال قيمة أخرى">
          <View style={styles.amountGrid}>
            {QUICK_AMOUNTS.map((value) => {
              const selected = !customAmount && selectedAmount === value;
              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setSelectedAmount(value);
                    setCustomAmount("");
                  }}
                  style={({ pressed }) => [
                    styles.amountChoice,
                    selected && styles.amountChoiceSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    variant="label"
                    weight={selected ? "bold" : "medium"}
                    color={selected ? COLORS.primaryStrong : COLORS.text}
                    align="center"
                  >
                    {money(value)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <Input
            label="مبلغ آخر"
            value={customAmount}
            onChangeText={(value) => setCustomAmount(value.replace(/[^\d]/g, ""))}
            placeholder="أدخل مبلغًا آخر"
            keyboardType="numeric"
            icon="cash-outline"
            contentDirection="ltr"
          />

          <Input
            label="رسالة دعم (اختياري)"
            value={supportMessage}
            onChangeText={setSupportMessage}
            placeholder="اكتب رسالة قصيرة لدعم الحملة..."
            multiline
            numberOfLines={4}
            inputStyle={styles.messageInput}
          />
        </ReadingSection>

        {!canDonate ? (
          <Card disabled backgroundColor={COLORS.surfaceMuted} style={styles.closedCard}>
            <Ionicons name="information-circle-outline" size={22} color={COLORS.textSecondary} />
            <View style={styles.flex}>
              <AppText variant="label" weight="bold">الحملة لا تستقبل تبرعات جديدة</AppText>
              <AppText variant="caption" color={COLORS.textSecondary}>يمكنك مشاركة الحملة أو الاطلاع على تفاصيلها فقط.</AppText>
            </View>
          </Card>
        ) : null}

        <ActionStack>
          <Button
            title={`تبرع الآن • ${money(amount)}`}
            icon="heart"
            disabled={!canDonate || amount <= 0}
            onPress={goToCheckout}
          />
          <Button
            title="مشاركة الحملة"
            icon="share-social-outline"
            variant="outline"
            onPress={() => void shareCampaign()}
          />
        </ActionStack>
      </View>
    </Screen>
  );
}

function Stat({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={17} color={COLORS.primaryStrong} />
      <AppText variant="caption" color={COLORS.textSecondary}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.xl },
  headerActions: { flexDirection: "row", direction: "rtl", alignItems: "center" },
  hero: { minHeight: 330, justifyContent: "flex-end", padding: SPACING.lg, position: "relative" },
  heroImage: { borderRadius: RADIUS.xl },
  heroScrim: { ...StyleSheet.absoluteFillObject, borderRadius: RADIUS.xl, backgroundColor: "rgba(0,0,0,0.22)" },
  urgentPill: { position: "absolute", top: SPACING.md, right: SPACING.md, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xxs, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.danger, borderRadius: RADIUS.full },
  heroDonationPill: { position: "absolute", right: SPACING.md, bottom: 70, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.info, borderRadius: RADIUS.full },
  heroCampaignTitle: { width: "100%", textAlign: "auto" },
  ownerRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  ownerLogo: { width: 54, height: 54, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceMuted },
  ownerLogoFallback: { width: 54, height: 54, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  verifiedRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  progressCard: { gap: SPACING.sm },
  amountRow: { flexDirection: "row", direction: "rtl", alignItems: "baseline", justifyContent: "space-between", gap: SPACING.sm },
  progressTrack: { height: 11, backgroundColor: COLORS.surfaceMuted, borderRadius: RADIUS.full, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.success, borderRadius: RADIUS.full },
  statsRow: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", flexWrap: "wrap", gap: SPACING.sm },
  stat: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs },
  impactGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  impactCard: { width: "31%", flexGrow: 1, minWidth: 100, minHeight: 128, alignItems: "center", justifyContent: "center", gap: SPACING.sm },
  impactIcon: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  ownerCard: { gap: SPACING.md, backgroundColor: COLORS.surfaceSubtle },
  ownerProfileRow: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  ownerProfileIcon: { width: 52, height: 52, borderRadius: RADIUS.full, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
  amountGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  amountChoice: { width: "48%", flexGrow: 1, minHeight: 58, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.borderStrong, borderRadius: RADIUS.lg, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
  amountChoiceSelected: { borderWidth: 2, borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft },
  messageInput: { minHeight: 92, paddingVertical: SPACING.sm },
  closedCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  flex: { flex: 1 },
});
