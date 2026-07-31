import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import EntityCapabilitiesSection from "../components/register-entity/EntityCapabilitiesSection";
import EntityDocumentsSection from "../components/register-entity/EntityDocumentsSection";
import EntityLocationSection from "../components/register-entity/EntityLocationSection";
import EntityManagerSection from "../components/register-entity/EntityManagerSection";
import EntityProfileSection from "../components/register-entity/EntityProfileSection";
import EntityRegistrationModals from "../components/register-entity/EntityRegistrationModals";
import EntitySecuritySection from "../components/register-entity/EntitySecuritySection";
import { useRegisterEntityForm } from "../hooks/useRegisterEntityForm";
import { styles } from "./RegisterEntity.styles";

export default function RegisterEntityScreen() {
  const form = useRegisterEntityForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <View style={[styles.topBar, { paddingHorizontal: form.horizontalPadding }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="العودة"
              hitSlop={10}
              onPress={form.handleBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            >
              <Ionicons name="arrow-forward-outline" size={25} color="#332D2A" />
            </Pressable>
            <AppText style={styles.topBarTitle}>إنشاء حساب {form.entityTitle}</AppText>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={[styles.progressArea, { paddingHorizontal: form.horizontalPadding }]}>
            <View style={styles.progressLabels}>
              <AppText style={styles.progressTitle}>بيانات الحساب</AppText>
              <AppText style={styles.stepText}>الخطوة 2 من 3</AppText>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <ScrollView
            ref={form.scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: form.horizontalPadding }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
          >
            <View style={[styles.content, { width: form.contentWidth }]}>
              {form.submitAttempted && Object.keys(form.errors).length > 0 ? (
                <View style={styles.formErrorSummary}>
                  <Ionicons name="alert-circle" size={22} color="#B42335" />
                  <View style={styles.formErrorSummaryTextWrap}>
                    <AppText style={styles.formErrorSummaryTitle}>تعذر إرسال الطلب</AppText>
                    <AppText style={styles.formErrorSummaryText}>
                      راجع الحقول المحددة باللون الأحمر وأكمل المعلومات المطلوبة.
                    </AppText>
                  </View>
                </View>
              ) : null}

              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="information-circle-outline" size={22} color="#B85F1F" />
                  <AppText style={styles.reviewTitle}>حول اعتماد {form.entityTitle}</AppText>
                </View>
                <AppText style={styles.reviewText}>
                  سيقوم فريق ResQ بمراجعة الوثائق والمعلومات الرسمية قبل إظهار{" "}
                  {form.isClinic ? "العيادة" : "الجمعية"} على الخريطة وتفعيل ميزاتها داخل التطبيق.
                </AppText>
              </View>

              <EntityManagerSection form={form} />
              <EntityProfileSection form={form} />
              <EntityLocationSection form={form} />
              <EntityCapabilitiesSection form={form} />
              <EntityDocumentsSection form={form} />
              <EntitySecuritySection form={form} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <EntityRegistrationModals form={form} />
    </SafeAreaView>
  );
}
