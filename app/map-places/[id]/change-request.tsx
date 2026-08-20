import MapPlaceChangeRequestScreen from '@/src/features/map-places/screens/MapPlaceChangeRequestScreen';
import AuthenticatedRouteGate from '@/src/features/session/AuthenticatedRouteGate';
import CapabilityRouteGate from '@/src/features/session/CapabilityRouteGate';
import { ROUTES } from '@/src/navigation/routes';
export default function MapPlaceChangeRequestRoute(){return <AuthenticatedRouteGate><CapabilityRouteGate capability="edit-owned-map-place" fallbackHref={ROUTES.profile}><MapPlaceChangeRequestScreen/></CapabilityRouteGate></AuthenticatedRouteGate>;}
