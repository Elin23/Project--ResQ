import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityProfileSection({ form }: { form: RegisterEntityForm }) {
  const { isClinic, entityName, setEntityName, entityCategory, setEntityCategory, licenseNumber, setLicenseNumber, issuingAuthority, setIssuingAuthority, description, setDescription, showCategories, setShowCategories, errors, setErrors, categories, closeDropdowns, renderError, renderSectionHeader, renderDropdown } = form;
  return (<>
{renderSectionHeader(
  isClinic ? "بيانات العيادة الرسمية" : "بيانات المنظمة الرسمية",
  true,
)}

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.entityName && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={entityName}
      onChangeText={(value) => {
        setEntityName(value);
        setErrors((current) => ({
          ...current,
          entityName: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "الاسم المعتمد للعيادة"
          : "الاسم المعتمد للمنظمة"
      }
      placeholderTextColor={PALETTE.neutral600}
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.entityName)}
</View>

<View style={styles.fieldGroup}>
  <Pressable
    onPress={() => {
      closeDropdowns();
      setShowCategories((current) => !current);
    }}
    style={[
      styles.inputContainer,
      errors.entityCategory && styles.inputContainerError,
    ]}
  >
    <AppText
      style={[
        styles.selectText,
        !entityCategory && styles.selectPlaceholder,
      ]}
    >
      {entityCategory ||
        (isClinic ? "نوع العيادة" : "نوع الكيان")}
    </AppText>
    <Ionicons
      name={
        showCategories
          ? "chevron-up-outline"
          : "chevron-down-outline"
      }
      size={20}
      color={PALETTE.neutral700}
    />
  </Pressable>
  {showCategories
    ? renderDropdown(categories, entityCategory, (item) => {
        setEntityCategory(item);
        setShowCategories(false);
        setErrors((current) => ({
          ...current,
          entityCategory: undefined,
        }));
      })
    : null}
  {renderError(errors.entityCategory)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.licenseNumber && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={licenseNumber}
      onChangeText={(value) => {
        setLicenseNumber(value);
        setErrors((current) => ({
          ...current,
          licenseNumber: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "رقم ترخيص العيادة"
          : "رقم الترخيص، مثال: RGE-2024-XXXX"
      }
      placeholderTextColor={PALETTE.neutral600}
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.licenseNumber)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.inputContainer,
      errors.issuingAuthority && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={issuingAuthority}
      onChangeText={(value) => {
        setIssuingAuthority(value);
        setErrors((current) => ({
          ...current,
          issuingAuthority: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "جهة الإصدار، مثال: نقابة الأطباء البيطريين"
          : "جهة الإصدار، مثال: وزارة الشؤون الاجتماعية"
      }
      placeholderTextColor={PALETTE.neutral600}
      textAlign="right"
      style={styles.input}
    />
  </View>
  {renderError(errors.issuingAuthority)}
</View>

<View style={styles.fieldGroup}>
  <View
    style={[
      styles.textAreaContainer,
      errors.description && styles.inputContainerError,
    ]}
  >
    <TextInput
      value={description}
      onChangeText={(value) => {
        setDescription(value.slice(0, 500));
        setErrors((current) => ({
          ...current,
          description: undefined,
        }));
      }}
      placeholder={
        isClinic
          ? "نبذة عن العيادة وخبرتها والخدمات التي تقدمها..."
          : "تعريف بإيجاز عن أهداف الجمعية وتاريخها..."
      }
      placeholderTextColor={PALETTE.neutral600}
      textAlign="right"
      textAlignVertical="top"
      multiline
      maxLength={500}
      style={styles.textArea}
    />
  </View>
  <AppText style={styles.counterText}>
    {description.length} / 500
  </AppText>
  {renderError(errors.description)}
</View>
  </>);
}
