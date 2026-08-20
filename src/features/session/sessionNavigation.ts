import type { Href } from "expo-router";

import type { SessionPrincipal } from "@/src/types/accounts";
import { ROUTES } from "@/src/navigation/routes";

export function defaultRouteForPrincipal(principal: SessionPrincipal): Href {
  if (principal.kind === "anonymous") return ROUTES.login;
  if (principal.kind === "guest") return ROUTES.userHome;

  if (principal.account.kind === "organization") {
    return principal.account.status === "active"
      ? ROUTES.organizationDashboard
      : ROUTES.registrationPending;
  }

  return ROUTES.userHome;
}
