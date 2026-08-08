import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";

type Props = { avatarUri: string; name: string; onEdit: () => void };
export default function ProfileHeader({ avatarUri, name, onEdit }: Props) {
  return <View style={s.wrap}>
    <View style={s.top}><Pressable onPress={onEdit}><Ionicons name="create-outline" size={25} color={COLORS.text}/></Pressable><AppText style={s.title}>حسابي</AppText><Ionicons name="settings-outline" size={25} color={COLORS.text}/></View>
    <View style={s.avatarWrap}><Image source={{uri: avatarUri}} style={s.avatar}/><View style={s.verified}><Ionicons name="checkmark-circle" size={22} color={COLORS.successDark}/></View></View>
    <AppText style={s.name}>{name}</AppText>
    <View style={s.meta}><AppText color={COLORS.textSecondary}>دمشق، سوريا</AppText><View style={s.badge}><AppText size={FONT_SIZES.label} color={COLORS.successDark}>عضو موثوق</AppText></View></View>
    <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>عضو منذ مارس 2025</AppText>
  </View>;
}
const s=StyleSheet.create({wrap:{alignItems:"center",gap:SPACING.sm},top:{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{fontFamily:FONTS.bold,fontSize:FONT_SIZES.headline},avatarWrap:{marginTop:SPACING.md},avatar:{width:126,height:126,borderRadius:RADIUS.full,borderWidth:4,borderColor:COLORS.primary},verified:{position:"absolute",right:-2,bottom:8,backgroundColor:COLORS.successLight,borderRadius:RADIUS.full,padding:3},name:{fontFamily:FONTS.bold,fontSize:30},meta:{flexDirection:"row",alignItems:"center",gap:SPACING.sm},badge:{backgroundColor:COLORS.successLight,borderRadius:RADIUS.full,paddingHorizontal:12,paddingVertical:5}});
