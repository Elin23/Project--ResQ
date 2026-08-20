import { COLORS, PALETTE } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  Share,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ShellAwareScrollView from "@/src/components/ui/ShellAwareScrollView";
import { styles } from "./About.styles";
import type { AppRoute } from "@/src/navigation/routes";

import {
  ABOUT_FEATURES,
  ABOUT_INFO_ITEMS,
  ABOUT_SOCIAL_ITEMS,
  ABOUT_SUPPORT_EMAIL,
  APP_VERSION,
} from "../constants/about";

export default function AboutScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [licensesVisible, setLicensesVisible] = useState(false);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  const openRoute = (route: AppRoute) => {
    router.push(route);
  };

  const openExternalUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleContact = async () => {
    const subject = encodeURIComponent("استفسار حول تطبيق ResQ");
    const url = `mailto:${ABOUT_SUPPORT_EMAIL}?subject=${subject}`;

    await openExternalUrl(url);
  };

  const handleShare = async () => {
    await Share.share({
      title: "تطبيق ResQ",
      message:
        "تعرّف على تطبيق ResQ، المنصة المخصصة للمساهمة في إنقاذ الحيوانات ودعم المجتمع.",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <ScreenHeader
          title="حول ResQ"
          onBack={handleBack}
          horizontalPadding={horizontalPadding}
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="مشاركة معلومات التطبيق"
                hitSlop={10}
                onPress={handleShare}
                style={({ pressed }) => [styles.topBarButton, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="share-social-outline" size={20} color={PALETTE.neutral800} />
              </Pressable>
            }
        />

        <ShellAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.hero}>
              <View style={styles.logoBox}>
                <Ionicons name="paw" size={48} color={PALETTE.neutral0} />
              </View>

              <View style={styles.brandRow}>
                <Ionicons name="paw" size={20} color={COLORS.icon} />

                <AppText style={styles.brandName}>
                  Res<AppText style={styles.brandAccent}>Q {""}</AppText>
                </AppText>
              </View>

              <AppText style={styles.tagline}>
                معاً لإنقاذ الحيوانات وبناء مجتمع أكثر رحمة.
              </AppText>

              <View style={styles.versionPill}>
                <AppText style={styles.versionText}>
                  الإصدار {APP_VERSION}
                </AppText>
              </View>
            </View>

            <View style={styles.statementCard}>
              <View style={styles.statementHeader}>
                <Ionicons name="flag-outline" size={21} color={COLORS.secondaryStrong} />
                <AppText style={styles.statementTitle}>رسالتنا</AppText>
              </View>

              <AppText style={styles.statementText}>
                نهدف إلى توفير استجابة سريعة وفعّالة لإنقاذ الحيوانات المشردة
                والمصابة من خلال ربط المتطوعين والجمعيات والعيادات في منصة واحدة
                متكاملة تعزز قيم الرفق بالحيوان.
              </AppText>
            </View>

            <View style={styles.statementCard}>
              <View style={styles.statementHeader}>
                <Ionicons name="eye-outline" size={22} color={COLORS.primaryStrong} />
                <AppText style={[styles.statementTitle, styles.visionTitle]}>
                  رؤيتنا
                </AppText>
              </View>

              <AppText style={styles.statementText}>
                أن نصبح المنصة الرقمية الأولى في المنطقة لحماية حقوق الحيوان،
                وبناء قاعدة بيانات وطنية تضمن حياة كريمة لكل حيوان يحتاج إلى
                المساعدة.
              </AppText>
            </View>

            <View style={styles.featuresCard}>
              <AppText style={styles.cardTitle}>ماذا يوفر التطبيق؟</AppText>

              <View style={styles.featuresGrid}>
                {ABOUT_FEATURES.map((item) => (
                  <View key={item.id} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name={item.icon} size={21} color={COLORS.secondaryStrong} />
                    </View>

                    <AppText style={styles.featureTitle}>{item.title}</AppText>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={COLORS.textMuted}
                />
                <AppText style={styles.cardTitle}>معلومات التطبيق</AppText>
              </View>

              {ABOUT_INFO_ITEMS.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.infoRow,
                    index < ABOUT_INFO_ITEMS.length - 1 && styles.rowBorder,
                  ]}
                >
                  <AppText style={styles.infoLabel}>{item.label}</AppText>
                  <AppText style={styles.infoValue}>{item.value}</AppText>
                </View>
              ))}
            </View>

            <View style={styles.licensesCard}>
              <AppText style={styles.licensesTitle}>التراخيص</AppText>
              <AppText style={styles.licensesDescription}>
                يعتمد التطبيق على مجموعة من المكتبات مفتوحة المصدر التي تساهم في
                تقديم تجربة مستخدم آمنة وسلسة.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="عرض التراخيص"
                onPress={() => setLicensesVisible(true)}
                style={({ pressed }) => [
                  styles.licensesButton,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.licensesButtonText}>
                  عرض التراخيص
                </AppText>
              </Pressable>
            </View>

            <View style={styles.socialCard}>
              <AppText style={styles.socialTitle}>تابعنا على</AppText>

              {ABOUT_SOCIAL_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="link"
                  accessibilityLabel={item.title}
                  onPress={() => openExternalUrl(item.url)}
                  style={({ pressed }) => [
                    styles.socialRow,
                    index < ABOUT_SOCIAL_ITEMS.length - 1 && styles.rowBorder,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Ionicons name="open-outline" size={18} color={COLORS.iconMuted} />

                  <AppText style={styles.socialText}>{item.title}</AppText>

                  <Ionicons name={item.icon} size={20} color={COLORS.secondaryStrong} />
                </Pressable>
              ))}
            </View>

            <View style={styles.helpCard}>
              <AppText style={styles.helpTitle}>هل لديك سؤال؟</AppText>
              <AppText style={styles.helpDescription}>
                انتقل إلى مركز المساعدة للاطلاع على الأسئلة الشائعة وطرق الحصول
                على الدعم.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={() => openRoute("/help-center")}
                style={({ pressed }) => [
                  styles.helpButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="help-buoy-outline" size={18} color={COLORS.primaryStrong} />
                <AppText style={styles.helpButtonText}>
                  الانتقال إلى مركز المساعدة
                </AppText>
              </Pressable>
            </View>

            <View style={styles.shareCard}>
              <AppText style={styles.shareTitle}>انشر الخير</AppText>
              <AppText style={styles.shareDescription}>
                شارك التطبيق مع أصدقائك، فقد تكون مشاركتك سببًا في إنقاذ روح.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="مشاركة التطبيق"
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.shareButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={COLORS.primaryStrong}
                />
                <AppText style={styles.shareButtonText}>مشاركة التطبيق</AppText>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLine} />

              <AppText style={styles.footerCopyright}>
                جميع الحقوق محفوظة © 2026 ResQ
              </AppText>

              <View style={styles.footerLinks}>
                <Pressable onPress={() => openRoute("/privacy-policy")}>
                  <AppText style={styles.footerLink}>سياسة الخصوصية</AppText>
                </Pressable>

                <View style={styles.footerDot} />

                <Pressable onPress={() => openRoute("/terms-and-conditions")}>
                  <AppText style={styles.footerLink}>الشروط والأحكام</AppText>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="link"
                onPress={handleContact}
                style={({ pressed }) => [
                  styles.footerContact,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.footerContactText}>
                  {ABOUT_SUPPORT_EMAIL}
                </AppText>
              </Pressable>
            </View>
          </View>
        </ShellAwareScrollView>

        <Modal
          visible={licensesVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLicensesVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { width: contentWidth }]}>
              <View style={styles.modalHeader}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق"
                  hitSlop={10}
                  onPress={() => setLicensesVisible(false)}
                  style={({ pressed }) => [
                    styles.modalCloseButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={22} color={COLORS.icon} />
                </Pressable>

                <AppText style={styles.modalTitle}>التراخيص المفتوحة</AppText>
              </View>

              <AppText style={styles.modalText}>
                يستخدم ResQ مكتبات مفتوحة المصدر، بما في ذلك React Native وExpo
                وExpo Router وIonicons. تخضع كل مكتبة لشروط الترخيص الخاصة بها.
              </AppText>

              <View style={styles.licenseList}>
                <AppText style={styles.licenseItem}>React Native — MIT</AppText>
                <AppText style={styles.licenseItem}>Expo — MIT</AppText>
                <AppText style={styles.licenseItem}>Expo Router — MIT</AppText>
                <AppText style={styles.licenseItem}>Ionicons — MIT</AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => setLicensesVisible(false)}
                style={({ pressed }) => [
                  styles.modalDoneButton,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.modalDoneText}>تم</AppText>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
