import { StyleSheet, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Chip from "@/src/components/ui/Chip";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import MapPlaceLocationPicker, { type MapPlaceLocationValue } from "@/src/features/map-places/components/MapPlaceLocationPicker";
import OpeningHoursEditor, { defaultOpeningHours } from "@/src/features/map-places/components/OpeningHoursEditor";
import {
  canUserManageMapPlaceApplication,
  SERVICE_PLACE_TYPE_META,
  validateMapPlaceDraft,
  type DailyOpeningHours,
  type ServicePlaceType,
} from "@/src/domain/service-places";
import { useSession } from "@/src/features/session/SessionContext";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { useLocationLookups } from "@/src/hooks/useLocationLookups";
import { mapPlaceApplicationDetailsRoute } from "@/src/navigation/routes";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, SPACING } from "@/src/theme";

const USER_PLACE_TYPES = ["clinic", "animal_pharmacy", "pet_store", "pet_hotel", "cat_cafe", "grooming", "shelter", "other"] as const satisfies readonly Exclude<ServicePlaceType, "organization" | "feeding_point">[];
type UserPlaceType = (typeof USER_PLACE_TYPES)[number];

export default function EditMapPlaceApplicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { account } = useSession();
  const { showFeedback } = useFeedback();
  const loader = useCallback(() => repositories.mapPlaceApplications.getById(id), [id]);
  const resource = useAsyncResource(loader, null, "تعذر تحميل الطلب.");

  const [type, setType] = useState<UserPlaceType>("clinic");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [governorateName, setGovernorateName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regionName, setRegionName] = useState("");
  const [location, setLocation] = useState<MapPlaceLocationValue | null>(null);
  const [openingHours, setOpeningHours] = useState<DailyOpeningHours[]>(defaultOpeningHours());
  const [governorateOpen, setGovernorateOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const lookups = useLocationLookups(governorateId || undefined);

  useEffect(() => {
    const item = resource.data;
    if (!item) return;
    setType(item.requestedType as UserPlaceType);
    setName(item.name);
    setDescription(item.description ?? "");
    setAddress(item.address);
    setPhone(item.phone);
    setWebsite(item.website ?? "");
    setGovernorateId(item.governorateId ?? "");
    setGovernorateName(item.governorateName ?? "");
    setRegionId(item.regionId ?? "");
    setRegionName(item.regionName ?? "");
    setLocation({ latitude: item.latitude, longitude: item.longitude });
    setOpeningHours(item.openingHours?.map((entry) => ({ ...entry })) ?? defaultOpeningHours());
  }, [resource.data]);

  const owned = useMemo(
    () => Boolean(resource.data && account?.kind === "user" && canUserManageMapPlaceApplication(resource.data, account.id)),
    [resource.data, account],
  );
  const editable = resource.data?.status === "draft" || resource.data?.status === "rejected";

  const save = async (submitAfterSave: boolean) => {
    if (!resource.data || !account || account.kind !== "user" || !owned || !editable) return;
    if (!location) {
      showFeedback({ title: "راجع البيانات", message: "حدد موقع الجهة على الخريطة.", tone: "warning" });
      return;
    }
    const input = {
      requestedType: type,
      name: name.trim(),
      description: description.trim() || undefined,
      governorateId,
      governorateName,
      regionId,
      regionName,
      address: address.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      phone: phone.trim(),
      website: website.trim() || undefined,
      openingHours,
    };
    const validationError = validateMapPlaceDraft(input, { forSubmission: true });
    if (validationError) {
      showFeedback({ title: "راجع البيانات", message: validationError, tone: "warning" });
      return;
    }
    try {
      setSaving(true);
      const updated = await repositories.mapPlaceApplications.updateOwnedDraft(resource.data.id, account.id, input);
      const finalItem = submitAfterSave ? await repositories.mapPlaceApplications.submit(updated.id, account.id) : updated;
      showFeedback({
        title: submitAfterSave ? "تمت إعادة الإرسال" : "تم حفظ التعديلات",
        message: submitAfterSave ? "عاد الطلب إلى حالة قيد المراجعة." : "تم حفظ التعديلات بنجاح.",
        tone: "success",
      });
      router.replace(mapPlaceApplicationDetailsRoute(finalItem.id));
    } catch (error) {
      showFeedback({ title: "تعذر حفظ الطلب", message: error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ. حاول مرة أخرى.", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const chooseGovernorate = (value: string) => {
    const option = lookups.governorateOptions.find((item) => item.value === value);
    setGovernorateId(value);
    setGovernorateName(option?.label ?? "");
    setRegionId("");
    setRegionName("");
    setGovernorateOpen(false);
  };
  const chooseRegion = (value: string) => {
    const option = lookups.regionOptions.find((item) => item.value === value);
    setRegionId(value);
    setRegionName(option?.label ?? "");
    setRegionOpen(false);
  };

  if (resource.loading) return <Screen><LoadingState /></Screen>;
  if (resource.error) return <Screen><ErrorState description={resource.error} onRetry={resource.reload} /></Screen>;
  if (!resource.data || !owned) return <Screen><ErrorState description="الطلب غير موجود أو لا تملك صلاحية الوصول إليه." /></Screen>;
  if (!editable) return <Screen><ErrorState description="لا يمكن تعديل الطلب أثناء المراجعة أو بعد اعتماده أو إلغائه." /></Screen>;

  return (
    <Screen scroll padded={false} surface="app">
      <ScreenHeader title="تعديل طلب الظهور" subtitle="الطلب المرفوض يمكن تعديله ثم إعادة إرساله للمراجعة" onBack={() => router.back()} />
      <View style={styles.content}>
        {resource.data.rejectionReason ? <AppText color={COLORS.danger}>سبب الرفض السابق: {resource.data.rejectionReason}</AppText> : null}
        <AppText weight="bold">نوع الجهة</AppText>
        <View style={styles.chips}>
          {USER_PLACE_TYPES.map((item) => <Chip key={item} label={SERVICE_PLACE_TYPE_META[item].label} selected={type === item} onPress={() => setType(item)} />)}
        </View>

        <Input label="اسم الجهة" required value={name} onChangeText={setName} />
        <Input label="الوصف" value={description} onChangeText={setDescription} multiline />

        <LocationLookupSelect
          label="المحافظة"
          placeholder="اختر المحافظة"
          required
          value={governorateId}
          selectedLabel={governorateName}
          options={lookups.governorateOptions}
          visible={governorateOpen}
          loading={lookups.loadingGovernorates}
          onOpen={() => setGovernorateOpen(true)}
          onClose={() => setGovernorateOpen(false)}
          onSelect={chooseGovernorate}
        />
        <LocationLookupSelect
          label="المنطقة"
          placeholder={governorateId ? "اختر المنطقة" : "اختر المحافظة أولًا"}
          required
          value={regionId}
          selectedLabel={regionName}
          options={lookups.regionOptions}
          visible={regionOpen}
          disabled={!governorateId}
          loading={lookups.loadingRegions}
          onOpen={() => setRegionOpen(true)}
          onClose={() => setRegionOpen(false)}
          onSelect={chooseRegion}
        />
        <Input label="العنوان" required value={address} onChangeText={setAddress} />
        <MapPlaceLocationPicker value={location} onChange={setLocation} />

        <Input label="رقم الهاتف" required value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr" />
        <Input label="الموقع الإلكتروني" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" contentDirection="ltr" />

        <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        <Button title="حفظ التعديلات" variant="outline" loading={saving} onPress={() => void save(false)} />
        <Button title={resource.data.status === "rejected" ? "حفظ وإعادة الإرسال" : "حفظ وإرسال للمراجعة"} loading={saving} onPress={() => void save(true)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.xl },
  chips: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", gap: SPACING.xs },
});
