import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { onOpenMap: () => void };

export default function OrganizationMapPreview({ onOpenMap }: Props) {
  return (
    <Card padding={0} radius={RADIUS.lg} style={styles.card} onPress={onOpenMap}>
      <ImageBackground
        source={require("@/assets/images/organizations/org-map.png")}
        style={styles.map}
        imageStyle={styles.image}
      >
        <View style={styles.marker}>
          <Ionicons name="paw" size={22} color={COLORS.white} />
        </View>
        <View style={styles.caseBadge}>
          <AppText size={FONT_SIZES.caption} color={COLORS.danger}>حالة قريبة</AppText>
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title="فتح الخريطة"
            onPress={onOpenMap}
            variant="custom"
            size="small"
            backgroundColor={COLORS.surface}
            borderColor={COLORS.white}
            textColor={COLORS.text}
            icon="map-outline"
            radius={RADIUS.full}
          />
        </View>
      </ImageBackground>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { height: 220, marginBottom: 0 },
  map: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { resizeMode: "cover" },
  marker: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dangerFill,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  caseBadge: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  buttonWrap: { position: "absolute", right: SPACING.md, left: SPACING.md, bottom: SPACING.md },
});
