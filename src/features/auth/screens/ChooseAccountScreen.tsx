import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { FONTS } from "@/src/theme";

type AccountOptionId = "user" | "clinic" | "organization";

type AccountOption = {
  id: AccountOptionId;
  title: string;
  description: string;
  badge: string;
  badgeTone: "green" | "orange";
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  features: string[];
};

const PERSONAL_OPTIONS: AccountOption[] = [
  {
    id: "user",
    title: "مستخدم",
    description:
      "للإبلاغ عن الحيوانات المحتاجة، متابعة الحالات، التبنّي، التبرع، واستكشاف الخدمات القريبة.",
    badge: "تفعيل مباشر بعد التحقق",
    badgeTone: "green",
    icon: "person-outline",
    iconColor: "#16833A",
    features: ["تقارير الإنقاذ", "تتبّع الحالات", "التبنّي", "التبرعات"],
  },

];

const ENTITY_OPTIONS: AccountOption[] = [
  {
    id: "clinic",
    title: "عيادة بيطرية",
    description:
      "لتسجيل عيادتك وإظهارها على الخريطة وعرض معلومات التواصل والخدمات والاشتراك في الإعلانات.",
    badge: "يتطلب التحقق من الترخيص",
    badgeTone: "orange",
    icon: "medkit-outline",
    iconColor: "#16833A",
    features: [
      "الظهور على الخريطة",
      "أوقات الدوام",
      "معلومات العيادة",
      "الإعلانات",
    ],
  },
  {
    id: "organization",
    title: "جمعية أو منظمة إنقاذ",
    description:
      "لتسجيل الجمعية وإظهارها على الخريطة وإدارة طلبات انضمام المتطوعين والاشتراك في الإعلانات.",
    badge: "يتطلب التحقق من الترخيص",
    badgeTone: "orange",
    icon: "business-outline",
    iconColor: "#16833A",
    features: [
      "الظهور على الخريطة",
      "طلبات المتطوعين",
      "طلب تبرعات",
      "الإعلانات",
      "معلومات الجمعية",
    ],
  },
];

