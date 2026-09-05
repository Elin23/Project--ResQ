import FavoritesScreen from "@/src/features/favorites/screens/FavoritesScreen";
import AuthenticatedRouteGate from "@/src/features/session/AuthenticatedRouteGate";

export default function FavoritesRoute() {
  return (
    <AuthenticatedRouteGate>
      <FavoritesScreen />
    </AuthenticatedRouteGate>
  );
}
