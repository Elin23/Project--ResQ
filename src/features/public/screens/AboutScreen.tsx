import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import { styles } from "./About.styles";

type IoniconName = keyof typeof Ionicons.glyphMap;

type FeatureItem = {
  id: string;
  title: string;
  icon: IoniconName;
};

type InfoItem = {
  id: string;
  label: string;
  value: string;
};

type SocialItem = {
  id: string;
  title: string;
  icon: IoniconName;
  url: string;
};

const APP_VERSION = "1.0.0";
const LAST_UPDATED = "يناير 2026";
const PLATFORM = "Android";
const SUPPORT_EMAIL = "support@resq.app";

const FEATURES: FeatureItem[] = [
  { id: "reports", title: "الإبلاغ عن حالات", icon: "alert-circle-outline" },
  { id: "tracking", title: "متابعة البلاغات", icon: "time-outline" },
  { id: "adoption", title: "التبني", icon: "heart-outline" },
  { id: "donations", title: "التبرعات", icon: "wallet-outline" },
  { id: "feeding", title: "نقاط الإطعام", icon: "location-outline" },
  { id: "clinics", title: "عيادات بيطرية", icon: "medkit-outline" },
  { id: "organizations", title: "الجمعيات", icon: "people-outline" },
  { id: "volunteering", title: "التطوع", icon: "hand-left-outline" },
];

const INFO_ITEMS: InfoItem[] = [
  { id: "version", label: "الإصدار", value: APP_VERSION },
  { id: "updated", label: "آخر تحديث", value: LAST_UPDATED },
  { id: "platform", label: "المنصة", value: PLATFORM },
];

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "website",
    title: "الموقع الإلكتروني",
    icon: "globe-outline",
    url: "https://resq.app",
  },
  {
    id: "facebook",
    title: "فيسبوك",
    icon: "logo-facebook",
    url: "https://www.facebook.com",
  },
  {
    id: "instagram",
    title: "إنستغرام",
    icon: "logo-instagram",
    url: "https://www.instagram.com",
  },
  {
    id: "linkedin",
    title: "لينكد إن",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com",
  },
];

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

    router.replace("/" as never);
  };

  const openRoute = (route: string) => {
    router.push(route as never);
  };

  const openExternalUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleContact = async () => {
    const subject = encodeURIComponent("استفسار حول تطبيق ResQ");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

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
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة معلومات التطبيق"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <View style={styles.topBarTitleWrap}>
            <AppText style={styles.topBarTitle}>حول ResQ</AppText>
            <Ionicons name="paw" size={18} color="#2B2724" />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={24} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
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
                <Ionicons name="paw" size={48} color="#FFFFFF" />
              </View>

              <View style={styles.brandRow}>
                <Ionicons name="paw" size={20} color="#2B2724" />

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
                <Ionicons name="flag-outline" size={21} color="#18833B" />
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
                <Ionicons name="eye-outline" size={22} color="#B64E00" />
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
                {FEATURES.map((item) => (
                  <View key={item.id} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name={item.icon} size={21} color="#18833B" />
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
                  color="#5E625F"
                />
                <AppText style={styles.cardTitle}>معلومات التطبيق</AppText>
              </View>

              {INFO_ITEMS.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.infoRow,
                    index < INFO_ITEMS.length - 1 && styles.rowBorder,
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

              {SOCIAL_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="link"
                  accessibilityLabel={item.title}
                  onPress={() => openExternalUrl(item.url)}
                  style={({ pressed }) => [
                    styles.socialRow,
                    index < SOCIAL_ITEMS.length - 1 && styles.rowBorder,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Ionicons name="open-outline" size={18} color="#7B837D" />

                  <AppText style={styles.socialText}>{item.title}</AppText>

                  <Ionicons name={item.icon} size={20} color="#18833B" />
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
                <Ionicons name="help-buoy-outline" size={18} color="#AD4B18" />
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
                  color="#B64E00"
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
                  {SUPPORT_EMAIL}
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

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
                  <Ionicons name="close" size={22} color="#3B3531" />
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
