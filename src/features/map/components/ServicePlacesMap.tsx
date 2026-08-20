import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import type { ServicePlace, ServicePlaceType } from "@/src/domain/service-places";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

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
  other: COLORS.textSecondary,
};

function pseudoPosition(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return { left: `${10 + (hash % 78)}%` as const, top: `${16 + ((hash * 7) % 60)}%` as const };
}

export default function ServicePlacesMap({ places, selectedId, onSelectPlace, height = 420 }: ServicePlacesMapProps) {
  return (
    <View style={[styles.container, { height }]}> 
      <View style={styles.roadA} />
      <View style={styles.roadB} />
      {places.map((place) => {
        const selected = place.id === selectedId;
        return (
          <Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`جهة على الخريطة: ${place.name}`} accessibilityState={{ selected }} onPress={() => onSelectPlace(place.id)} style={[styles.pin, pseudoPosition(place.id)]} hitSlop={8}>
            <View style={[styles.dot, { backgroundColor: TYPE_COLORS[place.type] }, selected && styles.dotSelected]}>
              <Ionicons name="location" size={selected ? 18 : 15} color={COLORS.white} />
            </View>
          </Pressable>
        );
      })}
      <View style={styles.webBadge}>
        <Ionicons name="map-outline" size={14} color={COLORS.textSecondary} />
        <AppText variant="caption" color={COLORS.textSecondary}>Google Maps متاحة في تطبيق الهاتف</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", borderRadius: RADIUS.lg, backgroundColor: COLORS.disabledSurface, overflow: "hidden" },
  roadA: { position: "absolute", left: -20, right: -20, top: "38%", height: 12, backgroundColor: COLORS.white, opacity: 0.7, transform: [{ rotate: "-8deg" }] },
  roadB: { position: "absolute", top: -20, bottom: -20, left: "62%", width: 12, backgroundColor: COLORS.white, opacity: 0.6, transform: [{ rotate: "9deg" }] },
  pin: { position: "absolute" },
  dot: { width: 32, height: 32, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  dotSelected: { width: 40, height: 40, borderRadius: RADIUS.xl, borderWidth: 3 },
  webBadge: { position: "absolute", top: SPACING.sm, left: SPACING.sm, flexDirection: "row", direction: "rtl", alignItems: "center", gap: SPACING.xs, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.white + "E6" },
});
