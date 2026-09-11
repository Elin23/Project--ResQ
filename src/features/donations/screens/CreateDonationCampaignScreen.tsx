import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import { useSession } from "@/src/features/session/SessionContext";
import {
  ownedCampaignStatusRoute,
} from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { DonationCampaignCategory } from "@/src/domain";
import { useCreateDonationCampaign } from "../hooks/useCreateDonationCampaign";
import { useOwnedDonationCampaign } from "../hooks/useOwnedDonationCampaign";

const CATEGORY_OPTIONS: { key: DonationCampaignCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "medical", label: "علاج", icon: "medkit-outline" },
  { key: "food", label: "طعام", icon: "restaurant-outline" },
  { key: "shelter", label: "مأوى", icon: "home-outline" },
  { key: "rescue", label: "إنقاذ", icon: "heart-outline" },
  { key: "supplies", label: "مستلزمات", icon: "bag-handle-outline" },
  { key: "other", label: "أخرى", icon: "ellipsis-horizontal-outline" },
];

function normalizeDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const iso = new Date(`${trimmed}T23:59:59`);
  return Number.isNaN(iso.getTime()) ? undefined : iso.toISOString();
}

export default function CreateDonationCampaignScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { handlePermission } = usePermissionFeedback();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const { account, can } = useSession();
  const { createDraft, createAndSubmit, updateOwned, updateAndSubmit, saving, error } = useCreateDonationCampaign();
  const editState = useOwnedDonationCampaign(editId, account?.id);
  const hydratedEditId = useRef<string | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DonationCampaignCategory>("rescue");
  const [urgent, setUrgent] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [transferInstructions, setTransferInstructions] = useState("");

  useEffect(() => {
    const campaign = editState.campaign;
    if (!editId || !campaign || hydratedEditId.current === editId) return;
    hydratedEditId.current = editId;
    setImages(campaign.images.length ? campaign.images : campaign.coverImageUrl ? [campaign.coverImageUrl] : []);
    setTitle(campaign.title);
    setShortDescription(campaign.shortDescription);
    setDescription(campaign.description);
    setCategory(campaign.category);
    setUrgent(campaign.urgent);
    setTargetAmount(String(campaign.targetAmount || ""));
    setEndDate(campaign.endsAt ? campaign.endsAt.slice(0, 10) : "");
    setRecipientName(campaign.paymentRecipient?.fullName ?? "");
    const recipientNotes = campaign.paymentRecipient?.notes ?? "";
    const accountMatch = recipientNotes.match(/رقم المستلم\/الحساب:\s*([^\n]+)/);
    setRecipientAccount(campaign.paymentRecipient?.mobile ?? accountMatch?.[1]?.trim() ?? "");
    setTransferInstructions(recipientNotes.replace(/رقم المستلم\/الحساب:\s*[^\n]+\n?/, "").trim());
  }, [editId, editState.campaign]);

  const targetNumber = Number(targetAmount.replace(/[^\d.]/g, ""));
  const canManageCampaigns = Boolean(
    account &&
    account.kind === "organization" &&
    can("manage-campaigns"),
  );
  const formValid = useMemo(
    () =>
      Boolean(
        canManageCampaigns &&
          images.length &&
          title.trim() &&
          shortDescription.trim() &&
          description.trim() &&
          Number.isFinite(targetNumber) &&
          targetNumber > 0 &&
          recipientName.trim().length >= 2 &&
          recipientAccount.trim().length >= 3,
      ),
    [
      canManageCampaigns,
      description,
      images.length,
      shortDescription,
      targetNumber,
      title,
      recipientName,
      recipientAccount,
    ],
  );

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, { title: "صلاحية الصور مطلوبة", message: "اسمح للتطبيق بالوصول إلى الصور لإضافة صور الحملة." })) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, 6 - images.length),
      quality: 0.85,
    });
    if (!result.canceled) {
      const next = result.assets.map((asset) => asset.uri).filter(Boolean);
      setImages((current) => [...current, ...next].slice(0, 6));
    }
  };

  const buildInput = () => {
    if (!account || account.kind !== "organization") {
      throw new Error("هذا الحساب لا يستطيع إنشاء حملات.");
    }
    const end = normalizeDate(endDate);
    if (endDate.trim() && !end) throw new Error("صيغة تاريخ نهاية الحملة غير صحيحة.");
    if (end && Date.parse(end) <= Date.now()) throw new Error("تاريخ نهاية الحملة يجب أن يكون في المستقبل.");

    return {
      ownerAccountId: account.id,
      ownerKind: "organization" as const,
      ownerDisplayName:
        account.displayName ??
        "الجمعية",
      ownerVerified: account.status === "active",
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category,
      urgent,
      coverImageUrl: images[0] ?? "",
      images,
      targetAmount: targetNumber,
      startsAt: editState.campaign?.startsAt ?? new Date().toISOString(),
      endsAt: end,
      paymentRecipient: {
        fullName: recipientName.trim(),
        mobile: recipientAccount.trim(),
        governorate: "",
        notes: transferInstructions.trim() || undefined,
      },
    };
  };

  const saveDraft = async () => {
    if (!title.trim()) {
      showFeedback({ title: "اسم الحملة مطلوب", message: "أدخل اسمًا للحملة على الأقل قبل حفظ المسودة.", tone: "warning" });
      return;
    }
    try {
      const campaign =
        editId && account
          ? await updateOwned(editId, account.id, buildInput())
          : await createDraft(buildInput());
      router.replace(ownedCampaignStatusRoute(campaign.id, account!.kind));
    } catch (cause) {
      showFeedback({ title: editId ? "تعذر حفظ التعديلات" : "تعذر حفظ المسودة", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  };

  const submit = async () => {
    if (!formValid) {
      showFeedback({ title: "بيانات ناقصة", message: "أكمل البيانات المطلوبة قبل إرسال الحملة للمراجعة.", tone: "warning" });
      return;
    }
    try {
      const campaign =
        editId && account
          ? await updateAndSubmit(editId, account.id, buildInput())
          : await createAndSubmit(buildInput());
      router.replace(ownedCampaignStatusRoute(campaign.id, account!.kind));
    } catch (cause) {
      showFeedback({ title: "تعذر إرسال الحملة", message: cause instanceof Error ? cause.message : "حاول مرة أخرى.", tone: "error" });
    }
  };

  if (editId && editState.loading) {
    return <Screen><LoadingState label="جاري تحميل الحملة..." /></Screen>;
  }

  if (editId && (editState.error || !editState.campaign)) {
    return (
      <Screen>
        <ScreenHeader title="تعديل الحملة" onBack={() => router.back()} />
        <ErrorState
          description={editState.error ?? "الحملة غير موجودة أو لا تملك صلاحية تعديلها."}
          onRetry={() => void editState.reload()}
        />
      </Screen>
    );
  }

  if (
    editId &&
    editState.campaign &&
    !["draft", "rejected"].includes(editState.campaign.status)
  ) {
    return (
      <Screen>
        <ScreenHeader title="تعديل الحملة" onBack={() => router.back()} />
        <Card disabled backgroundColor={COLORS.surfaceMuted} style={styles.permissionCard}>
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.textMuted} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">لا يمكن تعديل الحملة في حالتها الحالية</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              يمكن تعديل المسودات والحملات المرفوضة فقط. الحملات المنشورة تُدار عبر الإيقاف والاستئناف والإغلاق دون تعديل محتواها.
            </AppText>
          </View>
        </Card>
      </Screen>
    );
  }

  if (!canManageCampaigns) {
    return (
      <Screen>
        <ScreenHeader title="فتح حملة تبرع" onBack={() => router.back()} />
        <Card disabled backgroundColor={COLORS.dangerSoft} style={styles.permissionCard}>
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.danger} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">هذه الصفحة غير متاحة لهذا الحساب</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              إنشاء الحملات متاح فقط للحسابات النشطة من نوع جمعية أو عيادة بيطرية.
            </AppText>
          </View>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false} safeAreaEdges={["top", "right", "bottom", "left"]}>
      <ScreenHeader
        title={editId ? "تعديل الحملة" : "فتح حملة تبرع"}
        subtitle={
          editId
            ? "عدّل البيانات ثم احفظ أو أعد الإرسال للمراجعة"
            : "احفظها كمسودة أو أرسلها للمراجعة"
        }
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <Card disabled backgroundColor={COLORS.primarySoft} style={styles.noticeCard}>
          <Ionicons name="shield-checkmark-outline" size={23} color={COLORS.primaryStrong} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">الحملة لن تنشر مباشرة</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              بعد الإرسال ستصبح قيد المراجعة، ولا يمكن للحساب المنشئ اعتمادها بنفسه.
            </AppText>
          </View>
        </Card>

        <SectionHeader title="صور الحملة" subtitle="الصورة الأولى ستكون الغلاف الرئيسي" />
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.imageTile}>
              <Image source={{ uri }} style={styles.image} />
              {index === 0 ? (
                <View style={styles.coverBadge}>
                  <AppText variant="caption" color={COLORS.textInverse}>الغلاف</AppText>
                </View>
              ) : null}
              <View style={styles.imageActions}>
                {index > 0 ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="تعيين كغلاف"
                    onPress={() =>
                      setImages((current) => {
                        const copy = [...current];
                        const [selected] = copy.splice(index, 1);
                        return [selected, ...copy];
                      })
                    }
                    style={styles.imageAction}
                  >
                    <Ionicons name="star-outline" size={17} color={COLORS.text} />
                  </Pressable>
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="حذف الصورة"
                  onPress={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  style={styles.imageAction}
                >
                  <Ionicons name="trash-outline" size={17} color={COLORS.danger} />
                </Pressable>
              </View>
            </View>
          ))}
          {images.length < 6 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إضافة صور للحملة"
              onPress={() => void pickImages()}
              style={({ pressed }) => [styles.addImage, pressed && styles.pressed]}
            >
              <Ionicons name="images-outline" size={29} color={COLORS.primaryStrong} />
              <AppText variant="label" weight="medium">إضافة صور</AppText>
              <AppText variant="caption" color={COLORS.textMuted}>{images.length}/6</AppText>
            </Pressable>
          ) : null}
        </View>

        <SectionHeader title="المعلومات الأساسية" />
        <Input label="اسم الحملة" required value={title} onChangeText={setTitle} placeholder="مثال: علاج الحالات المصابة" />
        <Input
          label="وصف مختصر"
          required
          value={shortDescription}
          onChangeText={setShortDescription}
          placeholder="سطر مختصر يظهر في بطاقات الحملة"
        />
        <Input
          label="تفاصيل الحملة"
          required
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          placeholder="اشرح الحالة، الحاجة، وكيف سيتم استخدام التبرعات..."
        />

        <AppText variant="label" weight="medium">نوع الحملة</AppText>
        <View style={styles.chipsRow}>
          {CATEGORY_OPTIONS.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              icon={item.icon}
              selected={category === item.key}
              onPress={() => setCategory(item.key)}
            />
          ))}
        </View>

        <Card
          onPress={() => setUrgent((value) => !value)}
          style={[styles.toggleCard, urgent && styles.toggleCardSelected]}
        >
          <View style={[styles.toggleIcon, urgent && styles.toggleIconSelected]}>
            <Ionicons name="flash-outline" size={20} color={urgent ? COLORS.textInverse : COLORS.danger} />
          </View>
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">حالة عاجلة</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              فعّلها فقط إذا كانت الحملة تحتاج تمويلًا سريعًا لحالة ملحّة.
            </AppText>
          </View>
          <Ionicons name={urgent ? "checkbox" : "square-outline"} size={23} color={urgent ? COLORS.primaryStrong : COLORS.textMuted} />
        </Card>

        <SectionHeader title="الهدف المالي والمدة" />
        <Input
          label="المبلغ المستهدف (ل.س)"
          required
          value={targetAmount}
          onChangeText={(value) => setTargetAmount(value.replace(/[^\d.]/g, ""))}
          keyboardType="numeric"
          contentDirection="ltr"
          placeholder="5000000"
        />
        <Input
          label="تاريخ نهاية الحملة"
          value={endDate}
          onChangeText={setEndDate}
          contentDirection="ltr"
          placeholder="YYYY-MM-DD"
          helperText="اختياري. اتركه فارغًا إذا لم تكن للحملة مدة محددة."
        />

        <SectionHeader title="استلام الحوالات" subtitle="هذه البيانات تظهر للمتبرع مع شركة الحوالات المختارة" />
        <Input
          label="اسم مستلم الحوالة"
          required
          value={recipientName}
          onChangeText={setRecipientName}
          placeholder="الاسم الثلاثي للمستلم"
        />
        <Input
          label="رقم المستلم / رقم الحساب"
          required
          value={recipientAccount}
          onChangeText={setRecipientAccount}
          contentDirection="ltr"
          placeholder="رقم الهاتف أو رقم الحساب المعتمد"
        />
        <Input
          label="تعليمات التحويل"
          value={transferInstructions}
          onChangeText={setTransferInstructions}
          multiline
          numberOfLines={3}
          placeholder="مثال: اذكر اسم الحملة في ملاحظة الحوالة"
        />
        <Card disabled backgroundColor={COLORS.surfaceSubtle} style={styles.recipientNotice}>
          <Ionicons name="information-circle-outline" size={21} color={COLORS.info} />
          <AppText variant="caption" color={COLORS.textSecondary} style={styles.flex}>
            شركة الحوالات نفسها تُدار من الإدارة، بينما بيانات المستلم أعلاه خاصة بهذه الحملة وتُحفظ على الخادم.
          </AppText>
        </Card>

        {error ? <AppText variant="bodySmall" color={COLORS.danger}>{error}</AppText> : null}

        <ActionStack gap={SPACING.md}>
          <Button
            title={editId ? "حفظ وإرسال للمراجعة" : "إرسال الحملة للمراجعة"}
            icon="paper-plane-outline"
            loading={saving}
            disabled={!formValid}
            onPress={() => void submit()}
          />
          <Button
            title={editId ? "حفظ التعديلات" : "حفظ كمسودة"}
            icon="save-outline"
            variant="outline"
            disabled={!title.trim() || saving}
            onPress={() => void saveDraft()}
          />
          <Button title="إلغاء" variant="ghost" disabled={saving} onPress={() => router.back()} />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: SPACING.md },
  noticeCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  permissionCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md, marginTop: SPACING.lg },
  imageGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  imageTile: { width: "48%", height: 160, borderRadius: RADIUS.lg, overflow: "hidden", backgroundColor: COLORS.surfaceMuted, position: "relative" },
  image: { width: "100%", height: "100%" },
  coverBadge: { position: "absolute", right: SPACING.xs, bottom: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.backdrop, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xxs },
  imageActions: { position: "absolute", top: SPACING.xs, left: SPACING.xs, flexDirection: "row", direction: "rtl", gap: SPACING.xs },
  imageAction: { width: 34, height: 34, borderRadius: RADIUS.full, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
  addImage: { width: "48%", height: 160, borderRadius: RADIUS.lg, borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center", gap: SPACING.sm },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  toggleCard: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  toggleCardSelected: { borderColor: COLORS.primaryStrong, backgroundColor: COLORS.primarySoft },
  toggleIcon: { width: 42, height: 42, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerSoft, alignItems: "center", justifyContent: "center" },
  toggleIconSelected: { backgroundColor: COLORS.primaryStrong },
  recipientNotice: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  pressed: { opacity: 0.84 },
  flex: { flex: 1 },
});
