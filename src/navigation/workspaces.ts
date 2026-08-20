import type { AccountKind } from "@/src/types/accounts";
import { ROUTES } from "./routes";

export type WorkspaceTab = { key: string; label: string; icon: string; route: string };

export const USER_WORKSPACE_TABS: readonly WorkspaceTab[] = [
  { key: "home", label: "الرئيسية", icon: "home-outline", route: ROUTES.userHome },
  { key: "explore", label: "استكشاف", icon: "compass-outline", route: ROUTES.adoption },
  { key: "map", label: "الخريطة", icon: "map-outline", route: ROUTES.map },
  { key: "notifications", label: "التنبيهات", icon: "notifications-outline", route: ROUTES.notifications },
  { key: "profile", label: "حسابي", icon: "person-outline", route: ROUTES.profile },
];

export const ORGANIZATION_WORKSPACE_TABS: readonly WorkspaceTab[] = [
  { key: "home", label: "الرئيسية", icon: "home-outline", route: ROUTES.organizationDashboard },
  { key: "tasks", label: "المهام", icon: "clipboard-outline", route: ROUTES.organizationTasks },
  { key: "map", label: "الخريطة", icon: "map-outline", route: ROUTES.organizationMap },
  { key: "notifications", label: "التنبيهات", icon: "notifications-outline", route: ROUTES.organizationNotifications },
  { key: "profile", label: "حسابي", icon: "person-outline", route: ROUTES.organizationProfile },
];

export function workspaceTabsForAccount(accountKind: AccountKind) {
  return accountKind === "organization" ? ORGANIZATION_WORKSPACE_TABS : USER_WORKSPACE_TABS;
}
