import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import { useSession } from "@/src/features/session/SessionContext";
import {
  COLORS,
  RADIUS,
  SPACING,
} from "@/src/theme";

import { PROFILE_CITIES } from "../constants/profile";
import { useEditProfileForm } from "../hooks/useEditProfileForm";

export default function EditProfileScreen() {
  const { isGuest } = useSession();
  const formState = useEditProfileForm();

  if (isGuest) {
    return <GuestAccountGate />;
  }

  return (
    <Screen
      scroll
      surface="app"
      contentContainerStyle={styles.content}
    >
      <ScreenHeader
        title="تعديل الحساب"
        onBack={formState.cancel}
      />

      <Pressable onPress={formState.pickAvatar} style={styles.avatarWrap}>
        <Image source={{ uri: formState.form.avatarUri }} style={styles.avatar} />
        <View style={styles.camera}>
          <Ionicons name="camera" size={20} color={COLORS.white} />
        </View>
      </Pressable>

      <AppText variant="h3" weight="bold" color={COLORS.brown} style={styles.section}>المعلومات الشخصية</AppText>

      <View style={styles.row}>
        <Input
          label="الاسم الأول"
          value={formState.form.firstName}
          onChangeText={(value) => formState.update("firstName", value)}
          error={formState.errors.firstName}
          containerStyle={styles.half}
        />
        <Input
          label="اسم العائلة"
          value={formState.form.lastName}
          onChangeText={(value) => formState.update("lastName", value)}
          containerStyle={styles.half}
        />
      </View>

      <Input
        label="البريد الإلكتروني"
        value={formState.form.email}
        onChangeText={(value) => formState.update("email", value)}
        error={formState.errors.email}
        icon="checkmark-circle"
        iconColor={COLORS.successDark}
      />

      <Input
        label="رقم الهاتف"
        prefix="+963"
        value={formState.form.phone}
        onChangeText={(value) =>
          formState.update("phone", value.replace(/\D/g, ""))
        }
        error={formState.errors.phone}
        keyboardType="phone-pad"
      />

      <Input
        label="المدينة"
        value={formState.form.city}
        readOnly
        icon="chevron-down"
        onIconPress={() => {
          const currentIndex = PROFILE_CITIES.indexOf(formState.form.city);
          const nextIndex = (currentIndex + 1) % PROFILE_CITIES.length;
          formState.update("city", PROFILE_CITIES[nextIndex]);
        }}
      />

      <Input
        label="نبذة شخصية"
        value={formState.form.bio}
        onChangeText={(value) => formState.update("bio", value.slice(0, 200))}
        multiline
        inputStyle={styles.bio}
      />
      <AppText variant="caption" color={COLORS.textSecondary}>
        {formState.charCount} / 200
      </AppText>

      <AppText variant="h3" weight="bold" color={COLORS.brown} style={styles.section}>معلومات إضافية</AppText>

      <Input
        label="المهنة"
        placeholder="مثال: طبيب بيطري"
        value={formState.form.profession}
        onChangeText={(value) => formState.update("profession", value)}
      />

      <Input
        label="سنوات الخبرة مع الحيوانات"
        value={formState.form.experienceYears}
        onChangeText={(value) =>
          formState.update("experienceYears", value.replace(/\D/g, ""))
        }
        keyboardType="number-pad"
      />

      <AppText variant="label" weight="medium" style={styles.label}>مهارات خاصة</AppText>
      <View style={styles.skills}>
        {formState.form.skills.map((skill) => (
          <Pressable
            key={skill}
            onPress={() => formState.removeSkill(skill)}
            style={styles.skill}
          >
            <Ionicons name="close" size={16} />
            <AppText>{skill}</AppText>
          </Pressable>
        ))}
        <View style={styles.skillComposer}>
          <Input
            value={formState.skillDraft}
            onChangeText={formState.setSkillDraft}
            placeholder="اكتب مهارة جديدة"
            returnKeyType="done"
            onSubmitEditing={formState.addSkill}
            containerStyle={styles.skillInput}
          />
          <Button title="إضافة" size="small" variant="outline" onPress={formState.addSkill} disabled={!formState.skillDraft.trim()} />
        </View>
      </View>

      <ActionStack>
        <Button title="حفظ التغييرات" onPress={formState.save} />
        <Button title="إلغاء" variant="outline" onPress={formState.cancel} />
      </ActionStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: SPACING.xl,
  },
  avatarWrap: {
    alignSelf: "center",
    marginVertical: SPACING.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  camera: {
    position: "absolute",
    right: -2,
    bottom: 6,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
  },
  section: { width: "100%", marginTop: SPACING.lg, marginBottom: SPACING.sm },
  row: {
    flexDirection: "row", direction: "rtl",
    gap: SPACING.md,
  },
  half: {
    flex: 1,
  },
  bio: {
    minHeight: 90,
  },
  label: {
    marginBottom: SPACING.sm,
  },
  skills: {
    flexDirection: "row", direction: "rtl",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  skill: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skillComposer: { flexDirection: "row", direction: "rtl", alignItems: "flex-start", gap: SPACING.sm, width: "100%" },
  skillInput: { flex: 1, marginBottom: 0 },
  add: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.warning,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
