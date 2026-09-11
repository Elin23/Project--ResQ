import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { getPasswordRequirements } from "@/src/features/auth/utils/passwordRequirements";
import {
  validateNewPassword,
  validatePasswordConfirmation,
} from "@/src/features/auth/utils/passwordResetValidation";
import { useSession } from "@/src/features/session/SessionContext";
import { profileApi } from "@/src/services/api/profileApi";
import { ApiError } from "@/src/services/api/client";
import { goBackOrReplace } from "@/src/navigation/helpers";
import { privacyPolicyRoute, ROUTES } from "@/src/navigation/routes";

import { SECURITY_PRIVACY_CONTENT } from "../constants/securityPrivacy";
import type {
  PasswordFormErrors,
  SecurityPrivacyVariant,
} from "../types/securityPrivacy";

export function useSecurityPrivacy(variant: SecurityPrivacyVariant) {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { signOut, signOutAll } = useSession();

  const content = SECURITY_PRIVACY_CONTENT[variant];

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [savingPassword, setSavingPassword] = useState(false);

  const requirements = useMemo(() => getPasswordRequirements(newPassword), [newPassword]);
  const passwordsMatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;


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
      await profileApi.changePassword(currentPassword, newPassword);
      showFeedback({
        title: "تم تغيير كلمة المرور",
        message: "تم تغيير كلمة المرور بنجاح. سجّل الدخول مجددًا بكلمة المرور الجديدة.",
        tone: "success",
      });
      resetPasswordForm();
      await signOut();
      router.replace(ROUTES.login);
    } catch (cause) {
      setErrors((current) => ({
        ...current,
        general: cause instanceof ApiError ? cause.message : "تعذر تغيير كلمة المرور. حاول مرة أخرى.",
      }));
    } finally {
      setSavingPassword(false);
    }
  };

  const signOutEverywhere = async () => {
    await signOutAll();
    router.replace(variant === "organization" ? ROUTES.login : ROUTES.welcome);
  };

  return {
    content,
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
    signOutEverywhere,
    openPrivacyPolicy: () => router.push(privacyPolicyRoute(variant === "organization" ? "organization" : "user")),
    goBack: () => goBackOrReplace(router, variant === "organization" ? ROUTES.organizationProfile : ROUTES.profile),
  };
}
