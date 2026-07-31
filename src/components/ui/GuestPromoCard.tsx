import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Button from "./Button";
import Card from "./Card";

const BENEFIT_ROWS = [
  ["التبني", "التطوع"],
  ["متابعة البلاغات", "التبرعات"],
];

type Props = {
  onCreateAccount: () => void;
  onLogin: () => void;
};

export default function GuestPromoCard({ onCreateAccount, onLogin }: Props) {
  return (
    <Card disabled backgroundColor={COLORS.surface} style={styles.card}>
      <AppText weight="bold" style={styles.title}>
        أنشئ حساباً للاستفادة من جميع الميزات
      </AppText>

      <View style={styles.benefitsGrid}>
        {BENEFIT_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.benefitRow}>
            {row.map((benefit) => (
              <View key={benefit} style={styles.benefitItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={17}
                  color={COLORS.bggreen}
                />

                <AppText style={styles.benefitText}>{benefit}</AppText>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Button
        title="إنشاء حساب"
        onPress={onCreateAccount}
        variant="custom"
        size="medium"
        backgroundColor={COLORS.brown}
        borderColor={COLORS.brown}
        borderWidth={1}
        textColor="#FFFFFF"
        radius={14}
        style={styles.primaryButton}
        textStyle={styles.buttonText}
      />

      <Button
        title="تسجيل الدخول"
        onPress={onLogin}
        variant="outline"
        size="medium"
        backgroundColor={COLORS.background}
        borderColor={COLORS.brown}
        borderWidth={1.5}
        textColor={COLORS.brown}
        radius={14}
        style={styles.secondaryButton}
        textStyle={styles.buttonText}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.darkgray,
  },
  title: {
    width: "100%",
    marginBottom: SPACING.md,
    fontFamily: FONTS.bold,
    fontSize: 18,
    lineHeight: 27,
    textAlign: "left",
  },
  benefitsGrid: {
    width: "100%",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  benefitRow: {
    width: "100%",
    flexDirection: "row-reverse",
    gap: SPACING.md,
  },
  benefitItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: SPACING.xs,
  },
  benefitText: {
    flexShrink: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.label,
    lineHeight: 21,
    textAlign: "right",
  },
  primaryButton: {
    marginBottom: SPACING.sm,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
  },
});
