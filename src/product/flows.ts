export type ProductFlowStep = {
  id: string;
  route: string;
  outcome: string;
};

export type ProductFlow = {
  id: string;
  title: string;
  owner: "public" | "user" | "organization" | "shared";
  steps: readonly ProductFlowStep[];
};

export const PRODUCT_FLOWS: readonly ProductFlow[] = [
  {
    id: "user-registration",
    title: "Personal account registration",
    owner: "user",
    steps: [
      { id: "choose", route: "/choose-account", outcome: "Personal account selected" },
      { id: "register", route: "/register-user", outcome: "User details captured" },
      { id: "verify", route: "/verify-registration-phone", outcome: "Phone verified" },
      { id: "success", route: "/registration-success", outcome: "Account activated" },
      { id: "home", route: "/(user)/(tabs)", outcome: "User enters personal workspace" },
    ],
  },
  {
    id: "entity-registration",
    title: "Organization registration",
    owner: "shared",
    steps: [
      { id: "choose", route: "/choose-account", outcome: "Entity type selected" },
      { id: "register", route: "/register-entity", outcome: "Entity application submitted" },
      { id: "verify", route: "/verify-registration-phone", outcome: "Phone verified" },
      { id: "pending", route: "/registration-pending", outcome: "Review state explained without workspace leakage" },
      { id: "approved", route: "/organization", outcome: "Approved organization enters its workspace" },
    ],
  },
  {
    id: "rescue-report",
    title: "Create and follow a rescue report",
    owner: "shared",
    steps: [
      { id: "create", route: "/reports/create", outcome: "Incident information captured" },
      { id: "confirmation", route: "/reports/success", outcome: "Submission confirmed" },
      { id: "details", route: "/reports/[id]", outcome: "Reporter follows report status" },
    ],
  },
  {
    id: "organization-triage",
    title: "Organization triage to rescue task",
    owner: "organization",
    steps: [
      { id: "queue", route: "/organization/reports", outcome: "Incoming reports reviewed" },
      { id: "triage", route: "/organization/reports/[id]", outcome: "Report assessed" },
      { id: "assignment", route: "/organization/tasks", outcome: "Accepted report becomes operational task" },
      { id: "execution", route: "/organization/tasks/[id]", outcome: "Rescue progress updated" },
      { id: "completed", route: "/organization/tasks/[id]/completed", outcome: "Task closure recorded" },
    ],
  },
] as const;
