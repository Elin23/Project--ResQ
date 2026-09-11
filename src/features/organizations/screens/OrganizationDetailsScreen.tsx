import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Linking, Share, StyleSheet, View, type ImageSourcePropType } from "react-native";
import AppText from "@/src/components/ui/AppText";
import RemoteImage from "@/src/components/ui/RemoteImage";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import EmptyState from "@/src/components/ui/EmptyState";
import ErrorState from "@/src/components/ui/ErrorState";
import Screen from "@/src/components/ui/Screen";
import IconButton from "@/src/components/ui/IconButton";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useAdoptionListings } from "@/src/features/adoption/hooks/useAdoptionListings";
import { useFavorites } from "@/src/features/favorites";
import SearchResultCard from "@/src/features/search/components/SearchResultCard";
import { useSession } from "@/src/features/session/SessionContext";
import { adoptionDetailsRoute } from "@/src/navigation/routes";
import OrganizationContactCard from "../components/OrganizationContactCard";
import OrganizationStatsGrid from "../components/OrganizationStatsGrid";
import { useOrganizationDetails } from "../hooks/useOrganizationDetails";


function imageSourceUri(source?: ImageSourcePropType): string | undefined {
  if (!source) return undefined;
  if (typeof source === "number") return Image.resolveAssetSource(source)?.uri;
  if (Array.isArray(source)) return source.find((item) => typeof item === "object" && item?.uri)?.uri;
  return typeof source === "object" && "uri" in source ? source.uri : undefined;
}

