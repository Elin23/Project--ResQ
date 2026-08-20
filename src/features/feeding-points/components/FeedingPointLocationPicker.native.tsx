import MapView, { Marker, type MapPressEvent, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export type FeedingPointLocationValue = {
  latitude: number;
  longitude: number;
};

type Props = {
  value: FeedingPointLocationValue;
  onChange: (value: FeedingPointLocationValue) => void;
};

export default function FeedingPointLocationPicker({ value, onChange }: Props) {
  const region: Region = {
    latitude: value.latitude,
    longitude: value.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  const handleMapPress = (event: MapPressEvent) => {
    onChange(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.wrapper}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={value}
          draggable
          onDragEnd={(event) => onChange(event.nativeEvent.coordinate)}
        />
      </MapView>
      <View style={styles.hint} pointerEvents="none">
        <AppText variant="caption" color={COLORS.textSecondary} align="center">
          اضغط على الخريطة أو اسحب العلامة لتحديد الموقع الدقيق
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  map: { width: "100%", height: 220 },
  hint: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
});
