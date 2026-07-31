import type { Router } from "expo-router";

import { ROUTES, type AppRoute } from "./routes";

/** Navigate back when possible, otherwise replace with a safe fallback route. */
export function goBackOrReplace(
  router: Router,
  fallback: AppRoute = ROUTES.welcome,
) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallback);
}
