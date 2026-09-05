import MapView, { Marker, PROVIDER_GOOGLE, type MapPressEvent, type Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING, MAP_STYLE } from "@/src/theme";

export type AdoptionLocationValue = { latitude: number; longitude: number };

type Props = { value: AdoptionLocationValue; onChange: (value: AdoptionLocationValue) => void };

export default function AdoptionLocationPicker({ value, onChange }: Props) {
  const region: Region = { ...value, latitudeDelta: 0.012, longitudeDelta: 0.012 };
  return (
    <View style={styles.wrapper}>
      <MapView
      customMapStyle={MAP_STYLE} provider={PROVIDER_GOOGLE} style={styles.map} region={region} onPress={(event: MapPressEvent) => onChange(event.nativeEvent.coordinate)}>
        <Marker coordinate={value} draggable onDragEnd={(event) => onChange(event.nativeEvent.coordinate)} />
      </MapView>
      <View style={styles.hint} pointerEvents="none">
        <AppText variant="caption" color={COLORS.textSecondary} align="center">اضغط على الخريطة أو اسحب العلامة لتحديد الموقع الدقيق</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", borderRadius: RADIUS.lg, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceElevated },
  map: { width: "100%", height: 230 },
  hint: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
});