export default function ChooseAccountScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [selectedOption, setSelectedOption] = useState<AccountOptionId | null>(
    null,
  );

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);

  const selectedData = useMemo(
    () =>
      [...PERSONAL_OPTIONS, ...ENTITY_OPTIONS].find(
        (option) => option.id === selectedOption,
      ),
    [selectedOption],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/welcome" as never);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      return;
    }

    if (selectedOption === "user") {
      router.push("/register-user" as never);
      return;
    }

    router.push({
      pathname: "/register-entity",
      params: {
        entityType: selectedOption,
      },
    } as never);
  };

  const handleLogin = () => {
    router.replace("/login" as never);
  };

  const renderOption = (option: AccountOption) => {
    const isSelected = selectedOption === option.id;

    return (
      <Pressable
        key={option.id}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        onPress={() => setSelectedOption(option.id)}
        style={({ pressed }) => [
          styles.optionCard,
          isSelected && styles.selectedOptionCard,
          pressed && styles.pressedCard,
        ]}
      >
        <View style={styles.optionHeader}>
          <View
            style={[styles.radioOuter, isSelected && styles.selectedRadioOuter]}
          >
            {isSelected ? <View style={styles.radioInner} /> : null}
          </View>

          <View style={styles.optionIdentity}>
            <Ionicons name={option.icon} size={22} color={option.iconColor} />

            <AppText style={styles.optionTitle}>{option.title}</AppText>
          </View>

          <View
            style={[
              styles.badge,
              option.badgeTone === "green"
                ? styles.greenBadge
                : styles.orangeBadge,
            ]}
          >
            <AppText
              style={[
                styles.badgeText,
                option.badgeTone === "green"
                  ? styles.greenBadgeText
                  : styles.orangeBadgeText,
              ]}
            >
              {option.badge}
            </AppText>
          </View>
        </View>

        <AppText style={styles.optionDescription}>{option.description}</AppText>

        <View style={styles.features}>
          {option.features.map((feature) => (
            <View key={feature} style={styles.featureChip}>
              <AppText style={styles.featureText}>{feature}</AppText>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View
          style={[
            styles.topBar,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={25} color="#332D2A" />
          </Pressable>

          <AppText style={styles.topBarTitle}>إنشاء حساب</AppText>

          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.progressArea}>
          <View style={styles.progressLabels}>
            <AppText style={styles.progressTitle}>اختيار نوع الحساب</AppText>

            <AppText style={styles.stepText}>خطوة 1 من 3</AppText>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.illustrationCard}>
              <View style={styles.illustrationMain}>
                <View style={styles.illustrationClipboard}>
                  <Ionicons name="paw-outline" size={31} color="#F28A45" />
                  <View style={styles.illustrationLine} />
                  <View style={styles.illustrationLineSmall} />
                  <View style={styles.illustrationButton}>
                    <AppText style={styles.illustrationButtonText}>
                      تسجيل
                    </AppText>
                  </View>
                </View>

                <View style={styles.illustrationAnimalLeft}>
                  <Ionicons name="paw" size={39} color="#D59142" />
                </View>

                <View style={styles.illustrationAnimalRight}>
                  <Ionicons name="heart" size={32} color="#E97B53" />
                </View>
              </View>
            </View>

            <View style={styles.intro}>
              <AppText style={styles.title}>كيف ترغب باستخدام ResQ؟</AppText>
              <AppText style={styles.subtitle}>
                اختر الاستخدام الذي يناسبك، سواء كنت ترغب بإنشاء حساب شخصي أو
                تسجيل جهة في التطبيق.
              </AppText>
            </View>

            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>حساب شخصي</AppText>
              <AppText style={styles.sectionSubtitle}>
                استخدم التطبيق للإبلاغ والمساعدة والتبنّي والتطوع عبر الجمعيات.
              </AppText>

              <View style={styles.optionsList}>
                {PERSONAL_OPTIONS.map(renderOption)}
              </View>
            </View>

            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>تسجيل جهة</AppText>
              <AppText style={styles.sectionSubtitle}>
                أنشئ حساب مسؤول ثم أرسل بيانات الجهة للتحقق والانضمام إلى ResQ.
              </AppText>

              <View style={styles.optionsList}>
                {ENTITY_OPTIONS.map(renderOption)}
              </View>
            </View>

            <View style={styles.noticeCard}>
              <View style={styles.noticeHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#F36F16"
                />
                <AppText style={styles.noticeTitle}>قبل المتابعة</AppText>
              </View>

              <View style={styles.noticeList}>
                <AppText style={styles.noticeItem}>
                  • المستخدم ينشئ حسابًا شخصيًا، ويمكنه لاحقًا التقدّم للتطوع لدى الجمعيات.
                </AppText>
                <AppText style={styles.noticeItem}>
                  • عند تسجيل عيادة أو جمعية، سيتم أولًا إنشاء حساب لمسؤول
                  الجهة.
                </AppText>
                <AppText style={styles.noticeItem}>
                  • تخضع بيانات العيادة أو الجمعية للمراجعة قبل اعتمادها.
                </AppText>
                <AppText style={styles.noticeItem}>
                  • يمكنك إضافة عيادة أو جمعية إلى حسابك لاحقًا من داخل التطبيق.
                </AppText>
              </View>
            </View>

            <Button
              title={
                selectedData
                  ? selectedData.id === "clinic" ||
                    selectedData.id === "organization"
                    ? "متابعة تسجيل الجهة"
                    : "متابعة"
                  : "متابعة"
              }
              onPress={handleContinue}
              variant="custom"
              size="large"
              fullWidth
              disabled={!selectedOption}
              backgroundColor={selectedOption ? "#FF8849" : "#EAE8E6"}
              borderColor={selectedOption ? "#FF8849" : "#EAE8E6"}
              borderWidth={0}
              textColor={selectedOption ? "#603016" : "#AAA7A3"}
              radius={17}
              style={styles.continueButton}
              textStyle={styles.continueButtonText}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تسجيل الدخول"
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginLink,
                pressed && styles.loginLinkPressed,
              ]}
            >
              <AppText style={styles.loginText}>
                لديك حساب بالفعل؟{" "}
                <AppText style={styles.loginHighlight}>تسجيل الدخول</AppText>
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  topBar: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontFamily: FONTS.bold,
    fontSize: 19,
    color: "#24201E",
    textAlign: "center",
  },
  topBarSpacer: {
    width: 44,
    height: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#EFEFF1",
  },
  backButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  progressArea: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 14,
  },
  progressLabels: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#5D5551",
    textAlign: "left",
  },
  stepText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#FF7B32",
    textAlign: "left",
  },
  progressTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#E4E1DF",
  },
  progressFill: {
    width: "33.333%",
    height: "100%",
    alignSelf: "flex-end",
    borderRadius: 999,
    backgroundColor: "#FF8849",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 32,
  },
  content: {
    alignSelf: "center",
  },
  illustrationCard: {
    width: "100%",
    height: 148,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#F0EFE7",
  },
  illustrationMain: {
    width: "86%",
    height: "86%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationClipboard: {
    width: 126,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#F8D699",
    borderWidth: 2,
    borderColor: "#D69A4B",
  },
  illustrationLine: {
    width: 68,
    height: 5,
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: "#D9A15D",
  },
  illustrationLineSmall: {
    width: 52,
    height: 5,
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#E2B87E",
  },
  illustrationButton: {
    marginTop: 11,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F39A54",
  },
  illustrationButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#FFFFFF",
  },
  illustrationAnimalLeft: {
    position: "absolute",
    left: 18,
    bottom: 18,
  },
  illustrationAnimalRight: {
    position: "absolute",
    right: 22,
    bottom: 21,
  },
  intro: {
    alignItems: "center",
    marginTop: 17,
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 19,
    lineHeight: 27,
    color: "#222222",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 470,
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    color: "#6E6661",
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 19,
    lineHeight: 27,
    color: "#2C2724",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionSubtitle: {
    marginTop: 2,
    marginBottom: 11,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    lineHeight: 19,
    color: "#716A66",
    textAlign: "left",
    writingDirection: "rtl",
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    width: "100%",
    direction: "rtl",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F5F3F0",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  selectedOptionCard: {
    backgroundColor: "#FFF8F3",
    borderColor: "#FF8849",
  },
  pressedCard: {
    opacity: 0.88,
    transform: [{ scale: 0.995 }],
  },
  optionHeader: {
    width: "100%",
    minHeight: 34,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7E8A7D",
    backgroundColor: "#FFFFFF",
  },
  selectedRadioOuter: {
    borderColor: "#FF8849",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#FF8849",
  },
  optionIdentity: {
    flex: 1,
    minWidth: 0,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  optionTitle: {
    flexShrink: 1,
    fontFamily: FONTS.bold,
    fontSize: 15,
    lineHeight: 23,
    color: "#292522",
    textAlign: "left",
    writingDirection: "rtl",
  },
  badge: {
    flexShrink: 0,
    marginStart: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  greenBadge: {
    backgroundColor: "#2C8A3D",
  },
  orangeBadge: {
    backgroundColor: "#FFE1D0",
  },
  badgeText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    textAlign: "center",
    writingDirection: "rtl",
  },
  greenBadgeText: {
    color: "#FFFFFF",
  },
  orangeBadgeText: {
    color: "#A4541A",
  },
  optionDescription: {
    width: "100%",
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    lineHeight: 21,
    color: "#5E5753",
    textAlign: "left",
    writingDirection: "rtl",
  },
  features: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 7,
    marginTop: 10,
  },
  featureChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#E9E7E4",
  },
  featureText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#615C58",
    textAlign: "center",
    writingDirection: "rtl",
  },
  noticeCard: {
    width: "100%",
    marginTop: 2,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#FFF3E8",
    borderWidth: 1,
    borderColor: "#F6C89F",
  },
  noticeHeader: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  noticeTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14.5,
    color: "#814516",
    textAlign: "left",
    writingDirection: "rtl",
  },
  noticeList: {
    gap: 5,
  },
  noticeItem: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#6A4A34",
    textAlign: "left",
    writingDirection: "rtl",
  },
  continueButton: {
    width: "100%",
    height: 58,
    minHeight: 60,
  },
  continueButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    textAlign: "center",
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginLinkPressed: {
    opacity: 0.55,
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#706864",
    textAlign: "center",
  },
  loginHighlight: {
    fontFamily: FONTS.medium,
    color: "#FF7B32",
  },
});
