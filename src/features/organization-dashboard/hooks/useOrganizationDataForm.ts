import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { validateOpeningHours, type DailyOpeningHours } from "@/src/domain/service-places";
import { ApiError } from "@/src/services/api/client";
import { fetchMyOrganization, updateMyOrganization } from "@/src/services/api/organizationsApi";
import { uploadLocalMediaUris } from "@/src/services/api/uploadsApi";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";

import { ORGANIZATION_DESCRIPTION_MAX_LENGTH } from "../constants/organizationData";
import type { EditableOrganizationData, OrganizationDataErrors, OrganizationIdentityData } from "../types/organizationData";

const DAY_INDEX: Record<string, DailyOpeningHours["day"]> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};
const DAY_KEY = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

const emptyForm: EditableOrganizationData = {
  description: "",
  phone: "",
  website: "",
  activities: [],
  openingHours: [],
  logoUri: "",
};

const emptyIdentity: OrganizationIdentityData = {
  name: "",
  licenseNumber: "",
  registrationNumber: "",
  email: "",
  governorateName: "",
  regionName: "",
  address: "",
  verificationStatus: "",
};

function toOpeningHours(input: Awaited<ReturnType<typeof fetchMyOrganization>>["operatingHours"]): DailyOpeningHours[] {
  const byDay = new Map<number, DailyOpeningHours>();
  for (const item of input ?? []) {
    const day = DAY_INDEX[(item.dayOfWeek ?? "").toUpperCase()];
    if (day == null) continue;
    byDay.set(day, {
      day,
      open: item.isClosed ? null : item.isOpen24Hours ? "00:00" : item.opensAt ?? null,
      close: item.isClosed ? null : item.isOpen24Hours ? "23:59" : item.closesAt ?? null,
    });
  }
  return Array.from({ length: 7 }, (_, day) => byDay.get(day) ?? ({ day: day as DailyOpeningHours["day"], open: null, close: null }));
}

function cleanPhone(value: string) {
  return value.trim().replace(/[\u200e\u200f]/g, "");
}

