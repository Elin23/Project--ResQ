import type { Href, Router } from "expo-router";

import { ROUTES } from "./routes";

/** Navigate back when possible, otherwise replace with a safe fallback route. */
export function goBackOrReplace(
  router: Router,
  fallback: Href = ROUTES.welcome,
) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallback);
}
