import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import CreateFeedingPointScreen from "@/src/features/feeding-points/screens/CreateFeedingPointScreen";
import { ROUTES } from "@/src/navigation/routes";

export default function CreateFeedingPointRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="create-feeding-point" fallbackHref={ROUTES.root}>
        <CreateFeedingPointScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