export function useOrganizationDataForm() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const [form, setForm] = useState<EditableOrganizationData>(emptyForm);
  const [original, setOriginal] = useState<EditableOrganizationData>(emptyForm);
  const [identity, setIdentity] = useState<OrganizationIdentityData>(emptyIdentity);
  const [location, setLocation] = useState<{ governorateId: number; regionId: number; address: string; latitude: number; longitude: number } | null>(null);
  const [errors, setErrors] = useState<OrganizationDataErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { allowNextNavigation } = useUnsavedChangesGuard(dirty);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      const dto = await fetchMyOrganization();
      const next: EditableOrganizationData = {
        description: dto.description ?? "",
        phone: dto.phone ?? "",
        website: dto.website ?? "",
        activities: (dto.services ?? []).map((value) => value.toLowerCase()),
        openingHours: toOpeningHours(dto.operatingHours),
        logoUri: dto.logoUrl ?? "",
      };
      setForm(next);
      setOriginal(next);
      setIdentity({
        name: dto.name ?? "",
        licenseNumber: dto.licenseNumber ?? "",
        registrationNumber: dto.registrationNumber ?? "",
        email: dto.email ?? "",
        governorateName: dto.place?.governorateName ?? "",
        regionName: dto.place?.regionName ?? "",
        address: dto.place?.address ?? "",
        verificationStatus: dto.verificationStatus ?? "",
      });
      if (!dto.place) {
        setLocation(null);
        setErrors({ general: "لا يوجد موقع مرتبط بحساب الجمعية بعد. أكمل اعتماد الموقع من لوحة الإدارة قبل تعديل البيانات التشغيلية." });
      } else {
        setLocation({
          governorateId: dto.place.governorateId,
          regionId: dto.place.regionId,
          address: dto.place.address ?? "",
          latitude: dto.place.latitude,
          longitude: dto.place.longitude,
        });
      }
      setDirty(false);
    } catch (cause) {
      setErrors({ general: cause instanceof ApiError ? cause.message : "تعذر تحميل بيانات الجمعية." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const update = <Key extends keyof EditableOrganizationData>(key: Key, value: EditableOrganizationData[Key]) => {
    setDirty(true);
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, general: undefined }));
  };

  const toggleActivity = (id: string) => {
    const activities = form.activities.includes(id)
      ? form.activities.filter((item) => item !== id)
      : [...form.activities, id];
    update("activities", activities);
  };

  const pickLogo = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showFeedback({ title: "صلاحية الصور مطلوبة", message: "اسمح للتطبيق بالوصول إلى الصور لتغيير شعار الجمعية.", tone: "warning" });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 });
      if (!result.canceled && result.assets[0]?.uri) update("logoUri", result.assets[0].uri);
    } catch {
      setErrors((current) => ({ ...current, general: "تعذر فتح معرض الصور." }));
    }
  };

  const fieldErrors = useMemo<OrganizationDataErrors>(() => {
    const next: OrganizationDataErrors = {};
    const description = form.description.trim();
    if (!description) next.description = "النبذة التعريفية مطلوبة";
    else if (description.length > ORGANIZATION_DESCRIPTION_MAX_LENGTH) next.description = `النبذة لا يمكن أن تتجاوز ${ORGANIZATION_DESCRIPTION_MAX_LENGTH} حرف`;
    if (form.phone && cleanPhone(form.phone).length < 8) next.phone = "رقم الهاتف غير صالح";
    if (form.website && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(?:[/:?#].*)?$/i.test(form.website.trim())) next.website = "أدخل رابط موقع إلكتروني صالح";
    if (!form.activities.length) next.activities = "اختر خدمة واحدة على الأقل";
    const hoursError = validateOpeningHours(form.openingHours);
    if (hoursError) next.openingHours = hoursError;
    return next;
  }, [form]);

  const validationErrors = useMemo(() => Object.values(fieldErrors).filter((value): value is string => Boolean(value)), [fieldErrors]);

  const save = async () => {
    if (saving) return;
    if (validationErrors.length) {
      setErrors((current) => ({ ...current, ...fieldErrors }));
      return;
    }
    if (!location) {
      setErrors((current) => ({ ...current, general: "لا يمكن حفظ البيانات قبل توفر موقع معتمد للجمعية." }));
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      let logoMediaId: number | null = null;
      if (form.logoUri && form.logoUri !== original.logoUri && !/^https?:\/\//i.test(form.logoUri)) {
        logoMediaId = (await uploadLocalMediaUris([form.logoUri]))[0]?.id ?? null;
      }
      const updated = await updateMyOrganization({
        description: form.description.trim(),
        phone: cleanPhone(form.phone) || null,
        website: form.website.trim() || null,
        governorateId: location.governorateId,
        regionId: location.regionId,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        logoMediaId,
        coverMediaId: null,
        services: form.activities.map((value) => value.toUpperCase()),
        operatingHours: form.openingHours.map((item) => {
          const closed = item.open == null && item.close == null;
          const open24 = item.open === "00:00" && item.close === "23:59";
          return {
            dayOfWeek: DAY_KEY[item.day],
            isClosed: closed,
            isOpen24Hours: open24,
            opensAt: closed || open24 ? null : item.open,
            closesAt: closed || open24 ? null : item.close,
          };
        }),
      });
      const next: EditableOrganizationData = {
        description: updated.description ?? "",
        phone: updated.phone ?? "",
        website: updated.website ?? "",
        activities: (updated.services ?? []).map((value) => value.toLowerCase()),
        openingHours: toOpeningHours(updated.operatingHours),
        logoUri: updated.logoUrl ?? form.logoUri,
      };
      setForm(next);
      setOriginal(next);
      setDirty(false);
      allowNextNavigation();
      showFeedback({ title: "تم حفظ بيانات الجمعية", message: "تم تحديث البيانات التشغيلية المتاحة بنجاح.", tone: "success" });
      requestAnimationFrame(() => router.back());
    } catch (cause) {
      setErrors({ general: cause instanceof ApiError ? cause.message : "تعذر حفظ بيانات الجمعية. حاول مرة أخرى." });
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    identity,
    errors,
    validationErrors: Object.values(errors).filter((value): value is string => Boolean(value)),
    loading,
    saving,
    dirty,
    descriptionCharCount: form.description.length,
    descriptionMaxLength: ORGANIZATION_DESCRIPTION_MAX_LENGTH,
    update,
    toggleActivity,
    pickLogo,
    load,
    save,
    cancel: () => router.back(),
  };
}
