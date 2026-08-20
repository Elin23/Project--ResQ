import MapPlaceApplicationDetailsScreen from "@/src/features/map-places/screens/MapPlaceApplicationDetailsScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";
export default function MapPlaceApplicationDetailsRoute() { return <AuthenticatedRouteGate><CapabilityRouteGate capability="view-own-map-place-applications" fallbackHref={ROUTES.profile}><MapPlaceApplicationDetailsScreen /></CapabilityRouteGate></AuthenticatedRouteGate>; }
