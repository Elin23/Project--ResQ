import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Share,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import IconButton from "@/src/components/ui/IconButton";
import { IMAGES } from "@/src/assets/images";
import { styles } from "./HelpCenter.styles";

import { ARTICLES, CATEGORIES, FAQS, normalizeText } from "../constants/helpCenter";

export default function HelpCenterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);
  const normalizedQuery = normalizeText(searchQuery);

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return CATEGORIES;
    }

    return CATEGORIES.filter((item) =>
      normalizeText([item.title, ...item.keywords].join(" ")).includes(
        normalizedQuery,
      ),
    );
  }, [normalizedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!normalizedQuery) {
      return FAQS;
    }

    return FAQS.filter((item) =>
      normalizeText(
        [item.question, item.answer, ...item.keywords].join(" "),
      ).includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) {
      return ARTICLES;
    }

    return ARTICLES.filter((item) =>
      normalizeText([item.title, ...item.keywords].join(" ")).includes(
        normalizedQuery,
      ),
    );
  }, [normalizedQuery]);

  const hasResults =
    filteredCategories.length > 0 ||
    filteredFaqs.length > 0 ||
    filteredArticles.length > 0;

  const openRoute = (_route: string) => {
    Alert.alert(
      "المحتوى قيد التجهيز",
      "سيتم ربط هذه المقالة بقاعدة المعرفة عند إضافة محتوى الدعم النهائي.",
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as never);
  };

  const handleContactUs = () => {
    router.push("/contact-us" as never);
  };

  const handleReportProblem = async () => {
    const subject = encodeURIComponent("الإبلاغ عن مشكلة في تطبيق ResQ");
    const body = encodeURIComponent(
      "نوع المشكلة:\n\nوصف المشكلة:\n\nالخطوات التي أدت إلى المشكلة:\n",
    );
    const url = `mailto:support@resq.app?subject=${subject}&body=${body}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    await Share.share({
      title: "مركز مساعدة ResQ",
      message:
        "يمكنك الحصول على المساعدة والإجابة عن الأسئلة الشائعة من مركز مساعدة ResQ.",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="المساعدة"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="help-circle-outline" size={24} color="#26211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>مركز المساعدة</AppText>

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
            <Ionicons name="arrow-forward-outline" size={25} color="#26211F" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <Image
              source={IMAGES.helpCenterHero}
              resizeMode="cover"
              style={styles.heroImage}
            />

            <AppText style={styles.heroTitle}>كيف يمكننا مساعدتك؟</AppText>
            <AppText style={styles.heroDescription}>
              ابحث عن إجابات أو تصفّح المواضيع الأكثر شيوعًا.
            </AppText>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={22} color="#7C897E" />

              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="ابحث عن سؤال أو موضوع..."
                placeholderTextColor="#92928F"
                returnKeyType="search"
                style={styles.searchInput}
              />

              {searchQuery.length > 0 ? (
                <IconButton
                  icon="close-circle"
                  accessibilityLabel="مسح البحث"
                  size={20}
                  color="#8C8985"
                  onPress={() => setSearchQuery("")}
                />
              ) : null}
            </View>

            {!hasResults ? (
              <EmptyState
                title="لا توجد نتائج"
                description="جرّب استخدام كلمات مختلفة، أو تواصل مع فريق الدعم."
                icon="search-outline"
                actionTitle="التواصل مع الدعم"
                onActionPress={handleContactUs}
                style={styles.emptyCard}
              />
            ) : (
              <>
                {filteredCategories.length > 0 ? (
                  <View style={styles.categoriesGrid}>
                    {filteredCategories.map((item) => (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                        onPress={() => openRoute(item.route)}
                        style={({ pressed }) => [
                          styles.categoryCard,
                          pressed && styles.cardPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: item.iconBackground },
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={22}
                            color={item.iconColor}
                          />
                        </View>

                        <AppText style={styles.categoryTitle}>
                          {item.title}
                        </AppText>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                {filteredFaqs.length > 0 ? (
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>
                      الأسئلة الأكثر شيوعًا
                    </AppText>

                    <View style={styles.faqList}>
                      {filteredFaqs.map((item) => {
                        const isExpanded = expandedFaqId === item.id;

                        return (
                          <Pressable
                            key={item.id}
                            accessibilityRole="button"
                            accessibilityState={{ expanded: isExpanded }}
                            onPress={() =>
                              setExpandedFaqId((current) =>
                                current === item.id ? null : item.id,
                              )
                            }
                            style={({ pressed }) => [
                              styles.faqCard,
                              pressed && styles.cardPressed,
                            ]}
                          >
                            <View style={styles.faqHeader}>
                              <AppText style={styles.faqQuestion}>
                                {item.question}
                              </AppText>

                              <Ionicons
                                name={
                                  isExpanded
                                    ? "chevron-up-outline"
                                    : "chevron-down-outline"
                                }
                                size={20}
                                color="#35312E"
                              />
                            </View>

                            {isExpanded ? (
                              <AppText style={styles.faqAnswer}>
                                {item.answer}
                              </AppText>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                {filteredArticles.length > 0 ? (
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>مقالات مقترحة</AppText>

                    <View style={styles.articlesCard}>
                      {filteredArticles.map((item, index) => (
                        <Pressable
                          key={item.id}
                          accessibilityRole="button"
                          onPress={() => openRoute(item.route)}
                          style={({ pressed }) => [
                            styles.articleRow,
                            index < filteredArticles.length - 1 &&
                              styles.articleBorder,
                            pressed && styles.articlePressed,
                          ]}
                        >
                          <Ionicons
                            name="chevron-back-outline"
                            size={20}
                            color="#829087"
                          />

                          <View style={styles.articleTextWrap}>
                            <AppText style={styles.articleTitle}>
                              {item.title}
                            </AppText>

                            <View style={styles.articleMeta}>
                              <Ionicons
                                name="time-outline"
                                size={14}
                                color="#69736C"
                              />
                              <AppText style={styles.articleDuration}>
                                {item.duration}
                              </AppText>
                            </View>
                          </View>

                          <View style={styles.articleIcon}>
                            <Ionicons
                              name={item.icon}
                              size={22}
                              color="#FF7E3D"
                            />
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}
              </>
            )}

            <View style={styles.supportCard}>
              <AppText style={styles.supportTitle}>لم تجد ما تبحث عنه؟</AppText>
              <AppText style={styles.supportDescription}>
                يمكن لفريق الدعم مساعدتك في حل أي مشكلة أو الرد على استفساراتك.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى صفحة تواصل معنا"
                onPress={handleContactUs}
                style={({ pressed }) => [
                  styles.supportPrimaryButton,
                  pressed && styles.supportPressed,
                ]}
              >
                <Ionicons name="chatbox-outline" size={20} color="#FFFFFF" />
                <AppText style={styles.supportPrimaryText}>
                  التواصل مع الدعم
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleReportProblem}
                style={({ pressed }) => [
                  styles.supportSecondaryButton,
                  pressed && styles.supportPressed,
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <AppText style={styles.supportSecondaryText}>
                  الإبلاغ عن مشكلة
                </AppText>
              </Pressable>
            </View>

            <View style={styles.linksCard}>
              <Pressable
                onPress={() => openRoute("/privacy-policy")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>سياسة الخصوصية</AppText>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                onPress={() => openRoute("/terms-and-conditions")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>الشروط والأحكام</AppText>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                onPress={() => openRoute("/about")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>حول ResQ</AppText>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى صفحة تواصل معنا"
                onPress={handleContactUs}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>تواصل معنا</AppText>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>
            </View>

            <View style={styles.footer}>
              <AppText style={styles.footerLogo}>ResQ</AppText>
              <AppText style={styles.footerCopyright}>
                جميع الحقوق محفوظة © 2024 ResQ
              </AppText>

              <View style={styles.footerLinks}>
                <Pressable onPress={() => openRoute("/privacy-policy")}>
                  <AppText style={styles.footerLink}>سياسة الخصوصية</AppText>
                </Pressable>

                <Pressable onPress={() => openRoute("/terms-and-conditions")}>
                  <AppText style={styles.footerLink}>الشروط والأحكام</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
