import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
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
 * Only tab-root presses are handled here. Detail/form screens are deliberately
 * left to Expo Router / React Navigation so their stack transitions and guards
 * finish normally without competing with a second manual back action.
 */
export default function WorkspaceBackBoundary({ kind }: { kind: WorkspaceKind }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      const roots = kind === "organization" ? ORGANIZATION_TAB_ROOTS : USER_TAB_ROOTS;

      // Detail screens, forms and modals must use the navigator's native back
      // handling. Returning false avoids racing a manual router.back() against
      // React Navigation transitions / usePreventRemove dialogs.
      if (!roots.has(pathname)) return false;

      const home = kind === "organization" ? ROUTES.organizationDashboard : ROUTES.userHome;
      const isHome = pathname === "/" || pathname === "/organization";

      // Never allow the workspace root to pop back into the hidden launch/auth
      // stack. On Android the expected behavior from the app home is to leave
      // the app instead of navigating to a stale screen behind the workspace.
      if (isHome) {
        BackHandler.exitApp();
        return true;
      }

      // From another persistent tab, back means "go to workspace home".
      router.replace(home);
      return true;
    });

    return () => subscription.remove();
  }, [kind, pathname, router]);

  return null;
}
