import { Redirect, Stack } from "expo-router";

import { useSession } from "@/src/features/session/SessionContext";
import { defaultRouteForPrincipal } from "@/src/features/session/sessionNavigation";

export default function OrganizationWorkspaceLayout() {
  const { principal, isReady } = useSession();

  if (!isReady) return null;
  if (principal.kind !== "authenticated" || principal.account.kind !== "organization" || principal.account.status !== "active") {
    return <Redirect href={defaultRouteForPrincipal(principal)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="tasks/[id]" />
    </Stack>
  );
}
