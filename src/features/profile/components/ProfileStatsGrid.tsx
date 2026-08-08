import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";
import type { ProfileStat } from "../types/profile";
export default function ProfileStatsGrid({stats}:{stats:ProfileStat[]}) { return <View style={s.grid}>{stats.map(x=><View key={x.label} style={s.card}><AppText style={[s.value,{color:x.color}]}>{x.value}</AppText><AppText color={COLORS.brownMuted}>{x.label}</AppText></View>)}</View> }
const s=StyleSheet.create({grid:{flexDirection:"row",flexWrap:"wrap",gap:SPACING.md,marginVertical:SPACING.lg},card:{width:"47.5%",alignItems:"center",paddingVertical:SPACING.lg,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.border,borderRadius:RADIUS.xl},value:{fontFamily:FONTS.bold,fontSize:32}});
