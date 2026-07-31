import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import {
    Pressable,
    ScrollView,
    Share,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import { styles } from "./TermsAndConditions.styles";

type TableItem = {
  id: string;
  title: string;
};

type SectionContent = {
  id: string;
  title: string;
  paragraphs: string[];
  warning?: string;
  bullets?: string[];
};

const TABLE_ITEMS: TableItem[] = [
  { id: "introduction", title: "مقدمة" },
  { id: "acceptance", title: "قبول الشروط" },
  { id: "account", title: "إنشاء الحساب" },
  { id: "usage", title: "استخدام التطبيق" },
  { id: "reports", title: "البلاغات" },
  { id: "adoption", title: "التبني" },
  { id: "donations", title: "التبرعات" },
  { id: "prohibited", title: "السلوك المحظور" },
  { id: "liability", title: "المسؤولية القانونية" },
  { id: "termination", title: "إنهاء الحساب" },
  { id: "updates", title: "تعديل الشروط" },
  { id: "contact", title: "التواصل معنا" },
];

const SECTIONS: SectionContent[] = [
  {
    id: "introduction",
    title: "مقدمة",
    paragraphs: [
      "مرحبًا بك في ResQ. توضح هذه الشروط والأحكام القواعد المنظمة لاستخدام التطبيق والخدمات المرتبطة به.",
      "باستخدامك للتطبيق فإنك تقر بأنك قرأت هذه الشروط وفهمتها ووافقت على الالتزام بها.",
    ],
  },
  {
    id: "acceptance",
    title: "قبول الشروط",
    paragraphs: [
      "يُعد إنشاء حساب أو استخدام أي ميزة داخل التطبيق موافقة صريحة على هذه الشروط وسياسة الخصوصية.",
      "إذا لم توافق على أي بند، يجب التوقف عن استخدام التطبيق وعدم إنشاء حساب.",
    ],
  },
  {
    id: "account",
    title: "إنشاء الحساب",
    paragraphs: [
      "يجب تقديم معلومات صحيحة وحديثة عند التسجيل، ويقع على المستخدم مسؤولية الحفاظ على سرية بيانات الدخول.",
      "يجوز لفريق ResQ طلب معلومات إضافية أو وثائق للتحقق من الحسابات التطوعية أو حسابات العيادات والجمعيات.",
    ],
  },
  {
    id: "usage",
    title: "استخدام التطبيق",
    paragraphs: [
      "يجب استخدام التطبيق فقط للأغراض المرتبطة بإنقاذ الحيوانات ورعايتها والتبني والتبرع والخدمات المساندة.",
      "لا يجوز إساءة استخدام المنصة أو محاولة تعطيلها أو الوصول غير المصرح به إلى بيانات المستخدمين أو الأنظمة.",
    ],
  },
  {
    id: "reports",
    title: "البلاغات والتقارير",
    paragraphs: [
      "يجب أن تكون جميع البلاغات المقدمة عبر التطبيق دقيقة ومرفقة بالموقع الجغرافي والصور المناسبة عند توفرها لضمان سرعة الوصول للحالة.",
    ],
    warning:
      "ملاحظة: البلاغات الكاذبة أو المتكررة دون مبرر قد تؤدي إلى حظر الحساب نهائيًا، والمساءلة في حال تسبب ذلك في هدر موارد الإنقاذ.",
  },
  {
    id: "adoption",
    title: "نظام التبني",
    paragraphs: [
      "تطبيق ResQ يعمل كوسيط للربط بين المتبنين والمنظمات أو الأفراد المسؤولين عن الحيوانات، ولا يملك الحيوانات المعروضة.",
      "القرار النهائي في عملية التبني يعود للجهة المسؤولة عن الحيوان بعد إجراء المقابلات والتحقق من أهلية المتبني.",
    ],
  },
  {
    id: "donations",
    title: "التبرعات المالية",
    paragraphs: [
      "تتم التحويلات المالية عبر الطرق المتاحة والمعتمدة داخل التطبيق، ويجب على المتبرع التأكد من صحة بيانات المستلم.",
      "تخضع طلبات التبرع للمراجعة والتدقيق لضمان وصول المساعدات للمستحقين، ويتم نشر تقارير دورية بالشفافية المطلوبة.",
    ],
  },
  {
    id: "prohibited",
    title: "السلوك المحظور",
    paragraphs: [],
    bullets: [
      "نشر معلومات مضللة أو إشاعات حول حالات الإنقاذ.",
      "الإساءة اللفظية أو التحرش بالمتطوعين أو مقدمي البلاغات.",
      "انتحال صفة طبيب بيطري أو ممثل لمنظمة إنقاذ.",
      "استخدام التطبيق في أي أغراض تجارية غير مصرح بها.",
    ],
  },
  {
    id: "liability",
    title: "المسؤولية القانونية",
    paragraphs: [
      "يبذل ResQ جهده لتوفير منصة آمنة وموثوقة، لكنه لا يضمن نتائج عمليات الإنقاذ أو التبني أو المعاملات التي تتم بين المستخدمين.",
      "يتحمل كل مستخدم مسؤولية قراراته وتصرفاته ومحتواه المنشور داخل التطبيق.",
    ],
  },
  {
    id: "termination",
    title: "إنهاء الحساب",
    paragraphs: [
      "يجوز للمستخدم طلب حذف حسابه في أي وقت، كما يحق لفريق ResQ تعليق أو إنهاء الحساب عند مخالفة هذه الشروط أو إساءة استخدام المنصة.",
      "قد يتم الاحتفاظ ببعض السجلات عند الحاجة للامتثال للمتطلبات القانونية أو حماية حقوق الأطراف.",
    ],
  },
  {
    id: "updates",
    title: "تعديل الشروط",
    paragraphs: [
      "يجوز تحديث هذه الشروط عند تطوير الخدمات أو المتطلبات القانونية، وسيتم إشعار المستخدمين بأي تعديلات جوهرية داخل التطبيق.",
      "استمرار استخدام التطبيق بعد نشر التعديلات يعني قبول النسخة المحدثة من الشروط.",
    ],
  },
];

export default function TermsAndConditionsScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const sectionOffsets = useRef<Record<string, number>>({});

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);
  const lastUpdated = useMemo(() => "15 مايو 2026", []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/register-entity" as never);
  };

  const handleShare = async () => {
    await Share.share({
      title: "الشروط والأحكام - ResQ",
      message: "اطّلع على الشروط والأحكام الخاصة باستخدام تطبيق ResQ.",
    });
  };

  const handleHelpCenter = () => {
    router.push("/help-center" as never);
  };

  const scrollToSection = (id: string) => {
    const y = sectionOffsets.current[id];

    if (typeof y !== "number") {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(0, y - 12),
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة الشروط والأحكام"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>الشروط والأحكام</AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressedButton,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={24} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.header}>
              <AppText style={styles.title}>الشروط والأحكام</AppText>

              <AppText style={styles.updatedText}>
                آخر تحديث: {lastUpdated}
              </AppText>

              <AppText style={styles.introText}>
                مرحبًا بكم في ResQ. نهدف من خلال هذه الاتفاقية إلى توضيح الحقوق
                والمسؤوليات المتبادلة لضمان بيئة آمنة وفعّالة لإنقاذ الحيوانات
                في سوريا.
              </AppText>
            </View>

            <View style={styles.noticeCard}>
              <View style={styles.noticeIcon}>
                <Ionicons name="information-circle" size={27} color="#FFFFFF" />
              </View>

              <View style={styles.noticeTextWrap}>
                <AppText style={styles.noticeTitle}>تنبيه مهم</AppText>
                <AppText style={styles.noticeText}>
                  استخدامك لتطبيق ResQ يعني موافقتك الصريحة والكاملة على كافة
                  البنود الواردة في هذه الصفحة. يرجى قراءتها بعناية قبل البدء
                  باستخدام خدماتنا.
                </AppText>
              </View>
            </View>

            <View style={styles.contentsCard}>
              <AppText style={styles.contentsTitle}>المحتويات</AppText>

              {TABLE_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`الانتقال إلى قسم ${item.title}`}
                  onPress={() => scrollToSection(item.id)}
                  style={({ pressed }) => [
                    styles.contentsRow,
                    index < TABLE_ITEMS.length - 1 && styles.contentsRowBorder,
                    pressed && styles.contentsRowPressed,
                  ]}
                >
                  <View style={styles.contentsRowContent}>
                    <AppText style={styles.contentsItemText}>
                      {item.title}
                    </AppText>

                    <Ionicons
                      name="chevron-back-outline"
                      size={17}
                      color="#726B66"
                    />
                  </View>
                </Pressable>
              ))}
            </View>

            {SECTIONS.map((section) => (
              <View
                key={section.id}
                onLayout={(event) => {
                  sectionOffsets.current[section.id] =
                    event.nativeEvent.layout.y;
                }}
                style={styles.sectionCard}
              >
                <AppText style={styles.sectionTitle}>{section.title}</AppText>

                {section.paragraphs.map((paragraph, index) => (
                  <AppText
                    key={`${section.id}-paragraph-${index}`}
                    style={styles.sectionParagraph}
                  >
                    {paragraph}
                  </AppText>
                ))}

                {section.bullets ? (
                  <View style={styles.bulletList}>
                    {section.bullets.map((item) => (
                      <View key={item} style={styles.bulletRow}>
                        <View style={styles.bulletDot} />
                        <AppText style={styles.bulletText}>{item}</AppText>
                      </View>
                    ))}
                  </View>
                ) : null}

                {section.warning ? (
                  <View style={styles.warningCard}>
                    <Ionicons
                      name="warning-outline"
                      size={20}
                      color="#C73732"
                    />
                    <AppText style={styles.warningText}>
                      {section.warning}
                    </AppText>
                  </View>
                ) : null}
              </View>
            ))}

            <View style={styles.helpCard}>
              <AppText style={styles.helpTitle}>
                هل لديك استفسار حول هذه الشروط؟
              </AppText>

              <AppText style={styles.helpDescription}>
                انتقل إلى مركز المساعدة للاطلاع على الأسئلة الشائعة وطرق الحصول
                على الدعم.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={handleHelpCenter}
                style={({ pressed }) => [
                  styles.helpLink,
                  pressed && styles.helpLinkPressed,
                ]}
              >
                <Ionicons name="help-buoy-outline" size={18} color="#AD4B18" />
                <AppText style={styles.helpText}>
                  الانتقال إلى مركز المساعدة
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View
          style={[styles.bottomBar, { paddingHorizontal: horizontalPadding }]}
        >
          <View style={[styles.bottomContent, { width: contentWidth }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="مشاركة الشروط"
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareButton,
                pressed && styles.bottomPressed,
              ]}
            >
              <Ionicons name="share-social-outline" size={21} color="#5F5955" />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تواصل معنا"
              style={({ pressed }) => [
                styles.contactButton,
                pressed && styles.bottomPressed,
              ]}
            >
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
              <AppText style={styles.contactButtonText}>تواصل معنا</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
