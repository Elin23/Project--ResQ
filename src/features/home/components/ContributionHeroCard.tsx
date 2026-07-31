import { StyleSheet, View } from "react-native";

import {
    COLORS,
    FONTS,
    FONT_SIZES,
    RADIUS,
    SPACING,
} from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";

export default function ContributionHeroCard() {
  return (
    <Card
      disabled
      padding={SPACING.lg}
      radius={RADIUS.xl}
      backgroundColor={COLORS.primary}
      style={styles.card}
    >
      <View style={styles.content}>
        <AppText weight="bold" style={styles.title}>
          شكرًا لمساهمتك في حماية الحيوانات
        </AppText>

        <AppText style={styles.subtitle}>
          كل بلاغ ترسله قد ينقذ حياة ويصنع فرقًا حقيقيًا.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    marginBottom: 0,
    justifyContent: "center",
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
  },
  title: {
    width: "100%",
    maxWidth: 310,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.headline,
    lineHeight: 34,
    color: COLORS.text,
  },
  subtitle: {
    width: "100%",
    marginTop: SPACING.sm,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    lineHeight: 23,
    color: COLORS.text,
  },
});
