import { useRouter, type Href } from "expo-router";
import { useCallback, useMemo } from "react";

import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "./routes";
import { goBackOrReplace } from "./helpers";

/** Workspace-aware back action with a deterministic fallback. */
export function useSafeBack(explicitFallback?: Href) {
  const router = useRouter();
  const { accountKind, mode } = useSession();

  const fallback = useMemo<Href>(() => {
    if (explicitFallback) return explicitFallback;
    if (accountKind === "organization") return ROUTES.organizationDashboard;
    if (mode === "member" || mode === "guest") return ROUTES.userHome;
    return ROUTES.welcome;
  }, [accountKind, explicitFallback, mode]);

  return useCallback(() => {
    goBackOrReplace(router, fallback);
  }, [fallback, router]);
}
