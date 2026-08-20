import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import NotificationsScreen from "@/src/features/notifications/screens/NotificationsScreen";

export default function NotificationsRoute() {
  return (
    <CapabilityRouteGate capability="view-notifications">
      <NotificationsScreen />
    </CapabilityRouteGate>
  );
}
