import type { StyleProp, ViewStyle } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

type CreateReportLocationMapProps = {
  region: Region;
  onRegionChange: (region: Region) => void;
  style?: StyleProp<ViewStyle>;
};

export default function CreateReportLocationMap({ region, onRegionChange, style }: CreateReportLocationMapProps) {
  return (
    <MapView style={style} region={region} onRegionChangeComplete={onRegionChange}>
      <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
    </MapView>
  );
}
