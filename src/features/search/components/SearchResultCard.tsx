import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { SearchResult } from "@/src/types/search";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";

type Props = {
  result: SearchResult;
  onPress: () => void;
};

export default function SearchResultCard({ result, onPress }: Props) {
  if (result.type === "clinic") {
    return (
      <Card
        onPress={onPress}
        padding={SPACING.md}
        radius={RADIUS.lg}
        backgroundColor={COLORS.background}
        borderColor={COLORS.border}
        borderWidth={1}
        style={styles.clinicCard}
      >
        <View style={styles.clinicIconContainer}>
          <Ionicons name="medkit-outline" size={30} color={COLORS.white} />
        </View>

        <View style={styles.clinicContent}>
          <View style={styles.clinicTitleRow}>
            <AppText
              weight="bold"
              size={FONT_SIZES.title}
              numberOfLines={1}
              style={styles.clinicTitle}
            >
              {result.title}
            </AppText>

            {result.status && (
              <View
                style={[
                  styles.smallBadge,
                  {
                    backgroundColor: result.status.backgroundColor,
                  },
                ]}
              >
                <AppText
                  size={12}
                  color={result.status.textColor}
                  weight="medium"
                >
                  {result.status.label}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />

            <AppText
              size={FONT_SIZES.label}
              color={COLORS.textSecondary}
              numberOfLines={1}
            >
              {result.subtitle}
            </AppText>
          </View>

          <AppText
            size={12}
            color={COLORS.textSecondary}
            numberOfLines={1}
            style={styles.services}
          >
            الخدمات: {result.services}
          </AppText>
        </View>

        <AppText
          weight="medium"
          size={FONT_SIZES.label}
          color={COLORS.brown}
          style={styles.clinicDistance}
        >
          {result.distance}
        </AppText>
      </Card>
    );
  }

  return (
    <Card
      onPress={onPress}
      padding={0}
      radius={RADIUS.lg}
      backgroundColor={COLORS.background}
      borderColor={COLORS.border}
      borderWidth={1}
      style={styles.animalCard}
    >
      <View style={styles.imageContainer}>
        <Image source={result.image} resizeMode="cover" style={styles.image} />

        {result.badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: result.badge.backgroundColor,
              },
            ]}
          >
            <AppText size={12} color={result.badge.textColor} weight="medium">
              {result.badge.label}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.animalContent}>
        <View style={styles.animalTextContainer}>
          <AppText weight="bold" style={styles.animalTitle} numberOfLines={1}>
            {result.title}
          </AppText>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />

            <AppText
              size={FONT_SIZES.label}
              color={COLORS.textSecondary}
              numberOfLines={1}
            >
              {result.subtitle}
            </AppText>
          </View>
        </View>

        <AppText weight="medium" color={COLORS.brown} size={FONT_SIZES.label}>
          {result.distance}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  animalCard: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  imageContainer: {
    width: "100%",
    height: 190,
    position: "relative",
    backgroundColor: COLORS.lightgray,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  animalContent: {
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  animalTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  animalTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 22,
    lineHeight: 30,
    textAlign: "left",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  clinicCard: {
    minHeight: 116,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  clinicIconContainer: {
    width: 64,
    height: 64,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: "#2EB5EA",
  },
  clinicContent: {
    flex: 1,
    alignItems: "flex-start",
  },
  clinicTitleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  clinicTitle: {
    flex: 1,
  },
  smallBadge: {
    flexShrink: 0,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  services: {
    width: "100%",
    marginTop: SPACING.xs,
    textAlign: "left",
  },
  clinicDistance: {
    flexShrink: 0,
    alignSelf: "flex-end",
  },
});
