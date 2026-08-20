import { Redirect, Stack } from "expo-router";

import { useSession } from "@/src/features/session/SessionContext";
import { defaultRouteForPrincipal } from "@/src/features/session/sessionNavigation";
import { ROUTES } from "@/src/navigation/routes";

export default function UserWorkspaceLayout() {
  const { principal, isReady } = useSession();

  if (!isReady) return null;
  if (principal.kind === "authenticated" && principal.account.kind === "organization" && principal.account.status !== "pending") {
    return <Redirect href={defaultRouteForPrincipal(principal)} />;
  }
  if (principal.kind === "anonymous") return <Redirect href={ROUTES.login} />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
