import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import Input from "@/src/components/ui/Input";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export type MapPlaceLocationValue = { latitude: number; longitude: number };
type Props = { value: MapPlaceLocationValue | null; onChange: (value: MapPlaceLocationValue) => void };

export default function MapPlaceLocationPicker({ value, onChange }: Props) {
  const [latitude, setLatitude] = useState(value ? String(value.latitude) : "");
  const [longitude, setLongitude] = useState(value ? String(value.longitude) : "");

  useEffect(() => {
    if (!value) return;
    setLatitude(String(value.latitude));
    setLongitude(String(value.longitude));
  }, [value]);

  const commit = (nextLatitude: string, nextLongitude: string) => {
    const lat = Number(nextLatitude);
    const lng = Number(nextLongitude);
    if (Number.isFinite(lat) && lat >= -90 && lat <= 90 && Number.isFinite(lng) && lng >= -180 && lng <= 180) {
      onChange({ latitude: lat, longitude: lng });
    }
  };

  return (
    <View style={styles.box}>
      <AppText weight="bold">إحداثيات الموقع</AppText>
      <AppText variant="caption" color={COLORS.textSecondary}>
        على الويب أدخل الإحداثيات يدويًا. على Android وiOS يمكنك اختيار العلامة من الخريطة.
      </AppText>
      <View style={styles.row}>
        <Input
          containerStyle={styles.field}
          label="خط العرض"
          value={latitude}
          onChangeText={(text) => { setLatitude(text); commit(text, longitude); }}
          keyboardType="decimal-pad"
          contentDirection="ltr"
          placeholder="33.5138"
        />
        <Input
          containerStyle={styles.field}
          label="خط الطول"
          value={longitude}
          onChangeText={(text) => { setLongitude(text); commit(latitude, text); }}
          keyboardType="decimal-pad"
          contentDirection="ltr"
          placeholder="36.2765"
        />
      </View>
      {!value ? <AppText variant="caption" color={COLORS.textMuted}>لم يتم تحديد موقع بعد.</AppText> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceSubtle, gap: SPACING.sm },
  row: { flexDirection: "row", direction: "rtl", gap: SPACING.sm },
  field: { flex: 1, minWidth: 0 },
});
