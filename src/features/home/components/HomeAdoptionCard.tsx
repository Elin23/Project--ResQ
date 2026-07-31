import { Image, StyleSheet, View } from "react-native";

import {
    COLORS,
    FONTS,
    FONT_SIZES,
    RADIUS,
    SPACING,
} from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";

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
  return (
    <Card
      disabled
      padding={SPACING.md}
      radius={RADIUS.lg}
      backgroundColor={COLORS.white}
      borderColor={COLORS.border}
      borderWidth={1}
      style={styles.card}
    >
      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.content}>
        <AppText weight="bold" style={styles.name} numberOfLines={1}>
          {name}
        </AppText>

        <AppText
          size={FONT_SIZES.label}
          color={COLORS.textSecondary}
          numberOfLines={1}
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
    width: 270,
    marginBottom: 0,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lightgray,
  },
  content: {
    width: "100%",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "flex-start",
  },
  name: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  button: {
    minHeight: 44,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
  },
});
