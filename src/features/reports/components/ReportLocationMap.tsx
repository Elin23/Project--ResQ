import type { StyleProp, ViewStyle } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { MAP_STYLE } from "@/src/theme";

type ReportLocationMapProps = {
  latitude: number;
  longitude: number;
  style?: StyleProp<ViewStyle>;
};

export default function ReportLocationMap({ latitude, longitude, style }: ReportLocationMapProps) {
  return (
    <MapView
      customMapStyle={MAP_STYLE}
      style={style}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      <Marker coordinate={{ latitude, longitude }} />
    </MapView>
  );
}
