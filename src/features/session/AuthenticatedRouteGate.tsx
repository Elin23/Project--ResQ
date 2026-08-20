import type { PropsWithChildren } from "react";
import { Redirect, usePathname } from "expo-router";

import { ROUTES } from "@/src/navigation/routes";
import { useSession } from "./SessionContext";

/**
 * Authentication boundary for content that may be discovered by guests but
 * requires a personal session before opening/acting. The current path is kept
 * so login can return the user to the exact item they selected.
 */
export default function AuthenticatedRouteGate({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { isReady, principal } = useSession();

  if (!isReady) return null;
  if (principal.kind !== "authenticated") {
    return <Redirect href={{ pathname: ROUTES.login, params: { returnTo: pathname } }} />;
  }

  return <>{children}</>;
}
