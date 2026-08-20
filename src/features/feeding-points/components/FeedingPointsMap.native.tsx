import MapView, { Marker } from "react-native-maps";

import { COLORS, RADIUS } from "@/src/theme";
import { MARKER_COLORS } from "../constants";
import type { FeedingPointSummary } from "../types";
import { getDisplayStatus } from "../utils/status";

export type FeedingPointsMapProps = {
  points: FeedingPointSummary[];
  selectedId: string | null;
  onSelectPoint: (id: string) => void;
  height?: number;
};

export default function FeedingPointsMap({
  points,
  selectedId,
  onSelectPoint,
  height = 200,
}: FeedingPointsMapProps) {
  const first = points[0]?.coordinate ?? { latitude: 33.5138, longitude: 36.2765 };

  return (
    <MapView
      style={{ width: "100%", height, borderRadius: RADIUS.lg }}
      initialRegion={{
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
      showsUserLocation
      showsMyLocationButton
      accessibilityLabel="خريطة نقاط الإطعام"
    >
      {points.map((point) => {
        const display = getDisplayStatus(point.status, point.lastStatusUpdateAt);
        return (
          <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.name}
            description={point.address}
            pinColor={selectedId === point.id ? COLORS.primary : MARKER_COLORS[display]}
            onPress={() => onSelectPoint(point.id)}
          />
        );
      })}
    </MapView>
  );
}
