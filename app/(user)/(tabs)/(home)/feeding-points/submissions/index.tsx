import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import FeedingPointSubmissionsScreen from "@/src/features/feeding-points/screens/FeedingPointSubmissionsScreen";

export default function FeedingPointSubmissionsRoute() {
  return (
    <CapabilityRouteGate capability="view-own-submissions">
      <FeedingPointSubmissionsScreen />
    </CapabilityRouteGate>
  );
}
