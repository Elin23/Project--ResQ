import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import RemoteImage from "@/src/components/ui/RemoteImage";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import type { SearchResult } from "@/src/types/search";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";

export default function SearchResultCard({ result, onPress }: { result: SearchResult; onPress: () => void }) {
  const { isNarrow } = useResponsiveLayout();
  if (result.type === "clinic") {
    return (
      <Card onPress={onPress} padding={SPACING.md} radius={RADIUS.lg} borderColor={COLORS.border} borderWidth={1} style={styles.rowCard}>
        <View style={styles.icon}><Ionicons name="medkit-outline" size={28} color={COLORS.white} /></View>
        <View style={styles.copy}>
          <View style={styles.titleRow}><AppText weight="bold" variant="h3" style={styles.flexText}>{result.title}</AppText>{result.status ? <View style={[styles.badge,{backgroundColor:result.status.backgroundColor}]}><AppText variant="label" color={result.status.textColor}>{result.status.label}</AppText></View>:null}</View>
          <AppText variant="label" color={COLORS.textSecondary} numberOfLines={2}>{result.subtitle}</AppText>
          <AppText variant="caption" color={COLORS.textMuted}>{result.services}</AppText>
        </View>
      </Card>
    );
  }
  return (
    <Card onPress={onPress} padding={0} radius={RADIUS.lg} borderColor={COLORS.border} borderWidth={1} style={styles.card}>
      {result.image ? <RemoteImage uri={typeof result.image === "object" && result.image && "uri" in result.image ? String(result.image.uri) : undefined} style={[styles.image, isNarrow && styles.imageContainerNarrow]} accessibilityLabel={result.title} /> : <View style={[styles.image, isNarrow && styles.imageContainerNarrow, styles.imageFallback]}><Ionicons name={result.type === "report" ? "alert-circle-outline" : "paw-outline"} size={38} color={COLORS.iconMuted}/></View>}
      <View style={styles.body}>
        <View style={styles.copy}><AppText weight="bold" variant="h3" numberOfLines={2}>{result.title}</AppText><AppText variant="label" color={COLORS.textSecondary} numberOfLines={2}>{result.subtitle}</AppText></View>
        {result.badge ? <View style={[styles.badge,{backgroundColor:result.badge.backgroundColor}]}><AppText variant="label" color={result.badge.textColor}>{result.badge.label}</AppText></View>:null}
      </View>
    </Card>
  );
}
const styles=StyleSheet.create({
  card:{marginBottom:SPACING.md,overflow:"hidden"}, image:{width:"100%",height:170}, imageContainerNarrow:{height:135}, imageFallback:{alignItems:"center",justifyContent:"center",backgroundColor:COLORS.surfaceMuted}, body:{flexDirection:"row",direction:"rtl",alignItems:"center",gap:SPACING.sm,padding:SPACING.md}, copy:{flex:1,minWidth:0,gap:SPACING.xs}, rowCard:{flexDirection:"row",direction:"rtl",alignItems:"center",gap:SPACING.md,marginBottom:SPACING.md}, icon:{width:56,height:56,borderRadius:RADIUS.md,backgroundColor:COLORS.accent,alignItems:"center",justifyContent:"center"}, titleRow:{flexDirection:"row",direction:"rtl",alignItems:"center",gap:SPACING.sm}, flexText:{flex:1,minWidth:0}, badge:{flexShrink:0,borderRadius:RADIUS.full,paddingHorizontal:SPACING.sm,paddingVertical:4}
});
