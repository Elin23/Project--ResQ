import { StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";

type Props = {
  onReportPress: () => void;
};

export default function ReportCallout({ onReportPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <AppText weight="bold" style={styles.title}>
          هل شاهدت حيواناً بحاجة للمساعدة؟
        </AppText>

        <AppText style={styles.subtitle}>
          يمكنك إرسال بلاغ طارئ خلال دقائق ومساعدتنا في الوصول إليه بسرعة.
        </AppText>
      </View>

      <Button
        title="إرسال بلاغ"
        onPress={onReportPress}
        variant="custom"
        size="medium"
        icon="paper-plane-outline"
        iconPosition="end"
        iconSize={18}
        fullWidth={false}
        backgroundColor={COLORS.brown}
        borderColor={COLORS.brown}
        borderWidth={1}
        textColor={COLORS.white}
        radius={RADIUS.full}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 178,
    alignItems: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  iconContainer: {
    width: 42,
    height: 42,
    marginBottom: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: COLORS.white + "1F",
  },
  content: {
    width: "100%",
    marginBottom: SPACING.lg,
  },
  title: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    lineHeight: 28,
    color: COLORS.white,
    textAlign: "left",
  },
  subtitle: {
    width: "100%",
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    lineHeight: 22,
    color: COLORS.white + "D9",
    textAlign: "left",
  },
  button: {
    alignSelf: "flex-start",
    minWidth: 132,
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
  },
});
