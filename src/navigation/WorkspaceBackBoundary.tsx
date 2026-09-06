import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";

import { ROUTES } from "./routes";

type WorkspaceKind = "user" | "organization";

const USER_TAB_ROOTS = new Set(["/", "/adoption", "/adoptions", "/map", "/notifications", "/profile"]);
const ORGANIZATION_TAB_ROOTS = new Set([
  "/organization",
  "/organization/adoptions",
  "/organization/tasks",
  "/organization/map",
  "/organization/notifications",
  "/organization/profile",
]);

/**
 * Android hardware-back boundary for the persistent workspaces.
 *
 * Detail screens keep the navigator's normal history. At a tab root, repeated
 * hardware-back presses are consumed so they cannot fall through into stale
 * auth/onboarding history. A short lock also prevents several physical back
 * events from racing while a tab-root replacement is still committing.
 */
export default function WorkspaceBackBoundary({ kind }: { kind: WorkspaceKind }) {
  const router = useRouter();
  const pathname = usePathname();
  const transitionLockedRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    transitionLockedRef.current = false;
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      const roots = kind === "organization" ? ORGANIZATION_TAB_ROOTS : USER_TAB_ROOTS;
      if (transitionLockedRef.current) return true;

      const home = kind === "organization" ? ROUTES.organizationDashboard : ROUTES.userHome;
      const isHome = pathname === "/" || pathname === "/organization";

      // Tab roots never fall through to stale auth/onboarding history.
      if (roots.has(pathname)) {
        if (!isHome) {
          transitionLockedRef.current = true;
          router.replace(home);
          unlockTimerRef.current = setTimeout(() => {
            transitionLockedRef.current = false;
            unlockTimerRef.current = null;
          }, 500);
        }
        return true;
      }

      // Detail screens also consume the physical event so a burst of Android
      // back presses cannot enqueue several navigation removals at once.
      transitionLockedRef.current = true;
      if (router.canGoBack()) router.back();
      else router.replace(home);
      unlockTimerRef.current = setTimeout(() => {
        transitionLockedRef.current = false;
        unlockTimerRef.current = null;
      }, 500);
      return true;
    });

    return () => {
      subscription.remove();
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    };
  }, [kind, pathname, router]);

  return null;
}
