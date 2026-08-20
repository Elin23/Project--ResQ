import AdoptionApplicationScreen from "@/src/features/adoption/screens/AdoptionApplicationScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";

export default function AdoptionApplyRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="apply-adoption" fallbackHref={ROUTES.adoptionList}>
        <AdoptionApplicationScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
