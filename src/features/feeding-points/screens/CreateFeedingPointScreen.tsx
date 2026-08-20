import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import StickyActionBar from "@/src/components/ui/StickyActionBar";
import FormValidationSummary from "@/src/components/ui/FormValidationSummary";
import FormSection from "@/src/components/ui/FormSection";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { usePermissionFeedback } from "@/src/hooks/usePermissionFeedback";
import { feedingPointSubmissionDetailsRoute } from "@/src/navigation/routes";
import { COLORS, DENSITY, RADIUS, SPACING } from "@/src/theme";
import FeedingPointLocationPicker, { type FeedingPointLocationValue } from "../components/FeedingPointLocationPicker";
import { useCreateFeedingPointSubmission } from "../hooks/useCreateFeedingPointSubmission";

const DEFAULT_LOCATION: FeedingPointLocationValue = { latitude: 33.5138, longitude: 36.2765 };
const FIELD_KEYS = ["name", "address"] as const;

export default function CreateFeedingPointScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { handlePermission } = usePermissionFeedback();
  const { account, accountKind } = useSession();
  const { submit, submitting, error } = useCreateFeedingPointSubmission();
  const fieldNavigation = useFormFieldNavigation(FIELD_KEYS);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<FeedingPointLocationValue>(DEFAULT_LOCATION);
  const [locating, setLocating] = useState(false);
  const [facilities, setFacilities] = useState<("water" | "shade")[]>([]);
  const [initialStatus, setInitialStatus] = useState<"stocked" | "needsFood">("stocked");
  const [showValidation, setShowValidation] = useState(false);

  const validationErrors = useMemo(() => {
    const next: string[] = [];
    if (!photoUri) next.push("أضف صورة واضحة لنقطة الإطعام.");
    if (!name.trim()) next.push("اسم نقطة الإطعام مطلوب.");
    if (!address.trim()) next.push("العنوان مطلوب.");
    return next;
  }, [address, name, photoUri]);

  const canSubmit = Boolean(account && !submitting);

  const hasUnsavedChanges = useMemo(() => Boolean(
    name || address || description || note || photoUri || facilities.length || initialStatus !== "stocked"
    || location.latitude !== DEFAULT_LOCATION.latitude || location.longitude !== DEFAULT_LOCATION.longitude
  ), [address, description, facilities.length, initialStatus, location, name, note, photoUri]);
  const { allowNextNavigation } = useUnsavedChangesGuard(hasUnsavedChanges && !submitting);

  const toggleFacility = (facility: "water" | "shade") => {
    setFacilities((current) => current.includes(facility)
      ? current.filter((item) => item !== facility)
      : [...current, facility]);
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!handlePermission(permission, { title: "صلاحية الصور مطلوبة", message: "اسمح بالوصول إلى الصور لإضافة صورة واضحة لنقطة الإطعام." })) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) setPhotoUri(result.assets[0].uri);
  };

  const handleUseCurrentLocation = async () => {
    if (locating) return;
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!handlePermission(permission, { title: "صلاحية الموقع مطلوبة", message: "اسمح بالوصول إلى الموقع لتحديد نقطة الإطعام بدقة." })) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      setLocation(next);
      if (!address.trim()) {
        try {
          const [place] = await Location.reverseGeocodeAsync(next);
          const parts = [place?.city, place?.district, place?.street].filter(Boolean);
          if (parts.length) setAddress(parts.join(" - "));
        } catch {
          // Coordinates remain valid even if reverse geocoding is unavailable.
        }
      }
    } catch {
      showFeedback({ title: "تعذر تحديد الموقع", message: "يمكنك اختيار الموقع يدويًا من الخريطة.", tone: "error" });
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!account) return;
    setShowValidation(true);
    if (validationErrors.length || !photoUri) {
      if (!name.trim()) fieldNavigation.focus("name");
      else if (!address.trim()) fieldNavigation.focus("address");
      return;
    }
    try {
      const created = await submit({
        ownerAccountId: account.id,
        ownerAccountKind: account.kind,
        name: name.trim(),
        address: address.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        description: description.trim() || undefined,
        photoUri,
        facilities,
        initialStatus,
        note: note.trim() || undefined,
      });
      allowNextNavigation();
      requestAnimationFrame(() => router.replace(feedingPointSubmissionDetailsRoute(created.id, accountKind)));
    } catch {
      // Hook exposes the localized error below the form.
    }
  };

  return (
    <Screen
      scroll
      padded={false}
      safeAreaEdges={["top", "right", "bottom", "left"]}
      footer={
        <StickyActionBar>
          <ActionStack>
            <Button
              title="إرسال للمراجعة"
              icon="paper-plane-outline"
              loading={submitting}
              disabled={!canSubmit}
              onPress={() => void handleSubmit()}
            />
            <Button title="إلغاء" variant="ghost" onPress={() => router.back()} />
          </ActionStack>
        </StickyActionBar>
      }
    >
      <ScreenHeader title="إضافة نقطة إطعام" subtitle="سيتم نشرها بعد مراجعة الإدارة" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card disabled style={styles.noticeCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primaryStrong} />
          <View style={styles.noticeCopy}>
            <AppText variant="label" weight="bold">مراجعة قبل النشر</AppText>
            <AppText variant="caption" color={COLORS.textSecondary}>
              تأكد من دقة الموقع والصورة. لن تظهر النقطة للعامة حتى تتم الموافقة عليها.
            </AppText>
          </View>
        </Card>

        <FormValidationSummary errors={showValidation ? validationErrors : []} />

        <FormSection title="صورة النقطة" subtitle="صورة واضحة تساعد على التحقق من الموقع والتعرف عليه لاحقًا.">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={photoUri ? "تغيير صورة نقطة الإطعام" : "اختيار صورة نقطة الإطعام"}
            onPress={() => void pickPhoto()}
            style={({ pressed }) => [styles.photoPicker, pressed && styles.pressed]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={30} color={COLORS.primaryStrong} />
                <AppText variant="label" weight="medium">إضافة صورة واضحة</AppText>
                <AppText variant="caption" color={COLORS.textMuted}>تساعد الإدارة والمستخدمين على التعرف على النقطة</AppText>
              </View>
            )}
          </Pressable>
          {showValidation && !photoUri ? <AppText variant="caption" color={COLORS.danger}>صورة النقطة مطلوبة قبل الإرسال.</AppText> : null}
        </FormSection>

        <FormSection title="معلومات النقطة">
          <Input ref={fieldNavigation.ref("name")} label="اسم النقطة" required error={showValidation && !name.trim() ? "أدخل اسمًا واضحًا للنقطة." : undefined} value={name} onChangeText={setName} placeholder="مثال: نقطة إطعام حديقة تشرين" {...fieldNavigation.nextProps("name", "address")} />
          <Input ref={fieldNavigation.ref("address")} label="العنوان" required error={showValidation && !address.trim() ? "أدخل العنوان أو أقرب معلم معروف." : undefined} value={address} onChangeText={setAddress} placeholder="المدينة - المنطقة - أقرب معلم" {...fieldNavigation.doneProps()} />
          <Input label="الوصف" value={description} onChangeText={setDescription} placeholder="صف مكان النقطة وكيفية الوصول إليها" multiline />
        </FormSection>

        <FormSection title="المرافق والحالة" subtitle="اختر ما هو متاح في الموقع وحالة الطعام وقت إرسال الطلب.">
          <AppText variant="label" weight="medium">المرافق</AppText>
          <View style={styles.chipsRow}>
            <Chip label="مياه" icon="water-outline" selected={facilities.includes("water")} onPress={() => toggleFacility("water")} />
            <Chip label="ظل" icon="partly-sunny-outline" selected={facilities.includes("shade")} onPress={() => toggleFacility("shade")} />
          </View>
          <AppText variant="label" weight="medium" style={styles.subFieldLabel}>حالة الطعام الحالية</AppText>
          <View style={styles.chipsRow}>
            <Chip label="متوفر طعام" icon="checkmark-circle-outline" color={COLORS.success} selected={initialStatus === "stocked"} onPress={() => setInitialStatus("stocked")} />
            <Chip label="تحتاج طعام" icon="alert-circle-outline" color={COLORS.warning} selected={initialStatus === "needsFood"} onPress={() => setInitialStatus("needsFood")} />
          </View>
        </FormSection>

        <FormSection title="الموقع الدقيق" subtitle="يمكنك استخدام موقعك الحالي ثم تحريك العلامة إذا لزم.">
          <Button
            title={locating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"}
            icon="locate-outline"
            variant="outline"
            loading={locating}
            onPress={() => void handleUseCurrentLocation()}
          />
          <FeedingPointLocationPicker value={location} onChange={setLocation} />
        </FormSection>

        <FormSection title="ملاحظة للمراجعة" compact>
          <Input
            label="ملاحظة للإدارة"
            value={note}
            onChangeText={setNote}
            placeholder="أي معلومات تساعد في مراجعة الطلب"
            multiline
          />
        </FormSection>

        {error ? <AppText variant="bodySmall" color={COLORS.danger}>{error}</AppText> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg, gap: DENSITY.sectionGap },
  noticeCard: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary + "33",
  },
  noticeCopy: { flex: 1, minWidth: 0, alignItems: "stretch", gap: SPACING.xs },
  photoPicker: {
    width: "100%",
    minHeight: 190,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surfaceSubtle,
  },
  photo: { width: "100%", height: 220 },
  photoPlaceholder: { minHeight: 190, alignItems: "center", justifyContent: "center", gap: SPACING.sm, padding: SPACING.lg },
  chipsRow: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
  subFieldLabel: { marginTop: SPACING.sm },
  pressed: { opacity: 0.82 },
});
