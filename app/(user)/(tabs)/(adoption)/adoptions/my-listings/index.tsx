import MyAdoptionListingsScreen from "@/src/features/adoption/screens/MyAdoptionListingsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";

export default function MyAdoptionListingsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="view-own-submissions" fallbackHref={ROUTES.adoptionList}>
        <MyAdoptionListingsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
