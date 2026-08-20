import AdoptionScreen from "@/src/features/adoption/screens/AdoptionScreen";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OrganizationAdoptionRoute() {
  return (
    <CapabilityRouteGate capability="view-adoption">
      <AdoptionScreen />
    </CapabilityRouteGate>
  );
}
