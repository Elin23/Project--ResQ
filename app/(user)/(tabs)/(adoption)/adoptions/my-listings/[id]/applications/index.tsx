import AdoptionListingApplicationsScreen from "@/src/features/adoption/screens/AdoptionListingApplicationsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OwnerAdoptionRequestsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="manage-adoption-requests">
        <AdoptionListingApplicationsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
