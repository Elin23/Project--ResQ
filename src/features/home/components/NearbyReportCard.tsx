import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import {
    COLORS,
    FONTS,
    FONT_SIZES,
    RADIUS,
    SPACING,
} from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";

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
  return (
    <Card
      onPress={onPress}
      padding={0}
      radius={RADIUS.lg}
      backgroundColor={COLORS.white}
      borderColor={COLORS.border}
      borderWidth={1}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
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
            size={FONT_SIZES.title}
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </AppText>

          {distance ? (
            <AppText
              weight="medium"
              size={FONT_SIZES.label}
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
            size={FONT_SIZES.label}
            color={COLORS.textSecondary}
            numberOfLines={1}
          >
            {location}
          </AppText>
        </View>

        <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>
          {time}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 145,
    position: "relative",
    backgroundColor: COLORS.lightgray,
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
    alignItems: "center",
    gap: SPACING.xs,
  },
});
