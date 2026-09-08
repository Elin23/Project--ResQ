import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import CreateReportScreen from "@/src/features/reports/screens/CreateReportScreen";
import { ROUTES } from "@/src/navigation/routes";

export default function CreateReportRoute() {
  return (
    <CapabilityRouteGate capability="create-report" fallbackHref={ROUTES.login}>
      <CreateReportScreen />
    </CapabilityRouteGate>
  );
}
