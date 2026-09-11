import MapView, { Marker, PROVIDER_GOOGLE, type MapPressEvent, type Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export type MapPlaceLocationValue = { latitude: number; longitude: number };
type Props = { value: MapPlaceLocationValue | null; onChange: (value: MapPlaceLocationValue) => void };

const DEFAULT_VIEWPORT = { latitude: 33.5138, longitude: 36.2765 };

export default function MapPlaceLocationPicker({ value, onChange }: Props) {
  const center = value ?? DEFAULT_VIEWPORT;
  const region: Region = { ...center, latitudeDelta: 0.012, longitudeDelta: 0.012 };
  const onPress = (event: MapPressEvent) => onChange(event.nativeEvent.coordinate);
  return (
    <View style={styles.wrapper}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region} onPress={onPress}>
        {value ? <Marker coordinate={value} draggable onDragEnd={(event) => onChange(event.nativeEvent.coordinate)} /> : null}
      </MapView>
      <View style={styles.hint} pointerEvents="none">
        <AppText variant="caption" color={COLORS.textSecondary} align="center">
          {value ? "اسحب العلامة أو اضغط على الخريطة لتعديل الموقع" : "اضغط على الخريطة لتحديد موقع الجهة؛ مركز الخريطة الافتراضي لا يُرسل إلى الخادم"}
        </AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { width: "100%", borderRadius: RADIUS.lg, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceElevated },
  map: { width: "100%", height: 240 },
  hint: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
});
