import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import EditProfileScreen from "@/src/features/profile/screens/EditProfileScreen";

export default function EditProfileRoute() {
  return (
    <CapabilityRouteGate capability="edit-personal-account">
      <EditProfileScreen />
    </CapabilityRouteGate>
  );
}
