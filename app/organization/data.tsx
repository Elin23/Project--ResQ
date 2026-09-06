import OrganizationDataScreen from "@/src/features/organization-dashboard/screens/OrganizationDataScreen";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function OrganizationDataRoute() {
  return (
    <CapabilityRouteGate capability="manage-organization-profile">
      <OrganizationDataScreen />
    </CapabilityRouteGate>
  );
}
