import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import type { ApplicantHousing, PetExperienceLevel } from "@/src/domain";
import { useSession } from "@/src/features/session/SessionContext";
import { adoptionApplicationDetailsRoute } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, SPACING } from "@/src/theme";
import { useAdoptionDetails } from "../hooks/useAdoptionDetails";

const HOUSING_OPTIONS: { value: ApplicantHousing; label: string }[] = [
  { value: "apartment", label: "شقة" },
  { value: "house", label: "منزل" },
  { value: "farm", label: "مزرعة" },
  { value: "other", label: "أخرى" },
];

const EXPERIENCE_OPTIONS: { value: PetExperienceLevel; label: string }[] = [
  { value: "none", label: "لا خبرة سابقة" },
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "خبرة متوسطة" },
  { value: "experienced", label: "خبير" },
];

export default function AdoptionApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { account, accountKind } = useSession();
  const { showFeedback } = useFeedback();
  const details = useAdoptionDetails();
  const [housing, setHousing] = useState<ApplicantHousing>("apartment");
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [hasOutdoorSpace, setHasOutdoorSpace] = useState(false);
  const [experience, setExperience] = useState<PetExperienceLevel>("none");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(
    () => reason.trim().length >= 5,
    [reason],
  );

  if (details.loading) return <Screen><LoadingState label="جاري تجهيز طلب التبني..." /></Screen>;
  if (details.error) return <Screen><ErrorState description={details.error} onRetry={() => void details.reload()} /></Screen>;
  if (!details.listing || !id) return <Screen><EmptyState title="الحيوان غير متاح" description="قد يكون الإعلان مغلقًا أو غير متاح للتبني حاليًا." /></Screen>;
  if (!account) return null;

  const listing = details.listing;
  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const application = await repositories.adoptionApplications.submit({
        listingId: listing.id,
        applicantAccountId: account.id,
        applicantName: account.displayName ?? "",
        phone: account.phone ?? "",
        city: "",
        housing,
        hasOtherPets,
        hasOutdoorSpace,
        experience,
        reason,
        notes,
      });
      router.replace(adoptionApplicationDetailsRoute(application.id, accountKind));
    } catch (error) {
      showFeedback({ title: "تعذر إرسال الطلب", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <ScreenHeader title="طلب تبني" subtitle={`التقدم لتبني ${listing.animalName}`} onBack={() => router.back()} />
      <View style={styles.body}>
        <Card disabled style={styles.notice}>
          <AppText variant="h3" weight="bold">خصوصيتك محفوظة</AppText>
          <AppText color={COLORS.textSecondary}>لن تظهر معلومات التواصل الخاصة بين الطرفين قبل قبول الطلب. راجع بياناتك قبل الإرسال.</AppText>
        </Card>

        <Card disabled style={styles.profileCard}>
          <AppText variant="label" weight="bold">بيانات مقدم الطلب من الملف الشخصي</AppText>
          <AppText variant="bodySmall" color={COLORS.textSecondary}>
            {account.displayName || "الحساب"}{account.phone ? ` • ${account.phone}` : ""}. لن نرسل بيانات اتصال يدوية مختلفة عن حسابك الموثق.
          </AppText>
        </Card>

        <View style={styles.section}>
          <AppText variant="label" weight="medium">نوع السكن</AppText>
          <View style={styles.chips}>
            {HOUSING_OPTIONS.map((option) => <Chip key={option.value} label={option.label} selected={housing === option.value} onPress={() => setHousing(option.value)} />)}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="label" weight="medium">هل لديك حيوانات أخرى؟</AppText>
          <View style={styles.chips}>
            <Chip label="نعم" selected={hasOtherPets} onPress={() => setHasOtherPets(true)} />
            <Chip label="لا" selected={!hasOtherPets} onPress={() => setHasOtherPets(false)} />
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="label" weight="medium">هل تتوفر مساحة خارجية آمنة؟</AppText>
          <View style={styles.chips}>
            <Chip label="نعم" selected={hasOutdoorSpace} onPress={() => setHasOutdoorSpace(true)} />
            <Chip label="لا" selected={!hasOutdoorSpace} onPress={() => setHasOutdoorSpace(false)} />
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="label" weight="medium">مستوى الخبرة في رعاية الحيوانات</AppText>
          <View style={styles.chips}>
            {EXPERIENCE_OPTIONS.map((option) => <Chip key={option.value} label={option.label} selected={experience === option.value} onPress={() => setExperience(option.value)} />)}
          </View>
        </View>
        <Input label="لماذا ترغب في التبني؟" value={reason} onChangeText={setReason} multiline required helperText="خمسة أحرف على الأقل." />
        <Input label="ملاحظات إضافية" value={notes} onChangeText={setNotes} multiline />

        <ActionStack>
          <Button title="إرسال طلب التبني" icon="heart-outline" onPress={() => void submit()} loading={submitting} disabled={!valid} />
          <Button title="إلغاء" variant="outline" onPress={() => router.back()} />
        </ActionStack>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  body: { padding: SPACING.lg, gap: SPACING.md },
  notice: { gap: SPACING.xs },
  profileCard: { gap: SPACING.xs },
  section: { width: "100%", gap: SPACING.sm },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
});
