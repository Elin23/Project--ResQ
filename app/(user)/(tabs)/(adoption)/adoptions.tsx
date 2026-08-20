import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import AdoptionScreen from "@/src/features/adoption/screens/AdoptionScreen";

export default function AdoptionRoute() {
  return (
    <CapabilityRouteGate capability="view-adoption">
      <AdoptionScreen />
    </CapabilityRouteGate>
  );
}
