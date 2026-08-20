import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import ExploreScreen from "@/src/features/explore/screens/ExploreScreen";

export default function ExploreRoute() {
  return (
    <CapabilityRouteGate capability="view-adoption">
      <ExploreScreen />
    </CapabilityRouteGate>
  );
}