export default function OrganizationDetailsScreen() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { can, accountKind } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const organizationState = useOrganizationDetails(id);
  const organization = organizationState.data;
  const canViewAdoption = can("view-adoption");
  const { listings, loading: adoptionLoading, error: adoptionError, reload: reloadAdoption } = useAdoptionListings(canViewAdoption);
  const adoptionListings = listings.filter((listing) => listing.organizationId === id);
  if (organizationState.loading) return <Screen><Stack.Screen options={{headerShown:false}}/><SkeletonList count={4}/></Screen>;
  if (organizationState.error) return <Screen><Stack.Screen options={{headerShown:false}}/><ErrorState description={organizationState.error} onRetry={() => void organizationState.reload()}/></Screen>;
  if (!organization) return <Screen><Stack.Screen options={{headerShown:false}}/><EmptyState title="الجهة غير موجودة" description="قد تكون الجهة غير متاحة حاليًا." actionTitle="العودة" onActionPress={() => router.back()}/></Screen>;
  const share = () => Share.share({ message: `${organization.name}\n${organization.city}، ${organization.country}` });
  const favorite = isFavorite("organization", organization.id);
  const toggle = () => {
    const added = toggleFavorite({ kind: "organization", id: organization.id, title: organization.name });
    showFeedback({
      title: added ? "تمت الإضافة" : "تمت الإزالة",
      message: added ? "تمت إضافة الجهة إلى المفضلة." : "تمت إزالة الجهة من المفضلة.",
      tone: added ? "success" : "info",
    });
  };
  return <Screen scroll padded={false} surface="app" safeAreaEdges={["top","left","right"]} contentContainerStyle={styles.content}>
    <Stack.Screen options={{headerShown:false}}/>
    <ScreenHeader
      title="الملف التعريفي"
      onBack={() => router.back()}
      right={
        <View style={styles.headerActions}>
          <IconButton icon="share-social-outline" accessibilityLabel="مشاركة الجمعية" onPress={share} />
          <IconButton icon={favorite ? "heart" : "heart-outline"} color={favorite ? COLORS.danger : COLORS.icon} selected={favorite} accessibilityLabel={favorite ? "إزالة الجمعية من المفضلة" : "إضافة الجمعية إلى المفضلة"} onPress={toggle} />
        </View>
      }
    />
    <RemoteImage uri={organization.coverUrl ?? imageSourceUri(organization.image)} style={styles.hero} accessibilityLabel="صورة الجمعية" />
    <View style={styles.body}>
      <RemoteImage uri={imageSourceUri(organization.logo ?? organization.image)} style={styles.logo} accessibilityLabel={`شعار ${organization.name}`} />
      <View style={styles.titleRow}>{organization.verified ? <Ionicons name="checkmark-circle" size={20} color={COLORS.successDark}/> : null}<AppText variant="h1" weight="bold">{organization.name}</AppText></View>
      <View style={styles.meta}><Ionicons name="location-outline" size={16} color={COLORS.textSecondary}/><AppText color={COLORS.textSecondary}>{organization.city}، {organization.country}</AppText>{(organization.reviews ?? 0) > 0 && organization.rating != null ? <AppText color={COLORS.textSecondary}>★ {organization.rating} ({organization.reviews} تقييم)</AppText> : null}</View>
      <SectionTitle title="نبذة عن الجمعية"/><AppText color={COLORS.textSecondary} style={styles.paragraph}>{organization.description}</AppText>
      <SectionTitle title="الخدمات"/><View style={styles.services}>{organization.services.map((item)=><View key={item} style={styles.service}><AppText>{item === "إنقاذ" ? "إنقاذ الحيوانات" : item === "علاج" ? "العلاج البيطري" : item}</AppText></View>)}</View>
      {[organization.successfulCases, organization.animalsTreated, organization.volunteers, organization.activeRescues].some((value) => typeof value === "number") ? <><SectionTitle title="إحصائيات الجمعية"/><OrganizationStatsGrid organization={organization}/></> : null}
      <SectionTitle title="ساعات العمل"/><View style={styles.hours}>{organization.operatingHours?.length ? organization.operatingHours.map((hour) => <View key={hour.id} style={styles.hourRow}><AppText color={hour.isClosed ? COLORS.danger : COLORS.textSecondary}>{hour.isClosed ? "مغلق" : hour.isOpen24Hours ? "24 ساعة" : `${hour.opensAt ?? "--"} - ${hour.closesAt ?? "--"}`}</AppText><AppText>{hour.dayOfWeek ?? ""}</AppText></View>) : <AppText color={COLORS.textSecondary}>لم تُحدد ساعات العمل.</AppText>}</View>
      <SectionTitle title="الموقع"/><View style={styles.mapCard}><View style={styles.address}><Ionicons name="location-outline" size={22} color={COLORS.primary}/><View style={styles.addressText}><AppText weight="bold">{organization.address ?? `${organization.city}، ${organization.country}`}</AppText></View></View>{organization.latitude != null && organization.longitude != null ? <View style={styles.mapActions}><Button title="فتح في الخرائط" onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${organization.latitude},${organization.longitude}`)} variant="outline" size="small" icon="map-outline" style={styles.flex}/></View> : null}</View>
      <SectionTitle title="معلومات التواصل"/>{organization.phone ? <OrganizationContactCard icon="call-outline" label="رقم الهاتف" value={organization.phone} tone="phone" onPress={() => Linking.openURL(`tel:${organization.phone}`)}/> : null}{organization.email ? <OrganizationContactCard icon="mail-outline" label="البريد الإلكتروني" value={organization.email} tone="email" onPress={() => Linking.openURL(`mailto:${organization.email}`)}/> : null}
      {canViewAdoption ? <>
        <SectionTitle title="حيوانات متاحة للتبني"/>
        {adoptionLoading ? <SkeletonList count={2}/> : adoptionError ? <ErrorState description={adoptionError} onRetry={() => void reloadAdoption()}/> : adoptionListings.length > 0 ? adoptionListings.map((listing) => (
          <SearchResultCard
            key={listing.id}
            result={{ id: `adoption-${listing.id}`, entityId: listing.id, type: "adoption", title: `${listing.animalName} • ${listing.animalType}`, subtitle: listing.locationName, meta: "متاح للتبني", image: { uri: listing.imageUrl }, badge: { label: "متاح للتبني", backgroundColor: COLORS.successSoft, textColor: COLORS.successDark } }}
            onPress={() => router.push(adoptionDetailsRoute(listing.id, accountKind))}
          />
        )) : <EmptyState compact icon="paw-outline" title="لا توجد حيوانات متاحة للتبني" description="ستظهر هنا حالات التبني الخاصة بالجمعية عند إضافتها."/>}
      </> : null}
      <ActionStack style={styles.actions}><Button title="تبرع للجمعية" onPress={() => router.push("/donations")} backgroundColor={COLORS.brown} borderColor={COLORS.brown}/><Button title="التواصل مع الجمعية" onPress={() => router.push("/contact-us")} variant="outline" /></ActionStack>
    </View>
  </Screen>;
}
function SectionTitle({title}:{title:string}){return <AppText variant="h3" weight="bold" style={styles.sectionTitle}>{title}</AppText>}
const styles=StyleSheet.create({
  content:{paddingVertical:0}, headerActions:{flexDirection:"row",direction:"rtl",alignItems:"center",gap:SPACING.md}, hero:{width:"100%",height:205}, body:{padding:SPACING.lg,paddingBottom:40}, logo:{width:105,height:105,borderRadius:RADIUS.full,alignSelf:"flex-end",marginTop:-55,borderWidth:5,borderColor:COLORS.background,backgroundColor:COLORS.background}, titleRow:{flexDirection:"row",direction:"rtl",alignItems:"center",gap:SPACING.sm,marginTop:SPACING.md}, meta:{flexDirection:"row",direction:"rtl",alignItems:"center",flexWrap:"wrap",gap:SPACING.xs,marginTop:SPACING.xs}, sectionTitle:{marginTop:SPACING.xl,marginBottom:SPACING.md}, paragraph:{textAlign:"auto"}, services:{flexDirection:"row",direction:"rtl",flexWrap:"wrap",gap:SPACING.sm}, service:{backgroundColor:COLORS.neutral,paddingHorizontal:SPACING.md,paddingVertical:8,borderRadius:RADIUS.full}, hours:{backgroundColor:COLORS.lightgray,borderRadius:RADIUS.md,padding:SPACING.md}, hourRow:{flexDirection:"row",direction:"rtl",justifyContent:"space-between"}, separator:{height:1,backgroundColor:COLORS.border,marginVertical:SPACING.md}, mapCard:{borderWidth:1,borderColor:COLORS.border,borderRadius:RADIUS.md,overflow:"hidden",backgroundColor:COLORS.background}, map:{width:"100%",height:190}, address:{flexDirection:"row",direction:"rtl",gap:SPACING.sm,padding:SPACING.md}, addressText:{flex:1,alignItems:"stretch"}, mapActions:{flexDirection:"row",direction:"rtl",gap:SPACING.sm,padding:SPACING.md,paddingTop:0}, flex:{flex:1}, actions:{marginTop:SPACING.xl}
});
