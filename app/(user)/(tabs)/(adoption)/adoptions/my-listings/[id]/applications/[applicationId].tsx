import OwnerAdoptionApplicationDetailsScreen from "@/src/features/adoption/screens/OwnerAdoptionApplicationDetailsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OwnerAdoptionRequestsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="manage-adoption-requests">
        <OwnerAdoptionApplicationDetailsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
