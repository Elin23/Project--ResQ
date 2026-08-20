import type { PropsWithChildren } from "react";
import { Redirect } from "expo-router";

import { ROUTES } from "@/src/navigation/routes";
import { useSession } from "@/src/features/session/SessionContext";

export default function CampaignManagerRouteGate({ children }: PropsWithChildren) {
  const { isReady, principal, can } = useSession();

  if (!isReady) return null;
  if (principal.kind !== "authenticated") {
    return <Redirect href={ROUTES.login} />;
  }
  if (
    principal.account.kind !== "organization" ||
    !can("manage-campaigns")
  ) {
    return <Redirect href={ROUTES.home} />;
  }

  return <>{children}</>;
}
