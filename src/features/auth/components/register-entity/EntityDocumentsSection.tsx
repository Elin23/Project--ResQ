import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityDocumentsSection({ form }: { form: RegisterEntityForm }) {
  const { isClinic, entityTitle, logo, licenseDocument, managerDocument, extraDocument, errors, pickImage, renderError, renderSectionHeader, renderUploadCard } = form;
  return (<>
{renderSectionHeader("هوية الجهة والثبوتيات", true)}

<Pressable
  onPress={() => pickImage("logo")}
  style={styles.logoUploadCard}
>
  {logo ? (
    <Image source={{ uri: logo }} style={styles.logoPreview} />
  ) : (
    <Ionicons name="image-outline" size={35} color={COLORS.iconMuted} />
  )}
  <AppText style={styles.logoUploadTitle}>
    شعار {entityTitle} (اختياري)
  </AppText>
  <AppText style={styles.uploadSubtitle}>
    استخدم صورة واضحة بصيغة JPG أو PNG
  </AppText>
</Pressable>

{renderUploadCard(
  "license",
  isClinic ? "صورة ترخيص العيادة" : "شهادة الترخيص الرسمية",
  "صيغة JPG أو PNG وبجودة واضحة",
  licenseDocument,
  true,
)}
{renderError(errors.licenseDocument)}

{renderUploadCard(
  "manager",
  "تفويض مدير الحساب",
  "اختياري إذا لم يكن مقدم الطلب صاحب الترخيص",
  managerDocument,
)}

{renderUploadCard(
  "extra",
  isClinic
    ? "ترخيص الطبيب المسؤول"
    : "النظام الداخلي أو سياسة الجمعية",
  isClinic
    ? "اختياري عند توفره"
    : "اختياري ويساعد في تسريع التحقق",
  extraDocument,
)}
  </>);
}
