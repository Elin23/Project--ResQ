import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import ToggleField from "@/src/components/ui/ToggleField";
import { PALETTE } from "@/src/theme";
import { styles } from "../../screens/RegisterEntity.styles";
import type { RegisterEntityForm } from "../../hooks/useRegisterEntityForm";

export default function EntityCapabilitiesSection({ form }: { form: RegisterEntityForm }) {
  const { isClinic, entityTitle, selectedActivities, setSelectedActivities, selectedAnimals, setSelectedAnimals, hasShelter, setHasShelter, shelterCapacity, setShelterCapacity, acceptsVolunteers, setAcceptsVolunteers, volunteerRequirements, setVolunteerRequirements, open24Hours, setOpen24Hours, workingHours, setWorkingHours, homeVisits, setHomeVisits, emergencyService, setEmergencyService, errors, setErrors, activityOptions, animalOptions, toggleValue, renderError, renderSectionHeader, renderChips } = form;
  return (<>
{renderSectionHeader(
  isClinic
    ? "الخدمات والحيوانات التي تعالجها"
    : "الأنشطة والخدمات المقدمة",
  true,
)}

<AppText style={styles.subLabel}>
  {isClinic ? "الخدمات المتوفرة" : "نوع الأنشطة"}
</AppText>
{renderChips(activityOptions, selectedActivities, (id) =>
  toggleValue(
    id,
    selectedActivities,
    setSelectedActivities,
    "activities",
  ),
)}
{renderError(errors.activities)}

<AppText style={[styles.subLabel, styles.subLabelSpacing]}>
  الحيوانات التي تخدمها {entityTitle}
</AppText>
{renderChips(animalOptions, selectedAnimals, (id) =>
  toggleValue(id, selectedAnimals, setSelectedAnimals, "animals"),
)}
{renderError(errors.animals)}

{isClinic ? (
  <>
    <ToggleField label="هل العيادة مفتوحة 24 ساعة؟" description="فعّل الخيار فقط إذا كانت الخدمة متاحة طوال اليوم." value={open24Hours} onValueChange={setOpen24Hours} />

    {!open24Hours ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.inputContainer,
            errors.workingHours && styles.inputContainerError,
          ]}
        >
          <Ionicons
            name="time-outline"
            size={21}
            color={PALETTE.neutral700}
          />
          <TextInput
            value={workingHours}
            onChangeText={(value) => {
              setWorkingHours(value);
              setErrors((current) => ({
                ...current,
                workingHours: undefined,
              }));
            }}
            placeholder="أوقات الدوام، مثال: 9 صباحاً - 9 مساءً"
            placeholderTextColor={PALETTE.neutral600}
            textAlign="right"
            style={styles.input}
          />
        </View>
        {renderError(errors.workingHours)}
      </View>
    ) : null}

    <ToggleField label="هل تتوفر زيارات منزلية؟" description="يمكن للمستخدمين طلب زيارة بيطرية للمنزل." value={homeVisits} onValueChange={setHomeVisits} />

    <ToggleField label="استقبال حالات إسعافية؟" description="يظهر هذا الخيار للمستخدمين ضمن معلومات العيادة." value={emergencyService} onValueChange={setEmergencyService} />
  </>
) : (
  <>
    <ToggleField label="هل تتوفر لديكم منشأة إيواء؟" description="أضف تفاصيل السعة إذا كانت الجمعية تمتلك مأوى." value={hasShelter} onValueChange={setHasShelter} />

    {hasShelter ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.inputContainer,
            errors.shelterCapacity && styles.inputContainerError,
          ]}
        >
          <TextInput
            value={shelterCapacity}
            onChangeText={(value) => {
              setShelterCapacity(
                value.replace(/\D/g, "").slice(0, 4),
              );
              setErrors((current) => ({
                ...current,
                shelterCapacity: undefined,
              }));
            }}
            placeholder="سعة منشأة الإيواء"
            placeholderTextColor={PALETTE.neutral600}
            keyboardType="number-pad"
            textAlign="right"
            style={styles.input}
          />
        </View>
        {renderError(errors.shelterCapacity)}
      </View>
    ) : null}

    <ToggleField label="تستقبلون متطوعين؟" description="يمكن للمستخدمين إرسال طلبات انضمام للجمعية." value={acceptsVolunteers} onValueChange={setAcceptsVolunteers} />

    {acceptsVolunteers ? (
      <View style={styles.fieldGroup}>
        <View
          style={[
            styles.textAreaContainer,
            errors.volunteerRequirements &&
              styles.inputContainerError,
          ]}
        >
          <TextInput
            value={volunteerRequirements}
            onChangeText={(value) => {
              setVolunteerRequirements(value.slice(0, 350));
              setErrors((current) => ({
                ...current,
                volunteerRequirements: undefined,
              }));
            }}
            placeholder="أدخل شروط أو متطلبات انضمام المتطوعين..."
            placeholderTextColor={PALETTE.neutral600}
            multiline
            maxLength={350}
            textAlign="right"
            textAlignVertical="top"
            style={styles.textArea}
          />
        </View>
        {renderError(errors.volunteerRequirements)}
      </View>
    ) : null}
  </>
)}
  </>);
}
