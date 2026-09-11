import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import type { DailyOpeningHours } from "@/src/domain/service-places";
import { COLORS, SPACING } from "@/src/theme";

const DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
type Props = { value: DailyOpeningHours[]; onChange: (value: DailyOpeningHours[]) => void };

export function defaultOpeningHours(): DailyOpeningHours[] {
  return DAYS.map((day) => ({ day, open: null, close: null }));
}

export default function OpeningHoursEditor({ value, onChange }: Props) {
  // The backend contract supports one openingTime + one closingTime, not a
  // different schedule for every weekday. We mirror that honestly in the UI.
  const representative = value.find((item) => item.day === 0) ?? value[0];
  const open = representative?.open ?? "";
  const close = representative?.close ?? "";

  const apply = (nextOpen: string, nextClose: string) => {
    const normalizedOpen = nextOpen.trim() || null;
    const normalizedClose = nextClose.trim() || null;
    onChange(DAYS.map((day) => ({ day, open: normalizedOpen, close: normalizedClose })));
  };

  const clear = () => {
    onChange(defaultOpeningHours());
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        <AppText weight="bold">أوقات العمل</AppText>
        <AppText variant="caption" color={COLORS.textSecondary}>
          أدخل وقت الفتح والإغلاق بصيغة 24 ساعة. سيتم حفظهما على الخادم كوقت دوام يومي موحّد.
        </AppText>
      </View>

      <View style={styles.times}>
        <Input
          containerStyle={styles.time}
          label="من"
          value={open}
          onChangeText={(nextOpen) => apply(nextOpen, close)}
          contentDirection="ltr"
          placeholder="09:00"
          autoCapitalize="none"
        />
        <Input
          containerStyle={styles.time}
          label="إلى"
          value={close}
          onChangeText={(nextClose) => apply(open, nextClose)}
          contentDirection="ltr"
          placeholder="18:00"
          autoCapitalize="none"
        />
      </View>

      {open || close ? (
        <Button title="مسح أوقات العمل" variant="outline" size="small" onPress={clear} fullWidth={false} />
      ) : null}

      <AppText variant="caption" color={COLORS.textMuted}>
        يمكنك ترك الحقلين فارغين إذا لم تكن أوقات العمل معروفة. إذا أدخلت أحدهما فيجب إدخال الآخر أيضًا.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm },
  copy: { gap: 4 },
  times: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  time: { flex: 1, minWidth: 0 },
});
