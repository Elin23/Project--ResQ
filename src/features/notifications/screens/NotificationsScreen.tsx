import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import AppText from "@/src/components/ui/AppText";
import IconButton from "@/src/components/ui/IconButton";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { adoptionApplicationDetailsRoute, adoptionListingApplicationsRoute, adoptionRoute, reportDetailsRoute } from "@/src/navigation/routes";
import { COLORS, FONTS, RADIUS, SPACING } from "@/src/theme";
import { useSession } from "@/src/features/session/SessionContext";
import NotificationCard from "../components/NotificationCard";
import { NOTIFICATION_FILTERS, type NotificationFilter, type NotificationItem } from "../constants/notifications";
import { useAccountNotifications } from "../hooks";

export default function NotificationsScreen() {
  const router = useRouter();
  const { account, accountKind } = useSession();
  const browseKind = account?.kind === "organization" && account.status === "pending" ? "user" : accountKind;
  const state = useAccountNotifications(account?.id);
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>("all");
  const items = useMemo<NotificationItem[]>(() => state.notifications.map((n) => ({
    id:n.id,title:n.title,time:new Intl.DateTimeFormat("ar",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}).format(new Date(n.createdAt)),unread:!n.readAt,category:n.category,icon:n.category==="adoption"?"heart-outline":n.category==="reports"?"notifications-outline":"people-outline",target:n.target,
  })),[state.notifications]);
  const visible=items.filter(i=>selectedFilter==="all"||i.category===selectedFilter);
  if(state.loading)return <Screen><LoadingState label="جاري تحميل الإشعارات..." /></Screen>;
  if(state.error)return <Screen><ErrorState description={state.error} onRetry={()=>void state.reload()} /></Screen>;
  const openNotification=async(item:NotificationItem)=>{
    await state.markRead(item.id);
    const t=item.target;
    if(t?.kind==="adoption-application"){
      router.push(adoptionApplicationDetailsRoute(t.applicationId,browseKind));
    }else if(t?.kind==="adoption-listing-applications"){
      router.push(adoptionListingApplicationsRoute(t.listingId,browseKind));
    }else if(t?.kind==="report"){
      router.push(reportDetailsRoute(t.reportId,browseKind));
    }else{
      router.push(adoptionRoute(browseKind));
    }
  };
  return <Screen scroll padded={false} surface="app" contentContainerStyle={styles.content}>
    <ScreenHeader title="الإشعارات" onBack={()=>router.back()} right={<IconButton icon="checkmark-done" accessibilityLabel="تحديد الكل كمقروء" onPress={()=>void state.markAllRead()} />} />
    <View style={styles.filters}>{NOTIFICATION_FILTERS.map(filter=>{const active=selectedFilter===filter.id;return <Pressable key={filter.id} accessibilityRole="button" onPress={()=>setSelectedFilter(filter.id)} style={({pressed})=>[styles.filter,active&&styles.filterActive,pressed&&styles.filterPressed]}><AppText weight={active?"bold":"regular"} color={active?COLORS.onColor:COLORS.textSecondary}>{filter.label}</AppText></Pressable>;})}</View>
    <View style={styles.list}>{visible.map(item=><NotificationCard key={item.id} item={item} onPress={()=>void openNotification(item)} />)}{visible.length===0?<View style={styles.empty}><Ionicons name="notifications-off-outline" size={42} color={COLORS.iconMuted}/><AppText weight="bold">لا توجد إشعارات ضمن هذا التصنيف</AppText></View>:null}</View>
  </Screen>;
}
const styles=StyleSheet.create({content:{paddingBottom:SPACING.xl},filters:{flexDirection:"row",direction:"rtl",gap:SPACING.sm,paddingHorizontal:SPACING.md,marginBottom:SPACING.md},filter:{paddingHorizontal:SPACING.md,paddingVertical:SPACING.sm,borderRadius:RADIUS.full,backgroundColor:COLORS.darkgray},filterActive:{backgroundColor:COLORS.primary},filterPressed:{opacity:.8},list:{paddingHorizontal:SPACING.md},sectionTitle:{fontFamily:FONTS.medium,textAlign:"auto",marginBottom:SPACING.sm},empty:{alignItems:"center",gap:SPACING.md,paddingVertical:SPACING.xl}});
