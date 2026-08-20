import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import { COLORS, FONTS, RADIUS, SPACING } from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import { useResponsiveCardWidth } from "@/src/hooks/useResponsiveCardWidth";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";

type Props = {
  title: string;
  location: string;
  time: string;
  distance?: string;
  imageUrl: string;
  urgent?: boolean;
  onPress: () => void;
};

export default function NearbyReportCard({
  title,
  location,
  time,
  distance,
  imageUrl,
  urgent = false,
  onPress,
}: Props) {
  const { isNarrow, isShort } = useResponsiveLayout();
  const cardWidth = useResponsiveCardWidth({ maxWidth: 270, minWidth: 220 });

  return (
    <Card
      onPress={onPress}
      padding={0}
      radius={RADIUS.lg}
      backgroundColor={COLORS.white}
      borderColor={COLORS.border}
      borderWidth={1}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={[styles.imageContainer, (isNarrow || isShort) && styles.imageContainerCompact]}>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={styles.image}
        />

        {urgent ? (
          <View style={styles.badge}>
            <Chip label="طارئ" color={COLORS.danger} />
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText
            weight="bold"
            variant="h3"
            numberOfLines={2}
            style={styles.title}
          >
            {title}
          </AppText>

          {distance ? (
            <AppText
              weight="medium"
              variant="label"
              color={COLORS.brown}
            >
              {distance}
            </AppText>
          ) : null}
        </View>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color={COLORS.textSecondary}
          />

          <AppText
            variant="label"
            color={COLORS.textSecondary}
            numberOfLines={2}
          >
            {location}
          </AppText>
        </View>

        <AppText variant="caption" color={COLORS.textSecondary}>
          {time}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 145,
    position: "relative",
    backgroundColor: COLORS.lightgray,
  },
  imageContainerCompact: {
    height: 124,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
  },
  content: {
    width: "100%",
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  titleRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.bold,
  },
  locationRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
  },
});
