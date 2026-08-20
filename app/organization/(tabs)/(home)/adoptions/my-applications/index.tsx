import MyAdoptionApplicationsScreen from "@/src/features/adoption/screens/MyAdoptionApplicationsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OrganizationMyAdoptionApplicationsRoute() {
  return (
    <AuthenticatedRouteGate>
      <CapabilityRouteGate capability="apply-adoption">
        <MyAdoptionApplicationsScreen />
      </CapabilityRouteGate>
    </AuthenticatedRouteGate>
  );
}
