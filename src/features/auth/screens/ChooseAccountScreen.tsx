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
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import Button from "@/src/components/ui/Button";
import { RADIUS, COLORS, FONTS, PALETTE, TYPOGRAPHY } from "@/src/theme";

type AccountOptionId = "user" | "organization";

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
    iconColor: PALETTE.green700,
    features: ["تقارير الإنقاذ", "تتبّع الحالات", "التبنّي", "التبرعات"],
  },

];

const ENTITY_OPTIONS: AccountOption[] = [
  {
    id: "organization",
    title: "جمعية أو منظمة إنقاذ",
    description:
      "لتسجيل الجمعية وإظهارها على الخريطة وإدارة طلبات انضمام المتطوعين والاشتراك في الإعلانات.",
    badge: "يتطلب التحقق من الترخيص",
    badgeTone: "orange",
    icon: "business-outline",
    iconColor: PALETTE.green700,
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

    router.replace("/welcome");
  };

  const handleContinue = () => {
    if (!selectedOption) {
      return;
    }

    if (selectedOption === "user") {
      router.push("/register-user");
      return;
    }

    router.push({
      pathname: "/register-entity",
      params: {
        entityType: selectedOption,
      },
    });
  };

  const handleLogin = () => {
    router.replace("/login");
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
        <ScreenHeader
          title="إنشاء حساب"
          onBack={handleBack}
          horizontalPadding={horizontalPadding}
          style={styles.pageHeader}
        />

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
                  <Ionicons name="paw-outline" size={31} color={COLORS.primary} />
                  <View style={styles.illustrationLine} />
                  <View style={styles.illustrationLineSmall} />
                  <View style={styles.illustrationButton}>
                    <AppText style={styles.illustrationButtonText}>
                      تسجيل
                    </AppText>
                  </View>
                </View>

                <View style={styles.illustrationAnimalLeft}>
                  <Ionicons name="paw" size={39} color={COLORS.primary} />
                </View>

                <View style={styles.illustrationAnimalRight}>
                  <Ionicons name="heart" size={32} color={COLORS.primaryPressed} />
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
                  color={COLORS.primaryPressed}
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
                  ? selectedData.id === "organization"
                    ? "متابعة تسجيل الجهة"
                    : "متابعة"
                  : "متابعة"
              }
              onPress={handleContinue}
              variant="custom"
              size="large"
              fullWidth
              disabled={!selectedOption}
              backgroundColor={selectedOption ? PALETTE.orange500 : COLORS.divider}
              borderColor={selectedOption ? PALETTE.orange500 : COLORS.divider}
              borderWidth={0}
              textColor={selectedOption ? COLORS.icon : COLORS.placeholder}
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
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageHeader: { backgroundColor: COLORS.background },
  topBar: {
    minHeight: 60,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.h3.fontSize,
    color: COLORS.text,
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
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.disabledSurface,
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
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.textSecondary,
  },
  stepText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primary,
  },
  progressTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: RADIUS.full,
    backgroundColor: PALETTE.neutral250,
  },
  progressFill: {
    width: "33.333%",
    height: "100%",
    alignSelf: "flex-end",
    borderRadius: RADIUS.full,
    backgroundColor: PALETTE.orange500,
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
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.disabledSurface,
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
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  illustrationLine: {
    width: 68,
    height: 5,
    marginTop: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryFill,
  },
  illustrationLineSmall: {
    width: 52,
    height: 5,
    marginTop: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderStrong,
  },
  illustrationButton: {
    marginTop: 11,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryFill,
  },
  illustrationButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.label.fontSize,
    color: PALETTE.neutral0,
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
    fontSize: TYPOGRAPHY.h3.fontSize,
    lineHeight: 27,
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 470,
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 22,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.h3.fontSize,
    lineHeight: 27,
    color: COLORS.icon,
    writingDirection: "rtl",
  },
  sectionSubtitle: {
    marginTop: 2,
    marginBottom: 11,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: 19,
    color: COLORS.textMuted,
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
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  selectedOptionCard: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: PALETTE.orange500,
  },
  pressedCard: {
    opacity: 0.88,
    transform: [{ scale: 0.995 }],
  },
  optionHeader: {
    width: "100%",
    minHeight: 34,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 12,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.iconMuted,
    backgroundColor: PALETTE.neutral0,
  },
  selectedRadioOuter: {
    borderColor: PALETTE.orange500,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: RADIUS.xs,
    backgroundColor: PALETTE.orange500,
  },
  optionIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  optionTitle: {
    flexShrink: 1,
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    lineHeight: 23,
    color: COLORS.icon,
    writingDirection: "rtl",
  },
  badge: {
    flexShrink: 0,
    marginStart: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  greenBadge: {
    backgroundColor: COLORS.secondaryStrongFill,
  },
  orangeBadge: {
    backgroundColor: COLORS.divider,
  },
  badgeText: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: "center",
    writingDirection: "rtl",
  },
  greenBadgeText: {
    color: PALETTE.neutral0,
  },
  orangeBadgeText: {
    color: COLORS.primaryStrong,
  },
  optionDescription: {
    width: "100%",
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: 21,
    color: COLORS.textSecondary,
    writingDirection: "rtl",
  },
  features: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 7,
    marginTop: 10,
  },
  featureChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.divider,
  },
  featureText: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textMuted,
    textAlign: "center",
    writingDirection: "rtl",
  },
  noticeCard: {
    width: "100%",
    marginTop: 2,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.warningSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noticeHeader: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  noticeTitle: {
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.primaryStrong,
    writingDirection: "rtl",
  },
  noticeList: {
    gap: 5,
  },
  noticeItem: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: 19,
    color: COLORS.textSecondary,
    writingDirection: "rtl",
  },
  continueButton: {
    width: "100%",
    height: 58,
    minHeight: 60,
  },
  continueButtonText: {
    fontFamily: FONTS.medium,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
    textAlign: "center",
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  loginLinkPressed: {
    opacity: 0.55,
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  loginHighlight: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});
