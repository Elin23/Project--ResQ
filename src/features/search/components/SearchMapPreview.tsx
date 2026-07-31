import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";

type Props = {
  onOpenMap: () => void;
};

export default function SearchMapPreview({ onOpenMap }: Props) {
  return (
    <Card
      disabled
      padding={0}
      radius={RADIUS.lg}
      backgroundColor={COLORS.lightgray}
      borderColor={COLORS.border}
      borderWidth={1}
      style={styles.card}
    >
      <View style={styles.mapBackground}>
        <View style={styles.mapLineOne} />
        <View style={styles.mapLineTwo} />
        <View style={styles.mapLineThree} />

        <View style={[styles.marker, styles.firstMarker]}>
          <Ionicons name="location" size={24} color={COLORS.primary} />
        </View>

        <View style={[styles.marker, styles.secondMarker]}>
          <Ionicons name="location" size={24} color={COLORS.brown} />
        </View>

        <View style={styles.overlay}>
          <View style={styles.iconContainer}>
            <Ionicons name="map-outline" size={22} color={COLORS.primary} />
          </View>

          <AppText weight="bold" style={styles.title}>
            عرض النتائج على الخريطة
          </AppText>

          <AppText
            size={FONT_SIZES.label}
            color={COLORS.textSecondary}
            align="center"
            style={styles.subtitle}
          >
            شاهد مواقع الحيوانات والعيادات القريبة منك
          </AppText>

          <Button
            title="فتح الخريطة"
            onPress={onOpenMap}
            variant="outline"
            size="small"
            fullWidth={false}
            icon="map-outline"
            iconPosition="end"
            backgroundColor={COLORS.background}
            borderColor={COLORS.primary}
            textColor={COLORS.primary}
            radius={RADIUS.full}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 180,
    marginBottom: SPACING.xl,
  },
  mapBackground: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#E6E1D8",
  },
  mapLineOne: {
    position: "absolute",
    top: 42,
    left: -30,
    width: "120%",
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    transform: [{ rotate: "-8deg" }],
  },
  mapLineTwo: {
    position: "absolute",
    top: 105,
    left: -20,
    width: "115%",
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    transform: [{ rotate: "10deg" }],
  },
  mapLineThree: {
    position: "absolute",
    top: -20,
    left: "48%",
    width: 4,
    height: 240,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    transform: [{ rotate: "17deg" }],
  },
  marker: {
    position: "absolute",
    zIndex: 2,
  },
  firstMarker: {
    top: 30,
    right: 50,
  },
  secondMarker: {
    bottom: 25,
    left: 45,
  },
  overlay: {
    flex: 1,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.white + "99",
  },
  iconContainer: {
    width: 42,
    height: 42,
    marginBottom: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 250,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  button: {
    minHeight: 38,
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.label,
  },
});
