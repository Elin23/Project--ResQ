import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; tone: "phone" | "email"; onPress: () => void };
export default function OrganizationContactCard({ icon, label, value, tone, onPress }: Props) {
  const color = tone === "phone" ? COLORS.brown : COLORS.bgblue;
  const background = tone === "phone" ? COLORS.contactPhoneBg : COLORS.contactEmailBg;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <View style={[styles.icon, { backgroundColor: background }]}><Ionicons name={icon} size={25} color={color}/></View>
    <View style={styles.text}><AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{label}</AppText><AppText weight="bold">{value}</AppText></View>
  </Pressable>;
}
const styles=StyleSheet.create({ card:{flexDirection:"row-reverse",alignItems:"center",gap:SPACING.md,padding:SPACING.md,borderRadius:RADIUS.md,backgroundColor:COLORS.background,borderWidth:1,borderColor:COLORS.border,marginBottom:SPACING.md}, icon:{width:48,height:48,borderRadius:RADIUS.full,alignItems:"center",justifyContent:"center"}, text:{flex:1,alignItems:"flex-end"}, pressed:{opacity:.75} });
