import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import { useSession } from "@/src/features/session/SessionContext";
import {
  COLORS,
  FONT_SIZES,
  FONTS,
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
      backgroundColor={COLORS.surface}
      contentContainerStyle={styles.content}
    >
      <ScreenHeader
        title="تعديل الحساب"
        onBack={formState.cancel}
        right={
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.text}
          />
        }
      />

      <Pressable onPress={formState.pickAvatar} style={styles.avatarWrap}>
        <Image source={{ uri: formState.form.avatarUri }} style={styles.avatar} />
        <View style={styles.camera}>
          <Ionicons name="camera" size={20} color={COLORS.white} />
        </View>
      </Pressable>

      <AppText style={styles.section}>المعلومات الشخصية</AppText>

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
      <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>
        {formState.charCount} / 200
      </AppText>

      <AppText style={styles.section}>معلومات إضافية</AppText>

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

      <AppText style={styles.label}>مهارات خاصة</AppText>
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
        <Pressable onPress={formState.addSkill} style={styles.add}>
          <AppText color={COLORS.warning}>＋ إضافة مهارة</AppText>
        </Pressable>
      </View>

      <Button title="حفظ التغييرات" onPress={formState.save} />
      <Button title="إلغاء" variant="outline" onPress={formState.cancel} />
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
    width: 126,
    height: 126,
    borderRadius: RADIUS.full,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  camera: {
    position: "absolute",
    right: -2,
    bottom: 6,
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
  },
  section: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    color: COLORS.brown,
    marginVertical: SPACING.md,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  half: {
    flex: 1,
  },
  bio: {
    minHeight: 90,
  },
  label: {
    fontFamily: FONTS.medium,
    textAlign: "right",
    marginBottom: SPACING.sm,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  skill: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  add: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.warning,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
