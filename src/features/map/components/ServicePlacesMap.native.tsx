import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import type { ServicePlace, ServicePlaceType } from "@/src/domain/service-places";
import { COLORS, RADIUS } from "@/src/theme";

export type ServicePlacesMapProps = {
  places: ServicePlace[];
  selectedId: string | null;
  onSelectPlace: (id: string) => void;
  userCoordinate?: { latitude: number; longitude: number } | null;
  height?: number;
};

const TYPE_COLORS: Record<ServicePlaceType, string> = {
  clinic: COLORS.info,
  organization: COLORS.secondaryStrong,
  shelter: COLORS.primary,
  pet_store: COLORS.warning,
  pet_hotel: COLORS.info,
  cat_cafe: COLORS.secondary,
  grooming: COLORS.primary,
  animal_pharmacy: COLORS.info,
  feeding_point: COLORS.warning,
  other: COLORS.textSecondary,
};

const TYPE_ICONS: Record<ServicePlaceType, keyof typeof Ionicons.glyphMap> = {
  clinic: "medical",
  organization: "people",
  shelter: "home",
  pet_store: "bag-handle",
  pet_hotel: "bed",
  cat_cafe: "cafe",
  grooming: "cut",
  animal_pharmacy: "medical",
  feeding_point: "restaurant",
  other: "location",
};

export default function ServicePlacesMap({
  places,
  selectedId,
  onSelectPlace,
  userCoordinate,
  height = 420,
}: ServicePlacesMapProps) {
  const mapRef = useRef<MapView>(null);
  const initialRegion = useMemo<Region>(() => {
    const first = userCoordinate ?? places[0] ?? { latitude: 33.5138, longitude: 36.2765 };
    return {
      latitude: first.latitude,
      longitude: first.longitude,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    };
  }, [places, userCoordinate]);

  useEffect(() => {
    if (!userCoordinate) return;
    mapRef.current?.animateToRegion({
      latitude: userCoordinate.latitude,
      longitude: userCoordinate.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 350);
  }, [userCoordinate]);

  useEffect(() => {
    if (userCoordinate || places.length === 0) return;
    const coordinates = places
      .filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude))
      .map((place) => ({ latitude: place.latitude, longitude: place.longitude }));
    if (!coordinates.length) return;
    const timer = setTimeout(() => {
      if (coordinates.length === 1) {
        mapRef.current?.animateToRegion({ ...coordinates[0], latitudeDelta: 0.05, longitudeDelta: 0.05 }, 250);
      } else {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 60, right: 45, bottom: 60, left: 45 },
          animated: true,
        });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [places, userCoordinate]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, { height }]}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
      accessibilityLabel="خريطة الخدمات البيطرية والحيوانية"
    >
      {places.map((place) => {
        const selected = place.id === selectedId;
        return (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.address}
            onPress={() => onSelectPlace(place.id)}
          >
            <View style={[styles.marker, { backgroundColor: TYPE_COLORS[place.type] }, selected && styles.markerSelected]}>
              <Ionicons name={TYPE_ICONS[place.type]} size={selected ? 18 : 16} color={COLORS.white} />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", borderRadius: RADIUS.lg },
  marker: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  markerSelected: { width: 42, height: 42, borderRadius: RADIUS.xl, borderWidth: 3 },
});
