import { StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import Button from "@/src/components/ui/Button";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import DirectionalIcon from "@/src/components/ui/DirectionalIcon";
import FormSection from "@/src/components/ui/FormSection";
import Input from "@/src/components/ui/Input";
import ListItem from "@/src/components/ui/ListItem";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import PasswordRequirementsCard from "@/src/features/auth/components/password-reset/PasswordRequirementsCard";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { COLORS, ICON_SIZES, LAYOUT, SPACING } from "@/src/theme";

import { useSecurityPrivacy } from "../hooks/useSecurityPrivacy";
import type { SecurityPrivacyVariant } from "../types/securityPrivacy";

type Props = { variant: SecurityPrivacyVariant };

/** إعدادات الأمان والخصوصية، بنسختي الحساب الشخصي وحساب الجمعية. */
export default function SecurityPrivacyScreen({ variant }: Props) {
  const state = useSecurityPrivacy(variant);
  const decision = useDecisionDialog();
  const { content } = state;

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ScreenHeader title={content.title} subtitle={content.subtitle} onBack={state.goBack} />

      <View style={styles.content}>
        <FormSection title={content.passwordSectionTitle} subtitle={content.passwordSectionSubtitle}>
          <Input
            label="كلمة المرور الحالية"
            required
            password
            value={state.currentPassword}
            onChangeText={state.setCurrentPassword}
            error={state.errors.currentPassword}
            textContentType="password"
          />
          <Input
            label="كلمة المرور الجديدة"
            required
            password
            value={state.newPassword}
            onChangeText={state.setNewPassword}
            error={state.errors.newPassword}
            textContentType="newPassword"
          />
          <Input
            label="تأكيد كلمة المرور الجديدة"
            required
            password
            value={state.confirmPassword}
            onChangeText={state.setConfirmPassword}
            error={state.errors.confirmPassword}
            textContentType="newPassword"
          />
          <PasswordRequirementsCard
            requirements={state.requirements}
            confirmationVisible={state.confirmPassword.length > 0}
            passwordsMatch={state.passwordsMatch}
          />
          <Button
            title="تحديث كلمة المرور"
            loading={state.savingPassword}
            onPress={() => void state.changePassword()}
          />
        </FormSection>

        <FormSection title="إعدادات الحساب" subtitle="لا يعرض التطبيق مفاتيح إعدادات وهمية؛ الخيارات غير المدعومة من الخادم لن تظهر حتى تتوفر لها واجهة API فعلية.">
          <ListItem
            title={content.privacyPolicyLabel}
            icon={content.privacyPolicyIcon}
            onPress={state.openPrivacyPolicy}
            trailing={<DirectionalIcon direction="next" size={ICON_SIZES.sm} color={COLORS.iconMuted} />}
          />
        </FormSection>

        <FormSection title={content.sessionsSectionTitle} subtitle={content.sessionsSectionSubtitle}>
          <ActionStack>
            <Button
              title="تسجيل الخروج من كل الأجهزة"
              variant="outline"
              icon="log-out-outline"
              textColor={COLORS.danger}
              onPress={() => decision.request(
                {
                  title: "تسجيل الخروج من كل الأجهزة",
                  message: content.signOutAllMessage,
                  confirmLabel: "إنهاء كل الجلسات",
                  cancelLabel: "تراجع",
                  destructive: true,
                  icon: "log-out-outline",
                },
                state.signOutEverywhere,
              )}
            />
          </ActionStack>
        </FormSection>


      </View>

      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0, paddingBottom: SPACING.xl },
  content: {
    width: "100%",
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
});
