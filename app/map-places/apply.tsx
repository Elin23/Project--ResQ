import MapPlaceApplicationFormScreen from "@/src/features/map-places/screens/MapPlaceApplicationFormScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";
export default function MapPlaceApplyRoute() { return <AuthenticatedRouteGate><CapabilityRouteGate capability="submit-map-place-application" fallbackHref={ROUTES.profile}><MapPlaceApplicationFormScreen /></CapabilityRouteGate></AuthenticatedRouteGate>; }
