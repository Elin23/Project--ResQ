import CreateAdoptionListingScreen from "@/src/features/adoption/screens/CreateAdoptionListingScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";

export default function CreateAdoptionListingRoute() {
  return <AuthenticatedRouteGate><CapabilityRouteGate capability="create-adoption-listing" fallbackHref={ROUTES.adoptionList}><CreateAdoptionListingScreen /></CapabilityRouteGate></AuthenticatedRouteGate>;
}
