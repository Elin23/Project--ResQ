import EditOwnedMapPlaceScreen from "@/src/features/map-places/screens/EditOwnedMapPlaceScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";
import CapabilityRouteGate from "@/src/features/session/CapabilityRouteGate";
import { ROUTES } from "@/src/navigation/routes";
export default function EditOwnedMapPlaceRoute() { return <AuthenticatedRouteGate><CapabilityRouteGate capability="edit-owned-map-place" fallbackHref={ROUTES.profile}><EditOwnedMapPlaceScreen /></CapabilityRouteGate></AuthenticatedRouteGate>; }
