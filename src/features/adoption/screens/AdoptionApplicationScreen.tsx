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
import type { ApplicantHousing } from "@/src/domain";
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

export default function AdoptionApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { account, accountKind } = useSession();
  const { showFeedback } = useFeedback();
  const details = useAdoptionDetails();
  const [applicantName, setApplicantName] = useState(account?.displayName ?? "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [housing, setHousing] = useState<ApplicantHousing>("apartment");
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [experience, setExperience] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(
    () => applicantName.trim().length >= 2 && phone.trim().length >= 7 && city.trim().length >= 2 && experience.trim().length >= 10 && reason.trim().length >= 10,
    [applicantName, phone, city, experience, reason],
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
        applicantName,
        phone,
        city,
        housing,
        hasOtherPets,
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

        <Input label="الاسم" value={applicantName} onChangeText={setApplicantName} required />
        <Input label="رقم الهاتف" value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr" required />
        <Input label="المدينة" value={city} onChangeText={setCity} required />

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

        <Input label="خبرتك في رعاية الحيوانات" value={experience} onChangeText={setExperience} multiline required helperText="اذكر تجربتك السابقة وكيف ستعتني بالحيوان." />
        <Input label="لماذا ترغب في التبني؟" value={reason} onChangeText={setReason} multiline required />
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
  section: { width: "100%", gap: SPACING.sm },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.sm },
});
