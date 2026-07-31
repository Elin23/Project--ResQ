import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Linking, useWindowDimensions } from "react-native";

import {
  ContactFormErrors,
  MAX_MESSAGE_LENGTH,
  MessageType,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from "../constants/contact";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function useContactUsForm() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [message, setMessage] = useState("");
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
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
    router.canGoBack() ? router.back() : router.replace("/help-center" as never);

  const handleHelpCenter = () => router.push("/help-center" as never);

  const openExternalUrl = async (url: string) => {
    if (!(await Linking.canOpenURL(url))) {
      Alert.alert("تعذر فتح الرابط", "يرجى المحاولة مرة أخرى لاحقًا.");
      return;
    }
    await Linking.openURL(url);
  };

  const handleEmail = () => void openExternalUrl(`mailto:${SUPPORT_EMAIL}`);
  const handlePhone = () =>
    void openExternalUrl(`tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("السماح بالوصول للصور", "نحتاج إلى إذن الوصول للصور حتى تتمكن من إرفاق صورة.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) setAttachmentUri(result.assets[0].uri);
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("تحقق من البيانات", "يرجى تصحيح الحقول الموضحة ثم إعادة المحاولة.");
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
        attachmentUri ? "\nتم اختيار صورة مرفقة داخل التطبيق." : "",
      ].join("\n");
      const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
      if (!(await Linking.canOpenURL(mailUrl))) {
        Alert.alert("تعذر فتح البريد", "يمكنك مراسلتنا مباشرة عبر support@resq.app");
        return;
      }
      await Linking.openURL(mailUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName, setFullName, email, setEmail, subject, setSubject,
    messageType, setMessageType, message, setMessage, attachmentUri,
    setAttachmentUri, typeModalVisible, setTypeModalVisible, errors, setErrors,
    isSubmitting, horizontalPadding, contentWidth, remainingCharacters,
    handleBack, handleHelpCenter, openExternalUrl, handleEmail, handlePhone, handlePickImage, handleSubmit,
  };
}

export type ContactUsForm = ReturnType<typeof useContactUsForm>;
