import { ScrollView } from "react-native";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useProfileForm } from "../hooks/useProfileForm";
import { styles } from "./Profile.styles";

export default function ProfileScreen() {
  const form = useProfileForm();
  return <ScrollView contentContainerStyle={styles.container}>
    <Input label="البحث عن ملجأ أو عيادة" placeholder="ابحث هنا..." icon="search" />
    <Input label="رقم التواصل" placeholder="9xx xxx xxx" prefix="+963" keyboardType="phone-pad" value={form.phone} onChangeText={form.setPhone} maxLength={9} />
    <Input label="وصف الحالة" placeholder="اكتب تفاصيل الموقع والحالة الصحية..." multiline />
    <Input label="مثال عن حقل بخطأ" placeholder="بريد إلكتروني" error="صيغة البريد الإلكتروني غير صحيحة" />
    <Button title="إرسال" onPress={form.submit} />
  </ScrollView>;
}
