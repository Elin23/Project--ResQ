import EditMapPlaceApplicationScreen from "@/src/features/map-places/screens/EditMapPlaceApplicationScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";
export default function EditMapPlaceApplicationRoute() { return <AuthenticatedRouteGate><CapabilityRouteGate capability="submit-map-place-application" fallbackHref={ROUTES.profile}><EditMapPlaceApplicationScreen /></CapabilityRouteGate></AuthenticatedRouteGate>; }
