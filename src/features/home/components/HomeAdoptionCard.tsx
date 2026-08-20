import { Image, StyleSheet, View } from "react-native";

import {
    COLORS,
    FONTS,
    RADIUS,
    SPACING,
} from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import { useResponsiveCardWidth } from "@/src/hooks/useResponsiveCardWidth";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { useResponsiveLayout } from "@/src/components/ui/useResponsiveLayout";

type Props = {
  name: string;
  details: string;
  imageUrl: string;
  onPress: () => void;
};

export default function HomeAdoptionCard({
  name,
  details,
  imageUrl,
  onPress,
}: Props) {
  const { isNarrow, isShort } = useResponsiveLayout();
  const cardWidth = useResponsiveCardWidth({ maxWidth: 286, minWidth: 228 });

  return (
    <Card
      disabled
      padding={SPACING.md}
      radius={RADIUS.lg}
      backgroundColor={COLORS.white}
      borderColor={COLORS.border}
      borderWidth={1}
      style={[styles.card, { width: cardWidth }]}
    >
      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={[styles.image, (isNarrow || isShort) && styles.imageCompact]}
      />

      <View style={styles.content}>
        <AppText weight="bold" style={styles.name} numberOfLines={2}>
          {name}
        </AppText>

        <AppText
          variant="label"
          color={COLORS.textSecondary}
          numberOfLines={2}
        >
          {details}
        </AppText>
      </View>

      <Button
        title="عرض التفاصيل"
        onPress={onPress}
        size="small"
        radius={RADIUS.md}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lightgray,
  },
  imageCompact: {
    height: 148,
  },
  content: {
    width: "100%",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "stretch",
  },
  name: {
    width: "100%",
    fontFamily: FONTS.bold,
  },
  button: {
    minHeight: 44,
  },
  buttonText: {
    fontFamily: FONTS.medium,
  },
});
