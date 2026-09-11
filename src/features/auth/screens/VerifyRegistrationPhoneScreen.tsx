import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import OtpCodeInput from "@/src/features/auth/components/password-reset/OtpCodeInput";
import { useSession } from "@/src/features/session/SessionContext";
import { defaultRouteForPrincipal } from "@/src/features/session/sessionNavigation";
import { ROUTES } from "@/src/navigation/routes";
import { authApi } from "@/src/services/api/authApi";
import { authAccountDtoToSession } from "@/src/services/api/authMapper";
import { saveAuthTokens } from "@/src/services/api/authTokens";
import { ApiError } from "@/src/services/api/client";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

const scalar = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;

export default function VerifyRegistrationPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountType?: string;
    flow?: "registration" | "login" | "profile";
    phone?: string;
    name?: string;
    email?: string;
  }>();
  const { startAuthenticatedSession } = useSession();
  const phone = scalar(params.phone) ?? "";
  const flow = scalar(params.flow) ?? "registration";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const sentInitially = useRef(false);

  const maskedPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8) return phone;
    const local = digits.startsWith("963") ? digits.slice(3) : digits;
    return `+963 ${local.slice(0, 2)} XXX XX${local.slice(-2)}`;
  }, [phone]);

  const sendCode = async (initial = false) => {
    if (!phone) {
      setError("لا يوجد رقم هاتف مرتبط بطلب التحقق. يرجى تسجيل الدخول من جديد.");
      return;
    }
    try {
      setIsSending(true);
      setError(undefined);
      setInfo(undefined);
      await authApi.sendPhoneVerification();
      setSeconds(RESEND_SECONDS);
      setInfo(initial ? "أرسلنا رمز تحقق إلى رقم هاتفك." : "تم إرسال رمز تحقق جديد.");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof ApiError
        ? cause.message
        : "تعذر إرسال رمز التحقق. تحقق من الاتصال وحاول مرة أخرى.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (sentInitially.current) return;
    sentInitially.current = true;
    void sendCode(true);
    // The verification endpoint is intentionally sent exactly once on screen entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = async () => {
    if (isSubmitting || isSending) return;
    Keyboard.dismiss();
    if (!/^\d{6}$/.test(code)) {
      setStatus("error");
      setError("أدخل رمز التحقق المكوّن من 6 أرقام.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("verifying");
      setError(undefined);
      const response = await authApi.verifyPhone(code);
      if (!response.accessToken || !response.refreshToken || !response.account?.id) {
        throw new ApiError("تم التحقق لكن استجابة الجلسة غير مكتملة. يرجى تسجيل الدخول مرة أخرى.");
      }
      await saveAuthTokens({
        accessToken: response.accessToken,
        accessTokenExpiresAt: response.accessTokenExpiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      });
      const account = authAccountDtoToSession(response.account);
      await startAuthenticatedSession(account);
      setStatus("success");

      if (flow === "registration") {
        router.replace({
          pathname: ROUTES.registrationSuccess,
          params: { accountType: account.kind },
        });
      } else if (flow === "profile") {
        router.replace(ROUTES.profile);
      } else {
        router.replace(defaultRouteForPrincipal({ kind: "authenticated", account }));
      }
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof ApiError
        ? cause.message
        : "تعذر التحقق من الرمز. تأكد من الرمز ثم حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = () => {
    if (isSubmitting || isSending) return;
    router.replace(ROUTES.login);
  };

  return (
    <Screen scroll surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader title="تأكيد رقم الهاتف" onBack={backToLogin} />

      <View style={styles.heroIcon}>
        <Ionicons name="phone-portrait-outline" size={44} color={COLORS.primaryStrong} />
      </View>
      <AppText variant="h2" weight="bold" align="center" style={styles.title}>
        تحقق من رقم هاتفك
      </AppText>
      <AppText color={COLORS.textSecondary} align="center" style={styles.description}>
        أدخل الرمز الذي أرسلناه إلى {maskedPhone || "رقم الهاتف المسجل"}. لن يتم فتح جلسة الحساب قبل نجاح التحقق.
      </AppText>

      <OtpCodeInput
        value={code}
        length={CODE_LENGTH}
        disabled={isSubmitting || isSending}
        status={status}
        onChangeText={(value) => {
          setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));
          setError(undefined);
          setStatus("idle");
        }}
        onSubmit={verify}
      />

      {info ? <AppText color={COLORS.successDark} align="center" style={styles.message}>{info}</AppText> : null}
      {error ? <AppText color={COLORS.danger} align="center" style={styles.message}>{error}</AppText> : null}

      <Button
        title={isSubmitting ? "جارٍ التحقق..." : "تأكيد الرقم"}
        onPress={() => { void verify(); }}
        disabled={code.length !== CODE_LENGTH || isSubmitting || isSending}
      />
      <Button
        title={seconds > 0 ? `إعادة الإرسال بعد ${seconds} ثانية` : "إعادة إرسال الرمز"}
        variant="outline"
        onPress={() => { void sendCode(false); }}
        disabled={seconds > 0 || isSubmitting || isSending}
      />
      <Button title="العودة إلى تسجيل الدخول" variant="ghost" onPress={backToLogin} disabled={isSubmitting || isSending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  heroIcon: {
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  title: { width: "100%" },
  description: { width: "100%", lineHeight: 26, marginBottom: SPACING.md },
  message: { width: "100%", lineHeight: 24 },
});
