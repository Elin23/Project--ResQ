import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, useWindowDimensions } from "react-native";

import {
  ContactFormErrors,
  MAX_MESSAGE_LENGTH,
  MessageType,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from "../constants/contact";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function useContactUsForm() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { width } = useWindowDimensions();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [message, setMessage] = useState("");
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);
  const remainingCharacters = useMemo(
    () => MAX_MESSAGE_LENGTH - message.length,
    [message.length],
  );

  const handleBack = () =>
    router.canGoBack() ? router.back() : router.replace("/help-center");

  const handleHelpCenter = () => router.push("/help-center");

  const openExternalUrl = async (url: string) => {
    try {
      if (!(await Linking.canOpenURL(url))) {
        showFeedback({ title: "تعذر فتح الرابط", message: "لا يوجد تطبيق مناسب لفتح هذا الرابط على الجهاز.", tone: "error" });
        return false;
      }
      await Linking.openURL(url);
      return true;
    } catch {
      showFeedback({ title: "تعذر فتح الرابط", message: "يرجى المحاولة مرة أخرى لاحقًا.", tone: "error" });
      return false;
    }
  };

  const handleEmail = () => void openExternalUrl(`mailto:${SUPPORT_EMAIL}`);
  const handlePhone = () => {
    if (!SUPPORT_PHONE) return;
    void openExternalUrl(`tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`);
  };

  const validateForm = () => {
    const nextErrors: ContactFormErrors = {};
    if (!fullName.trim()) nextErrors.name = "يرجى إدخال الاسم الكامل.";
    if (!email.trim()) nextErrors.email = "يرجى إدخال البريد الإلكتروني.";
    else if (!isValidEmail(email)) nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح.";
    if (!subject.trim()) nextErrors.subject = "يرجى إدخال موضوع الرسالة.";
    if (!messageType) nextErrors.messageType = "يرجى اختيار نوع الرسالة.";
    if (!message.trim()) nextErrors.message = "يرجى كتابة تفاصيل الرسالة.";
    else if (message.trim().length < 10) nextErrors.message = "يرجى كتابة تفاصيل أوضح لا تقل عن 10 أحرف.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /**
   * Support currently uses the device mail client intentionally. We do not show
   * a fake "sent" state because the app has no support-ticket backend endpoint.
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      showFeedback({ title: "تحقق من البيانات", message: "يرجى تصحيح الحقول الموضحة ثم إعادة المحاولة.", tone: "warning" });
      return;
    }
    setIsSubmitting(true);
    try {
      const body = [
        `الاسم: ${fullName.trim()}`,
        `البريد الإلكتروني: ${email.trim()}`,
        `نوع الرسالة: ${messageType?.label ?? ""}`,
        "",
        message.trim(),
      ].join("\n");
      const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
      const opened = await openExternalUrl(mailUrl);
      if (opened) {
        showFeedback({
          title: "تم فتح تطبيق البريد",
          message: "راجع الرسالة ثم اضغط إرسال من تطبيق البريد لإيصالها إلى فريق الدعم.",
          tone: "info",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName, setFullName, email, setEmail, subject, setSubject,
    messageType, setMessageType, message, setMessage,
    typeModalVisible, setTypeModalVisible, errors, setErrors,
    isSubmitting, horizontalPadding, contentWidth, remainingCharacters,
    handleBack, handleHelpCenter, openExternalUrl, handleEmail, handlePhone, handleSubmit,
  };
}

export type ContactUsForm = ReturnType<typeof useContactUsForm>;
