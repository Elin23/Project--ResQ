import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { formatSyrianMobileInternational, normalizeSyrianMobile, validateSyrianMobile } from "@/src/features/auth/utils/registrationValidation";
import { useSession } from "@/src/features/session/SessionContext";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { ROUTES } from "@/src/navigation/routes";
import { ApiError } from "@/src/services/api/client";
import { profileApi, type MyProfileDto } from "@/src/services/api/profileApi";
import { publishProfileChanged } from "@/src/services/api/profileEvents";
import { uploadLocalMediaUris } from "@/src/services/api/uploadsApi";
import type { EditableProfile } from "../types/profile";

const emptyForm: EditableProfile = {
  firstName: "", lastName: "", email: "", phone: "",
  governorateId: "", governorateName: "", regionId: "", regionName: "",
  bio: "", avatarUri: "", phoneVerified: false,
};

const toForm = (profile: MyProfileDto): EditableProfile => {
  const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    email: profile.email,
    phone: normalizeSyrianMobile(profile.phone ?? ""),
    governorateId: profile.governorateId?.toString() ?? "",
    governorateName: profile.governorateName ?? "",
    regionId: profile.regionId?.toString() ?? "",
    regionName: profile.regionName ?? "",
    birthDate: profile.birthDate ?? undefined,
    bio: profile.bio ?? "",
    avatarUri: profile.avatarUrl ?? "",
    phoneVerified: profile.phoneVerified,
  };
};

export function useEditProfileForm() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { account, startAuthenticatedSession } = useSession();
  const [form, setForm] = useState<EditableProfile>(emptyForm);
  const [original, setOriginal] = useState<EditableProfile>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGovernorates, setShowGovernorates] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const lookups = useLocationLookups(form.governorateId);

  const clearErrors = (...keys: string[]) => {
    setErrors((current) => {
      const next = { ...current };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      const profile = await profileApi.getMine();
      const next = toForm(profile);
      setForm(next);
      setOriginal(next);
    } catch (cause) {
      setErrors({ general: cause instanceof ApiError ? cause.message : "تعذر تحميل الملف الشخصي." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const update = (key: keyof EditableProfile, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    clearErrors(String(key), "general");
  };
  const charCount = useMemo(() => form.bio.length, [form.bio]);

  const selectGovernorate = (id: string) => {
    const selected = lookups.governorates.find((item) => item.id === id);
    setForm((previous) => ({ ...previous, governorateId: id, governorateName: selected?.name ?? "", regionId: "", regionName: "" }));
    setShowGovernorates(false);
    clearErrors("governorateId", "regionId", "general");
  };

  const selectRegion = (id: string) => {
    const selected = lookups.regions.find((item) => item.id === id);
    setForm((previous) => ({ ...previous, regionId: id, regionName: selected?.name ?? "" }));
    setShowRegions(false);
    clearErrors("regionId", "general");
  };

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.8 });
      if (!result.canceled) update("avatarUri", result.assets[0].uri);
    } catch {
      setErrors((current) => ({ ...current, general: "تعذر فتح معرض الصور." }));
    }
  };

  const save = async () => {
    if (saving) return;
    const next: Record<string, string> = {};
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (fullName.length < 3) next.firstName = "الاسم الكامل يجب أن يتكون من 3 أحرف على الأقل";
    const phoneError = validateSyrianMobile(form.phone);
    if (phoneError) next.phone = phoneError;
    if (!!form.governorateId !== !!form.regionId) next.regionId = "اختر المحافظة والمنطقة معًا";
    if (form.bio.length > 1000) next.bio = "النبذة لا يمكن أن تتجاوز 1000 حرف";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setSaving(true);
      let avatarMediaId: number | null = null;
      if (form.avatarUri && !/^https?:\/\//i.test(form.avatarUri) && form.avatarUri !== original.avatarUri) {
        avatarMediaId = (await uploadLocalMediaUris([form.avatarUri]))[0]?.id ?? null;
      }
      const updateResponse = await profileApi.updateMine({
        fullName,
        phone: formatSyrianMobileInternational(form.phone),
        birthDate: form.birthDate ?? null,
        governorateId: form.governorateId ? Number(form.governorateId) : null,
        regionId: form.regionId ? Number(form.regionId) : null,
        bio: form.bio.trim() || null,
        avatarMediaId,
      });

      // Re-read the authoritative profile after saving. Some backend update
      // responses omit/lag avatarUrl even though the upload was accepted.
      const updated = await profileApi.getMine().catch(() => updateResponse);
      publishProfileChanged(updated);

      const mapped = toForm(updated);
      setForm(mapped);
      setOriginal(mapped);

      if (account) {
        await startAuthenticatedSession({
          ...account,
          displayName: updated.fullName,
          email: updated.email,
          phone: updated.phone ?? undefined,
          phoneVerified: updated.phoneVerified,
        });
      }

      const phoneChanged = normalizeSyrianMobile(original.phone) !== normalizeSyrianMobile(updated.phone ?? "");
      showFeedback({ title: "تم الحفظ", message: phoneChanged ? "تم حفظ الملف. يلزم تأكيد رقم الهاتف الجديد." : "تم تحديث ملفك الشخصي بنجاح.", tone: "success" });
      if (phoneChanged && !updated.phoneVerified) {
        router.replace({ pathname: ROUTES.verifyRegistrationPhone, params: { accountType: "user", flow: "profile", phone: updated.phone ?? "", name: updated.fullName, email: updated.email } });
      } else {
        router.back();
      }
    } catch (cause) {
      setErrors({ general: cause instanceof ApiError ? cause.message : "تعذر حفظ التغييرات. حاول مرة أخرى." });
    } finally {
      setSaving(false);
    }
  };

  return {
    form, errors, update, charCount, pickAvatar, save, loading, saving, load,
    lookups, showGovernorates, setShowGovernorates, showRegions, setShowRegions,
    selectGovernorate, selectRegion,
    cancel: () => router.back(),
  };
}
