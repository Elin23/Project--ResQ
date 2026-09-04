import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ShellAwareScrollView from "@/src/components/ui/ShellAwareScrollView";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { useResponsiveCardWidth } from "@/src/hooks/useResponsiveCardWidth";
import CommunityStatCard from "../components/CommunityStatCard";
import OrganizationCard from "../components/OrganizationCard";
import { COMMUNITY_STATS, ORGANIZATIONS } from "../constants/organizations";
import { useOrganizations } from "../hooks/useOrganizations";

export default function OrganizationsScreen() {
  const router = useRouter();
  const recommendedCardWidth = useResponsiveCardWidth({ maxWidth: 300, minWidth: 228 });
  const controller = useOrganizations();
  return <Screen padded={false} scroll={false} surface="app" safeAreaEdges={["top","left","right"]}>
    <Stack.Screen options={{ headerShown: false }} />
    <ScreenHeader title="الجمعيات والمنظمات" onBack={() => router.back()} />
    <ShellAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.searchBox}><Ionicons name="search-outline" size={22} color={COLORS.textSecondary}/><TextInput value={controller.query} onChangeText={controller.setQuery} placeholder="ابحث عن جمعية أو مدينة..." placeholderTextColor={COLORS.placeholder} style={styles.searchInput}/></View>
      <SectionHeader title="الجهات الموصى بها" actionLabel="عرض الكل" onActionPress={() => controller.setQuery("")} style={styles.sectionHeader} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedRow}>
        {ORGANIZATIONS.slice(0,2).map((item) => <Pressable key={item.id} onPress={() => controller.openOrganization(item.id)} style={[styles.recommendedCard, { width: recommendedCardWidth }]}>
          <ImageCard item={item}/>
        </Pressable>)}
      </ScrollView>
      <SectionHeader title="إحصائيات المجتمع" style={styles.communityTitle} />
      <View style={styles.statsGrid}>{COMMUNITY_STATS.map((item) => <CommunityStatCard key={item.id} {...item}/>)}</View>
      <View style={styles.resultsHeader}><AppText variant="h3" weight="bold">كافة الجهات</AppText><AppText variant="label" color={COLORS.textSecondary}>تم العثور على {controller.organizations.length} جهة</AppText></View>
      <View style={styles.orgList}>{controller.organizations.length ? controller.organizations.map((item) => <OrganizationCard key={item.id} organization={item} onOpen={() => controller.openOrganization(item.id)} onContact={() => router.push("/contact-us")}/>) : <EmptyState title="لا توجد جهات" description="جرّب البحث باسم آخر أو مدينة مختلفة."/>}</View>
    </ShellAwareScrollView>
  </Screen>;
}

function ImageCard({ item }: { item: (typeof ORGANIZATIONS)[number] }) {
  return <><View style={styles.recommendedImageWrap}><Image source={item.image} style={styles.recommendedImage}/>{item.verified && <View style={styles.verifiedPill}><Ionicons name="checkmark-circle" size={14} color={COLORS.onColor}/><AppText variant="caption" color={COLORS.onColor}>موثوق</AppText></View>}</View><View style={styles.recommendedBody}><AppText weight="bold" numberOfLines={2}>{item.name}</AppText><AppText variant="caption" color={COLORS.textSecondary}>{item.city}، {item.country}</AppText></View></>;
}

const styles = StyleSheet.create({
  content: { padding: SPACING.lg },
  searchBox: { height: 58, borderRadius: RADIUS.lg, backgroundColor: COLORS.lightgray, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, fontFamily: FONTS.regular, fontSize: FONT_SIZES.body, textAlign: "right", color: COLORS.text },
  sectionHeader: { marginTop: SPACING.xl },
  resultsHeader: { width: "100%", marginTop: SPACING.xl, marginBottom: SPACING.md, gap: SPACING.xs, alignItems: "stretch" },
  recommendedRow: { gap: SPACING.md, direction: "rtl" },
  recommendedCard: { borderRadius: RADIUS.md, backgroundColor: COLORS.background, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  recommendedImageWrap: { height: 128 }, recommendedImage: { width: "100%", height: "100%" },
  verifiedPill: { position: "absolute", top: SPACING.sm, right: SPACING.sm, backgroundColor: COLORS.successDark, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 4, flexDirection: "row", direction: "rtl", gap: 3, alignItems: "center" },
  recommendedBody: { padding: SPACING.md, alignItems: "stretch" },
  communityTitle: { marginTop: SPACING.xl },
  orgList: { width: "100%", gap: SPACING.md },
  statsGrid: { flexDirection: "row", direction: "rtl", flexWrap: "wrap", justifyContent: "space-between", gap: SPACING.md },
});
