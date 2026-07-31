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
  reportNumber: string;
  imageUrl: string;
  progress: number;
  onPress: () => void;
};

export default function ActiveReportCard({
  title,
  reportNumber,
  imageUrl,
  progress,
  onPress,
}: Props) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Card
      onPress={onPress}
      padding={SPACING.md}
      radius={RADIUS.lg}
      backgroundColor={COLORS.white}
      borderColor={COLORS.border}
      borderWidth={1}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText
              weight="bold"
              size={FONT_SIZES.title}
              numberOfLines={1}
              style={styles.title}
            >
              {title}
            </AppText>

            <Chip label="قيد الإنقاذ" color={COLORS.textgreen} soft />
          </View>

          <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
            رقم البلاغ: {reportNumber}
          </AppText>

          <View style={styles.progressHeader}>
            <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>
              مرحلة الإنقاذ
            </AppText>

            <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>
              {safeProgress}%
            </AppText>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${safeProgress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  image: {
    width: 88,
    height: 88,
    flexShrink: 0,
    borderRadius: RADIUS.md,
  },
  body: {
    flex: 1,
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
  progressHeader: {
    width: "100%",
    marginTop: SPACING.xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    overflow: "hidden",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.lightgray,
  },
  progressFill: {
    height: "100%",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textgreen,
  },
});
