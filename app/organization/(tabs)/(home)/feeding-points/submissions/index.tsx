import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import FeedingPointSubmissionsScreen from "@/src/features/feeding-points/screens/FeedingPointSubmissionsScreen";

export default function OrganizationFeedingPointSubmissionsRoute() {
  return (
    <CapabilityRouteGate capability="view-own-submissions">
      <FeedingPointSubmissionsScreen />
    </CapabilityRouteGate>
  );
}
