import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { SearchResult } from "@/src/types/search";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";

type Props = {
  result: SearchResult;
  onPress: () => void;
};

export default function SearchResultCard({ result, onPress }: Props) {
  const { isNarrow } = useResponsiveLayout();
  if (result.type === "clinic") {
    return (
      <Card
        onPress={onPress}
        padding={SPACING.md}
        radius={RADIUS.lg}
        backgroundColor={COLORS.background}
        borderColor={COLORS.border}
        borderWidth={1}
        style={[styles.clinicCard, isNarrow && styles.clinicCardNarrow]}
      >
        <View style={[styles.clinicIconContainer, isNarrow && styles.clinicIconContainerNarrow]}>
          <Ionicons name="medkit-outline" size={isNarrow ? 24 : 30} color={COLORS.white} />
        </View>

        <View style={styles.clinicContent}>
          <View style={styles.clinicTitleRow}>
            <AppText
              weight="bold"
              variant="h3"
              numberOfLines={2}
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
                  variant="label"
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
              variant="label"
              color={COLORS.textSecondary}
              numberOfLines={2}
            >
              {result.subtitle}
            </AppText>
          </View>

          <AppText
            variant="label"
            color={COLORS.textSecondary}
            numberOfLines={2}
            style={styles.services}
          >
            الخدمات: {result.services}
          </AppText>
        </View>

        <AppText
          weight="medium"
          variant="label"
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
      <View style={[styles.imageContainer, isNarrow && styles.imageContainerNarrow]}>
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
            <AppText variant="label" color={result.badge.textColor} weight="medium">
              {result.badge.label}
            </AppText>
          </View>
        )}
      </View>

      <View style={[styles.animalContent, isNarrow && styles.animalContentNarrow]}>
        <View style={styles.animalTextContainer}>
          <AppText weight="bold" style={styles.animalTitle} numberOfLines={2}>
            {result.title}
          </AppText>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />

            <AppText
              variant="label"
              color={COLORS.textSecondary}
              numberOfLines={2}
            >
              {result.subtitle}
            </AppText>
          </View>
        </View>

        <AppText weight="medium" color={COLORS.brown} variant="label">
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
  imageContainerNarrow: { height: 158 },
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
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  animalContentNarrow: { minHeight: 76, gap: SPACING.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm },
  animalTextContainer: {
    flex: 1,
    alignItems: "stretch",
  },
  animalTitle: {
    width: "100%",
    textAlign: "auto",
  },
  locationRow: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
  },
  clinicCard: {
    minHeight: 116,
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  clinicCardNarrow: { minHeight: 104, gap: SPACING.sm, padding: SPACING.sm },
  clinicIconContainer: {
    width: 64,
    height: 64,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
  },
  clinicIconContainerNarrow: { width: 48, height: 48 },
  clinicContent: {
    flex: 1,
    alignItems: "stretch",
  },
  clinicTitleRow: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
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
    textAlign: "auto",
  },
  clinicDistance: {
    flexShrink: 0,
    alignSelf: "flex-end",
  },
});
