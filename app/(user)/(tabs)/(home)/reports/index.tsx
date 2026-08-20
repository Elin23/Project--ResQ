import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import ReportsScreen from "@/src/features/reports/screens/ReportsScreen";

export default function ReportsRoute() {
  return (
    <CapabilityRouteGate capability="view-personal-reports">
      <ReportsScreen />
    </CapabilityRouteGate>
  );
}
