import AdoptionDetailsScreen from "@/src/features/adoption/screens/AdoptionDetailsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function AdoptionDetailsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="apply-adoption">
        <AdoptionDetailsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
