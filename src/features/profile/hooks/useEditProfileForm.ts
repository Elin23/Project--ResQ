import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { DEFAULT_PROFILE } from "../constants/profile";

export function useEditProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const update = (key: keyof typeof form, value: string | string[]) => setForm((p) => ({ ...p, [key]: value }));
  const charCount = useMemo(() => form.bio.length, [form.bio]);
  const addSkill = () => Alert.prompt?.("إضافة مهارة", "اكتب اسم المهارة", (value) => value?.trim() && update("skills", [...form.skills, value.trim()]));
  const removeSkill = (skill: string) => update("skills", form.skills.filter((item) => item !== skill));
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1,1], quality: .8 });
    if (!result.canceled) update("avatarUri", result.assets[0].uri);
  };
  const save = () => {
    const next: Record<string,string> = {};
    if (!form.firstName.trim()) next.firstName = "الاسم مطلوب";
    if (!form.email.includes("@")) next.email = "البريد الإلكتروني غير صالح";
    if (form.phone.length < 9) next.phone = "رقم الهاتف غير صالح";
    setErrors(next);
    if (Object.keys(next).length) return;
    Alert.alert("تم الحفظ", "تم تحديث معلومات حسابك بنجاح", [{ text: "حسناً", onPress: () => router.back() }]);
  };
  return { form, errors, update, charCount, addSkill, removeSkill, pickAvatar, save, cancel: () => router.back() };
}
