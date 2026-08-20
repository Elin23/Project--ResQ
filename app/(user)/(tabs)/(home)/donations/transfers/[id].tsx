import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import DonationTransferDetailsScreen from "@/src/features/donations/screens/DonationTransferDetailsScreen";

export default function DonationTransferRoute() {
  return (
    <AuthenticatedRouteGate>
      <DonationTransferDetailsScreen />
    </AuthenticatedRouteGate>
  );
}
