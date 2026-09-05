import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { TYPOGRAPHY, RADIUS, COLORS, FONTS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Button from "./Button";
import ActionStack from "./ActionStack";
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

      <ActionStack>
      <Button
        title="إنشاء حساب"
        onPress={onCreateAccount}
        variant="custom"
        size="medium"
        backgroundColor={COLORS.primaryStrongFill}
        borderColor={COLORS.brown}
        borderWidth={1}
        textColor={COLORS.onColor}
        radius={14}
        
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
        
        textStyle={styles.buttonText}
      />
      </ActionStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.darkgray,
  },
  title: {
    width: "100%",
    marginBottom: SPACING.md,
    fontFamily: FONTS.bold,
    fontSize: TYPOGRAPHY.h3.fontSize,
    lineHeight: 27,
  },
  benefitsGrid: {
    width: "100%",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  benefitRow: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    gap: SPACING.md,
  },
  benefitItem: {
    flex: 1,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: SPACING.xs,
  },
  benefitText: {
    flexShrink: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.label,
    lineHeight: 21,
    textAlign: "auto",
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
  },
});
