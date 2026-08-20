import MyAdoptionListingDetailsScreen from "@/src/features/adoption/screens/MyAdoptionListingDetailsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";

export default function MyAdoptionListingDetailsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="view-own-submissions" fallbackHref={ROUTES.adoptionList}>
        <MyAdoptionListingDetailsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
