import type { StyleProp, ViewStyle } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import { MAP_STYLE } from "@/src/theme";

type CreateReportLocationMapProps = {
  region: Region;
  onRegionChange: (region: Region) => void;
  style?: StyleProp<ViewStyle>;
};

export default function CreateReportLocationMap({ region, onRegionChange, style }: CreateReportLocationMapProps) {
  return (
    <MapView
      customMapStyle={MAP_STYLE} style={style} region={region} onRegionChangeComplete={onRegionChange}>
      <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
    </MapView>
  );
}
