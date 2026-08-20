import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import MyDonationsScreen from "@/src/features/donations/screens/MyDonationsScreen";

export default function MyDonationsRoute() {
  return (
    <AuthenticatedRouteGate>
      <MyDonationsScreen />
    </AuthenticatedRouteGate>
  );
}
