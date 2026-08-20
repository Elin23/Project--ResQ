import type { PropsWithChildren } from "react";
import { Redirect, type Href } from "expo-router";

import { ROUTES } from "@/src/navigation/routes";
import { useSession } from "./SessionContext";
import type { AppCapability } from "./accessPolicy";

type Props = PropsWithChildren<{
  capability: AppCapability;
  fallbackHref?: Href;
}>;

/**
 * Route-level authorization boundary.
 * Navigation visibility is UX; this gate is the security/product contract for deep links.
 */
export default function CapabilityRouteGate({
  capability,
  fallbackHref = ROUTES.home,
  children,
}: Props) {
  const { isReady, can } = useSession();

  if (!isReady) return null;
  if (!can(capability)) return <Redirect href={fallbackHref} />;

  return <>{children}</>;
}
