import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import CommunityStatCard from "../components/CommunityStatCard";
import OrganizationCard from "../components/OrganizationCard";
import { COMMUNITY_STATS, ORGANIZATIONS } from "../constants/organizations";
import { useOrganizations } from "../hooks/useOrganizations";

export default function OrganizationsScreen() {
  const router = useRouter();
  const controller = useOrganizations();
  return <Screen padded={false} scroll={false} backgroundColor={COLORS.surface} safeAreaEdges={["top","left","right"]}>
    <Stack.Screen options={{ headerShown: false }} />
    <ScreenHeader title="الجمعيات والمنظمات" onBack={() => router.back()} right={<View style={styles.headerActions}><Ionicons name="search-outline" size={24} color={COLORS.text}/><Ionicons name="options-outline" size={24} color={COLORS.text}/></View>} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.searchBox}><Ionicons name="search-outline" size={22} color={COLORS.textSecondary}/><TextInput value={controller.query} onChangeText={controller.setQuery} placeholder="ابحث عن جمعية أو مدينة..." placeholderTextColor={COLORS.placeholder} style={styles.searchInput}/></View>
      <View style={styles.sectionHeader}><Pressable onPress={() => controller.setQuery("")}><AppText color={COLORS.brown}>عرض الكل</AppText></Pressable><AppText weight="bold" size={FONT_SIZES.headline}>الجهات الموصى بها</AppText></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedRow}>
        {ORGANIZATIONS.slice(0,2).map((item) => <Pressable key={item.id} onPress={() => controller.openOrganization(item.id)} style={styles.recommendedCard}>
          <ImageCard item={item}/>
        </Pressable>)}
      </ScrollView>
      <AppText weight="bold" size={FONT_SIZES.headline} style={styles.communityTitle}>إحصائيات المجتمع</AppText>
      <View style={styles.statsGrid}>{COMMUNITY_STATS.map((item) => <CommunityStatCard key={item.id} {...item}/>)}</View>
      <View style={styles.sectionHeader}><AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>تم العثور على {controller.organizations.length} جهة</AppText><AppText weight="bold" size={FONT_SIZES.headline}>كافة الجهات</AppText></View>
      {controller.organizations.length ? controller.organizations.map((item) => <OrganizationCard key={item.id} organization={item} onOpen={() => controller.openOrganization(item.id)} onContact={() => router.push("/contact-us")}/>) : <EmptyState title="لا توجد جهات" description="جرّب البحث باسم آخر أو مدينة مختلفة."/>}
    </ScrollView>
  </Screen>;
}

function ImageCard({ item }: { item: (typeof ORGANIZATIONS)[number] }) {
  return <><View style={styles.recommendedImageWrap}><Image source={item.image} style={styles.recommendedImage}/>{item.verified && <View style={styles.verifiedPill}><Ionicons name="checkmark-circle" size={14} color={COLORS.onColor}/><AppText size={10} color={COLORS.onColor}>موثوق</AppText></View>}</View><View style={styles.recommendedBody}><AppText weight="bold" numberOfLines={1}>{item.name}</AppText><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{item.city}، {item.country}</AppText></View></>;
}

const styles = StyleSheet.create({
  headerActions: { flexDirection: "row", gap: SPACING.md },
  content: { padding: SPACING.lg, paddingBottom: 130 },
  searchBox: { height: 58, borderRadius: RADIUS.lg, backgroundColor: COLORS.lightgray, flexDirection: "row-reverse", alignItems: "center", gap: SPACING.sm, paddingHorizontal: SPACING.md },
  searchInput: { flex: 1, fontFamily: FONTS.regular, fontSize: FONT_SIZES.body, textAlign: "right", color: COLORS.text },
  sectionHeader: { marginTop: SPACING.xl, marginBottom: SPACING.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  recommendedRow: { gap: SPACING.md },
  recommendedCard: { width: 278, borderRadius: RADIUS.md, backgroundColor: COLORS.background, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  recommendedImageWrap: { height: 128 }, recommendedImage: { width: "100%", height: "100%" },
  verifiedPill: { position: "absolute", top: SPACING.sm, left: SPACING.sm, backgroundColor: COLORS.successDark, borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 4, flexDirection: "row", gap: 3, alignItems: "center" },
  recommendedBody: { padding: SPACING.md, alignItems: "flex-end" },
  communityTitle: { marginTop: SPACING.xl, marginBottom: SPACING.md },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", justifyContent: "space-between", gap: SPACING.md },
});
