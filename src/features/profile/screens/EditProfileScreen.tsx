import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import LocationLookupSelect from "@/src/components/location/LocationLookupSelect";
import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ErrorState from "@/src/components/ui/ErrorState";
import Input from "@/src/components/ui/Input";
import LoadingState from "@/src/components/ui/LoadingState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import { useSession } from "@/src/features/session/SessionContext";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useEditProfileForm } from "../hooks/useEditProfileForm";

export default function EditProfileScreen() {
  const { isGuest } = useSession();
  const state = useEditProfileForm();
  if (isGuest) return <GuestAccountGate />;

  if (state.loading) {
    return <Screen surface="app"><ScreenHeader title="تعديل الحساب" onBack={state.cancel} /><LoadingState label="جاري تحميل بيانات الحساب..." /></Screen>;
  }
  if (state.errors.general && !state.form.email) {
    return <Screen surface="app"><ScreenHeader title="تعديل الحساب" onBack={state.cancel} /><ErrorState description={state.errors.general} onRetry={() => { void state.load(); }} /></Screen>;
  }

  return (
    <Screen scroll surface="app" contentContainerStyle={styles.content}>
      <ScreenHeader title="تعديل الحساب" onBack={state.cancel} />

      <Pressable accessibilityRole="button" accessibilityLabel="تغيير الصورة الشخصية" onPress={() => { void state.pickAvatar(); }} style={styles.avatarWrap}>
        {state.form.avatarUri ? (
          <Image source={{ uri: state.form.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person-outline" size={42} color={COLORS.textSecondary} />
          </View>
        )}
        <View style={styles.camera}><Ionicons name="camera" size={20} color={COLORS.white} /></View>
      </Pressable>

      {state.errors.general ? <AppText color={COLORS.danger} align="center" style={styles.generalError}>{state.errors.general}</AppText> : null}

      <AppText variant="h3" weight="bold" color={COLORS.brown} style={styles.section}>المعلومات الشخصية</AppText>
      <View style={styles.row}>
        <Input label="الاسم الأول" value={state.form.firstName} onChangeText={(value) => state.update("firstName", value)} error={state.errors.firstName} containerStyle={styles.half} />
        <Input label="اسم العائلة" value={state.form.lastName} onChangeText={(value) => state.update("lastName", value)} containerStyle={styles.half} />
      </View>

      <Input label="البريد الإلكتروني" value={state.form.email} readOnly helperText="تغيير البريد الإلكتروني غير متاح من هذه الشاشة حفاظًا على أمان الحساب." />
      <Input label="رقم الهاتف" prefix="+963" value={state.form.phone} onChangeText={(value) => state.update("phone", value.replace(/\D/g, "").slice(0, 9))} error={state.errors.phone} keyboardType="phone-pad" helperText={state.form.phoneVerified ? "رقم الهاتف مؤكد" : "رقم الهاتف بحاجة إلى تأكيد"} />

      <LocationLookupSelect
        label="المحافظة"
        placeholder="اختر المحافظة"
        value={state.form.governorateId}
        selectedLabel={state.form.governorateName}
        options={state.lookups.governorateOptions}
        visible={state.showGovernorates}
        loading={state.lookups.loadingGovernorates}
        error={state.errors.governorateId}
        onOpen={() => state.setShowGovernorates(true)}
        onClose={() => state.setShowGovernorates(false)}
        onSelect={state.selectGovernorate}
      />
      <LocationLookupSelect
        label="المنطقة"
        placeholder={state.form.governorateId ? "اختر المنطقة" : "اختر المحافظة أولًا"}
        value={state.form.regionId}
        selectedLabel={state.form.regionName}
        options={state.lookups.regionOptions}
        visible={state.showRegions}
        loading={state.lookups.loadingRegions}
        disabled={!state.form.governorateId}
        error={state.errors.regionId}
        onOpen={() => state.setShowRegions(true)}
        onClose={() => state.setShowRegions(false)}
        onSelect={state.selectRegion}
      />

      <Input label="نبذة شخصية" value={state.form.bio} onChangeText={(value) => state.update("bio", value.slice(0, 1000))} error={state.errors.bio} multiline inputStyle={styles.bio} />
      <AppText variant="caption" color={COLORS.textSecondary}>{state.charCount} / 1000</AppText>

      <ActionStack>
        <Button title={state.saving ? "جارٍ حفظ التغييرات..." : "حفظ التغييرات"} onPress={() => { void state.save(); }} disabled={state.saving} />
        <Button title="إلغاء" variant="outline" onPress={state.cancel} disabled={state.saving} />
      </ActionStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: SPACING.xl, gap: SPACING.sm },
  avatarWrap: { alignSelf: "center", marginVertical: SPACING.md },
  avatar: { width: 92, height: 92, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.primary },
  avatarPlaceholder: { backgroundColor: COLORS.surfaceSubtle, alignItems: "center", justifyContent: "center" },
  camera: { position: "absolute", right: -2, bottom: 6, width: 32, height: 32, borderRadius: RADIUS.full, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.brown },
  section: { width: "100%", marginTop: SPACING.md, marginBottom: SPACING.sm },
  row: { flexDirection: "row", direction: "rtl", gap: SPACING.md, width: "100%" },
  half: { flex: 1, minWidth: 0 },
  bio: { minHeight: 110 },
  generalError: { width: "100%", lineHeight: 24 },
});
