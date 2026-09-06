import SecurityPrivacyScreen from "@/src/features/profile/screens/SecurityPrivacyScreen";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";

export default function SecurityPrivacyRoute() {
  return (
    <CapabilityRouteGate capability="edit-personal-account">
      <SecurityPrivacyScreen variant="user" />
    </CapabilityRouteGate>
  );
}
