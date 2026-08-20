import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import ProfileScreen from "@/src/features/profile/screens/ProfileScreen";

export default function ProfileRoute() {
  return (
    <CapabilityRouteGate capability="view-personal-account">
      <ProfileScreen />
    </CapabilityRouteGate>
  );
}
