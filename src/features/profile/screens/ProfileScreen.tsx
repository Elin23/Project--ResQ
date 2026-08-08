import { Alert, StyleSheet } from "react-native";
import Button from "@/src/components/ui/Button";
import Screen from "@/src/components/ui/Screen";
import { COLORS, SPACING } from "@/src/theme";
import ProfileHeader from "../components/ProfileHeader";
import ProfileMenuSection from "../components/ProfileMenuSection";
import ProfileStatsGrid from "../components/ProfileStatsGrid";
import { PROFILE_SECTIONS, PROFILE_STATS } from "../constants/profile";
import { useSession } from "@/src/features/session/SessionContext";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import { useProfile } from "../hooks/useProfile";
export default function ProfileScreen(){const { isGuest } = useSession(); const {profile,handleItemPress,edit,logout}=useProfile(); if (isGuest) return <GuestAccountGate/>; return <Screen scroll backgroundColor={COLORS.surface} contentContainerStyle={s.content}><ProfileHeader avatarUri={profile.avatarUri} name={`${profile.firstName} ${profile.lastName}`} onEdit={edit}/><ProfileStatsGrid stats={PROFILE_STATS}/>{PROFILE_SECTIONS.map(section=><ProfileMenuSection key={section.title} section={section} onPress={handleItemPress}/>)}<Button title="تسجيل الخروج" variant="ghost" onPress={logout}/><Button title="حذف الحساب" variant="outline" onPress={()=>Alert.alert("حذف الحساب","هذا الإجراء حساس وسيحتاج تأكيداً إضافياً.")} textColor={COLORS.danger}/></Screen>}
const s=StyleSheet.create({content:{paddingBottom:SPACING.xl,gap:SPACING.sm}});
