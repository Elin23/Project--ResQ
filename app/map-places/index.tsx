import MyMapPlacesScreen from "@/src/features/map-places/screens/MyMapPlacesScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";
export default function MyMapPlacesRoute() { return <AuthenticatedRouteGate><CapabilityRouteGate capability="view-own-map-place-applications" fallbackHref={ROUTES.profile}><MyMapPlacesScreen /></CapabilityRouteGate></AuthenticatedRouteGate>; }
