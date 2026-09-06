import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import RemoteImageBackground from "@/src/components/ui/RemoteImageBackground";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { onOpenMap: () => void };

export default function OrganizationMapPreview({ onOpenMap }: Props) {
  return (
    <Card padding={0} radius={RADIUS.lg} style={styles.card} onPress={onOpenMap}>
      <RemoteImageBackground
        uri="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
        style={styles.map}
        imageStyle={styles.image}
        accessibilityLabel="معاينة خريطة الجمعية"
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
            backgroundColor={COLORS.white}
            borderColor={COLORS.white}
            textColor={COLORS.text}
            icon="map-outline"
            radius={RADIUS.full}
          />
        </View>
      </RemoteImageBackground>
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
    backgroundColor: COLORS.danger,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  caseBadge: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
  },
  buttonWrap: { position: "absolute", right: SPACING.md, left: SPACING.md, bottom: SPACING.md },
});
