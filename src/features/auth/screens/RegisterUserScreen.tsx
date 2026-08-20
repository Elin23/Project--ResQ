import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import UserAgreementsSection from "../components/register-user/UserAgreementsSection";
import UserBirthDateModal from "../components/register-user/UserBirthDateModal";
import UserPasswordSection from "../components/register-user/UserPasswordSection";
import UserPersonalInfoSection from "../components/register-user/UserPersonalInfoSection";
import { useRegisterUserForm } from "../hooks/useRegisterUserForm";
import { styles } from "./RegisterUser.styles";

export default function RegisterUserScreen() {
  const form = useRegisterUserForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <ScreenHeader
            title={form.accountTitle}
            onBack={form.handleBack}
            horizontalPadding={form.horizontalPadding}
            style={styles.pageHeader}
          />

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
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: form.horizontalPadding }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
          >
            <View style={[styles.content, { width: form.contentWidth }]}>
              <UserPersonalInfoSection form={form} />
              <UserPasswordSection form={form} />
              <UserAgreementsSection form={form} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <UserBirthDateModal form={form} />
    </SafeAreaView>
  );
}
