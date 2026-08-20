import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  rating: number;
  ratingsCount?: number;
  size?: number;
  color?: string;
  showValue?: boolean;
};

export default function RatingStars({
  rating,
  ratingsCount,
  size = 16,
  color = COLORS.rating,
  showValue = true,
}: Props) {
  const clamped = Math.max(0, Math.min(5, rating));
  const stars = Array.from({ length: 5 }, (_, index) => {
    const remainder = clamped - index;
    if (remainder >= 1) return "star";
    if (remainder >= 0.5) return "star-half";
    return "star-outline";
  });

  return (
    <View style={styles.row}>
      <View style={styles.stars}>
        {stars.map((name, index) => (
          <Ionicons key={index} name={name} size={size} color={color} />
        ))}
      </View>

      {showValue && (
        <AppText weight="medium" size={FONT_SIZES.label} color={COLORS.text}>
          {clamped.toFixed(1)}
          {ratingsCount != null ? ` (${ratingsCount})` : ""}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", direction: "ltr",
    alignItems: "center",
    gap: SPACING.xs,
  },
  stars: {
    flexDirection: "row", direction: "ltr",
    gap: 2,
  },
});
