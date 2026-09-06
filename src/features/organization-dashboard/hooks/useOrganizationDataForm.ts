import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useFormFieldNavigation } from "@/src/components/forms/useFormFieldNavigation";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";

import {
  DEFAULT_ORGANIZATION_DATA,
  ORGANIZATION_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_DESCRIPTION_MIN_LENGTH,
} from "../constants/organizationData";
import type { EditableOrganizationData, OrganizationDataErrors } from "../types/organizationData";

const FIELD_KEYS = [
  "name",
  "licenseNumber",
  "issuingAuthority",
  "description",
  "email",
  "phone",
  "website",
  "district",
  "address",
  "workingHours",
  "shelterCapacity",
] as const;

/**
 * حالة شاشة بيانات الجمعية.
 * التعديلات محفوظة محلياً فقط إلى حين ربط الحساب بالخلفية،
 * تماماً كما في useEditProfileForm و useSecurityPrivacy.
 */
export function useOrganizationDataForm() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account } = useSession();
  const fieldNavigation = useFormFieldNavigation(FIELD_KEYS);

  const [form, setForm] = useState<EditableOrganizationData>(() => ({
    ...DEFAULT_ORGANIZATION_DATA,
    name: account?.displayName ?? DEFAULT_ORGANIZATION_DATA.name,
    email: account?.email ?? DEFAULT_ORGANIZATION_DATA.email,
  }));
  const [dirty, setDirty] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [entityTypePickerVisible, setEntityTypePickerVisible] = useState(false);
  const [governoratePickerVisible, setGovernoratePickerVisible] = useState(false);

  const { allowNextNavigation } = useUnsavedChangesGuard(dirty);

  const update = <Key extends keyof EditableOrganizationData>(
    key: Key,
    value: EditableOrganizationData[Key],
  ) => {
    setDirty(true);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleFromList = (key: "activities" | "animals", id: string) => {
    const current = form[key];
    update(key, current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const fieldErrors = useMemo<OrganizationDataErrors>(() => {
    const next: OrganizationDataErrors = {};
    if (!form.name.trim()) next.name = "اسم الجمعية مطلوب";
    if (!form.licenseNumber.trim()) next.licenseNumber = "رقم الترخيص مطلوب";
    if (!form.issuingAuthority.trim()) next.issuingAuthority = "الجهة المانحة للترخيص مطلوبة";
    if (form.description.trim().length < ORGANIZATION_DESCRIPTION_MIN_LENGTH) {
      next.description = `النبذة التعريفية يجب ألا تقل عن ${ORGANIZATION_DESCRIPTION_MIN_LENGTH} حرفاً`;
    }
    if (!form.email.includes("@")) next.email = "البريد الإلكتروني غير صالح";
    if (form.phone.trim().length < 9) next.phone = "رقم الهاتف غير صالح";
    if (!form.district.trim()) next.district = "المنطقة مطلوبة";
    if (!form.activities.length) next.activities = "اختر نشاطاً واحداً على الأقل";
    if (!form.animals.length) next.animals = "اختر نوع حيوان واحد على الأقل";
    if (!form.workingHours.trim()) next.workingHours = "ساعات العمل مطلوبة";
    if (form.hasShelter && !form.shelterCapacity.trim()) next.shelterCapacity = "أدخل سعة المأوى";
    return next;
  }, [form]);

  const validationErrors = useMemo(
    () => Object.values(fieldErrors).filter((message): message is string => Boolean(message)),
    [fieldErrors],
  );

  const errors = showValidation ? fieldErrors : {};
  const descriptionCharCount = form.description.length;

  const save = () => {
    setShowValidation(true);
    if (validationErrors.length) {
      const firstInvalid = FIELD_KEYS.find((key) => key in fieldErrors);
      if (firstInvalid) fieldNavigation.focus(firstInvalid);
      return;
    }

    setDirty(false);
    allowNextNavigation();
    showFeedback({
      title: "تم حفظ بيانات الجمعية",
      message: "ستظهر البيانات المحدّثة في الملف العام للجمعية بعد اعتمادها.",
      tone: "success",
    });
    requestAnimationFrame(() => router.back());
  };

  return {
    form,
    errors,
    validationErrors: showValidation ? validationErrors : [],
    descriptionCharCount,
    descriptionMaxLength: ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    fieldNavigation,
    entityTypePickerVisible,
    openEntityTypePicker: () => setEntityTypePickerVisible(true),
    closeEntityTypePicker: () => setEntityTypePickerVisible(false),
    governoratePickerVisible,
    openGovernoratePicker: () => setGovernoratePickerVisible(true),
    closeGovernoratePicker: () => setGovernoratePickerVisible(false),
    update,
    toggleFromList,
    save,
    cancel: () => router.back(),
  };
}
