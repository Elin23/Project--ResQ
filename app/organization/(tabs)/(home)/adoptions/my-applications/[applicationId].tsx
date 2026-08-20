import AdoptionApplicationStatusScreen from "@/src/features/adoption/screens/AdoptionApplicationStatusScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OrganizationAdoptionApplicationStatusRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="apply-adoption">
        <AdoptionApplicationStatusScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
