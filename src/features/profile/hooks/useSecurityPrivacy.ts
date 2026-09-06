import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { getPasswordRequirements } from "@/src/features/auth/utils/passwordRequirements";
import {
  validateNewPassword,
  validatePasswordConfirmation,
} from "@/src/features/auth/utils/passwordResetValidation";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";

import {
  DEFAULT_SECURITY_SETTINGS,
  SECURITY_PRIVACY_CONTENT,
} from "../constants/securityPrivacy";
import type {
  PasswordFormErrors,
  SecurityPrivacyVariant,
  SecurityToggleId,
} from "../types/securityPrivacy";

/**
 * حالة شاشة الأمان والخصوصية للنسختين.
 * التفضيلات وكلمة المرور محفوظة محلياً فقط إلى حين ربط الحساب بالخلفية،
 * تماماً كما في useEditProfileForm.
 */
export function useSecurityPrivacy(variant: SecurityPrivacyVariant) {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { signOut } = useSession();

  const content = SECURITY_PRIVACY_CONTENT[variant];

  const [settings, setSettings] = useState(DEFAULT_SECURITY_SETTINGS);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [savingPassword, setSavingPassword] = useState(false);

  const requirements = useMemo(() => getPasswordRequirements(newPassword), [newPassword]);
  const passwordsMatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  const toggle = (id: SecurityToggleId, value: boolean) => {
    setSettings((previous) => ({ ...previous, [id]: value }));
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const changePassword = async () => {
    const next: PasswordFormErrors = {
      currentPassword: currentPassword ? undefined : "يرجى إدخال كلمة المرور الحالية",
      newPassword: validateNewPassword(newPassword),
      confirmPassword: validatePasswordConfirmation(confirmPassword, newPassword),
    };

    if (!next.newPassword && currentPassword && currentPassword === newPassword) {
      next.newPassword = "كلمة المرور الجديدة يجب أن تختلف عن الحالية";
    }

    setErrors(next);
    if (next.currentPassword || next.newPassword || next.confirmPassword) return;

    try {
      setSavingPassword(true);
      resetPasswordForm();
      showFeedback({
        title: "تم تحديث كلمة المرور",
        message: "استخدم كلمة المرور الجديدة في تسجيل الدخول القادم.",
        tone: "success",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const savePreferences = () => {
    showFeedback({
      title: "تم حفظ التفضيلات",
      message: "تم تحديث إعدادات الأمان والخصوصية.",
      tone: "success",
    });
  };

  const signOutEverywhere = async () => {
    await signOut();
    router.replace(variant === "organization" ? ROUTES.login : ROUTES.welcome);
  };

  return {
    content,
    settings,
    toggle,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    requirements,
    passwordsMatch,
    savingPassword,
    changePassword,
    savePreferences,
    signOutEverywhere,
    openPrivacyPolicy: () => router.push(ROUTES.privacyPolicy),
    goBack: () => router.back(),
  };
}
