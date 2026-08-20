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
import type {
  CampaignImpactItem,
  DonationCampaignCategory,
} from "@/src/domain";
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
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [endDate, setEndDate] = useState("");
  const [impactItems, setImpactItems] = useState<CampaignImpactItem[]>([]);
  const [newImpactTitle, setNewImpactTitle] = useState("");
  const [newImpactDescription, setNewImpactDescription] = useState("");
  const [recipientName, setRecipientName] = useState(account?.displayName ?? "");
  const [recipientMobile, setRecipientMobile] = useState("");
  const [recipientGovernorate, setRecipientGovernorate] = useState("");
  const [recipientNotes, setRecipientNotes] = useState("");

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
    setGovernorate(campaign.location.governorate);
    setCity(campaign.location.city ?? "");
    setAddress(campaign.location.address ?? "");
    setEndDate(campaign.endsAt ? campaign.endsAt.slice(0, 10) : "");
    setImpactItems(campaign.impactItems);
    setRecipientName(campaign.paymentRecipient.fullName);
    setRecipientMobile(campaign.paymentRecipient.mobile ?? "");
    setRecipientGovernorate(campaign.paymentRecipient.governorate);
    setRecipientNotes(campaign.paymentRecipient.notes ?? "");
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
          governorate.trim() &&
          impactItems.length &&
          recipientName.trim() &&
          recipientGovernorate.trim(),
      ),
    [
      canManageCampaigns,
      description,
      governorate,
      images.length,
      impactItems.length,
      recipientGovernorate,
      recipientName,
      shortDescription,
      targetNumber,
      title,
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

  const addImpact = () => {
    const titleValue = newImpactTitle.trim();
    if (!titleValue) return;
    setImpactItems((current) => [
      ...current,
      {
        id: `impact-${Date.now()}-${current.length}`,
        title: titleValue,
        description: newImpactDescription.trim() || undefined,
        icon: category === "medical" ? "medkit-outline" : category === "food" ? "restaurant-outline" : "heart-outline",
      },
    ]);
    setNewImpactTitle("");
    setNewImpactDescription("");
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
      location: {
        governorate: governorate.trim(),
        city: city.trim() || undefined,
        address: address.trim() || undefined,
      },
      impactItems,
      targetAmount: targetNumber,
      startsAt: editState.campaign?.startsAt ?? new Date().toISOString(),
      endsAt: end,
      paymentRecipient: {
        fullName: recipientName.trim(),
        mobile: recipientMobile.trim() || undefined,
        governorate: recipientGovernorate.trim(),
        notes: recipientNotes.trim() || undefined,
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
    !["draft", "rejected", "active", "paused"].includes(editState.campaign.status)
  ) {
    return (
      <Screen>
        <ScreenHeader title="تعديل الحملة" onBack={() => router.back()} />
        <Card disabled backgroundColor={COLORS.surfaceMuted} style={styles.permissionCard}>
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.textMuted} />
          <View style={styles.flex}>
            <AppText variant="label" weight="bold">لا يمكن تعديل الحملة في حالتها الحالية</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              يمكن تعديل المسودات والحملات المرفوضة والنشطة والموقوفة مؤقتًا فقط.
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
            ? editState.campaign?.status === "active" || editState.campaign?.status === "paused"
              ? "حدّث تفاصيل الحملة مع الحفاظ على حالتها الحالية"
              : "عدّل البيانات ثم احفظ أو أعد الإرسال للمراجعة"
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

        <SectionHeader title="موقع الحملة" />
        <Input label="المحافظة" required value={governorate} onChangeText={setGovernorate} placeholder="دمشق" />
        <Input label="المدينة / المنطقة" value={city} onChangeText={setCity} placeholder="اختياري" />
        <Input label="العنوان" value={address} onChangeText={setAddress} placeholder="اختياري" />

        <SectionHeader title="ماذا سيحقق تبرعك؟" subtitle="تظهر هذه العناصر في صفحة تفاصيل الحملة" />
        <View style={styles.impactList}>
          {impactItems.map((item) => (
            <Card key={item.id} disabled style={styles.impactItem}>
              <View style={styles.impactIcon}>
                <Ionicons name={(item.icon as keyof typeof Ionicons.glyphMap) ?? "heart-outline"} size={21} color={COLORS.primaryStrong} />
              </View>
              <View style={styles.flex}>
                <AppText variant="label" weight="bold">{item.title}</AppText>
                {item.description ? <AppText variant="caption" color={COLORS.textSecondary}>{item.description}</AppText> : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`حذف ${item.title}`}
                onPress={() => setImpactItems((current) => current.filter((impact) => impact.id !== item.id))}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </Pressable>
            </Card>
          ))}
        </View>
        <Input
          label="عنوان الهدف"
          value={newImpactTitle}
          onChangeText={setNewImpactTitle}
          placeholder="مثال: علاج 5 حالات مصابة"
        />
        <Input
          label="وصف الهدف"
          value={newImpactDescription}
          onChangeText={setNewImpactDescription}
          placeholder="اختياري"
        />
        <Button
          title="إضافة هدف"
          icon="add-outline"
          variant="outline"
          disabled={!newImpactTitle.trim()}
          onPress={addImpact}
        />

        <SectionHeader title="بيانات استلام الحوالات" subtitle="تظهر للمتبرع عند تأكيد الحوالة" />
        <Card disabled backgroundColor={COLORS.surfaceSubtle} style={styles.recipientNotice}>
          <Ionicons name="information-circle-outline" size={21} color={COLORS.info} />
          <AppText variant="caption" color={COLORS.textSecondary} style={styles.flex}>
            استخدم بيانات رسمية ودقيقة. لن تتمكن الحملة من استقبال حوالات صحيحة إذا كانت هذه البيانات خاطئة.
          </AppText>
        </Card>
        <Input label="اسم المستلم الكامل" required value={recipientName} onChangeText={setRecipientName} placeholder="الاسم الثلاثي أو الرباعي" />
        <Input
          label="رقم الموبايل"
          value={recipientMobile}
          onChangeText={setRecipientMobile}
          keyboardType="phone-pad"
          contentDirection="ltr"
          placeholder="اختياري"
        />
        <Input
          label="محافظة المستلم"
          required
          value={recipientGovernorate}
          onChangeText={setRecipientGovernorate}
          placeholder="دمشق"
        />
        <Input
          label="ملاحظات التحويل"
          value={recipientNotes}
          onChangeText={setRecipientNotes}
          multiline
          placeholder="أي تعليمات يجب أن يعرفها المتبرع قبل التحويل"
        />

        {error ? <AppText variant="bodySmall" color={COLORS.danger}>{error}</AppText> : null}

        <ActionStack gap={SPACING.md}>
          {editId && ["active", "paused"].includes(editState.campaign?.status ?? "") ? (
            <Button
              title="حفظ التعديلات"
              icon="save-outline"
              loading={saving}
              disabled={!formValid}
              onPress={() => void saveDraft()}
            />
          ) : (
            <>
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
            </>
          )}
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
  impactList: { gap: SPACING.sm },
  impactItem: { flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.md },
  impactIcon: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  recipientNotice: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.md },
  pressed: { opacity: 0.84 },
  flex: { flex: 1 },
});
