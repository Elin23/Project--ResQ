import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import FeedingPointSubmissionDetailsScreen from "@/src/features/feeding-points/screens/FeedingPointSubmissionDetailsScreen";

export default function FeedingPointSubmissionDetailsRoute() {
  return (
    <CapabilityRouteGate capability="view-own-submissions">
      <FeedingPointSubmissionDetailsScreen />
    </CapabilityRouteGate>
  );
}
