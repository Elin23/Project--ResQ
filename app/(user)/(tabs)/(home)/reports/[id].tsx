import { Stack } from "expo-router";

import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import ReportDetailsScreen from "@/src/features/reports/components/ReportDetailsScreen";

export default function ReportDetailsRoute() {
  return (
    <CapabilityRouteGate capability="view-personal-reports">
      <Stack.Screen options={{ headerShown: false }} />
      <ReportDetailsScreen />
    </CapabilityRouteGate>
  );
}
