/** Authentication roles supported by the current product model. */
export type AccountType = "user" | "entity";
export type EntityType = "clinic" | "organization";
export type AccountStatus = "active" | "pending" | "rejected";

/**
 * Volunteering is intentionally not an account type. A normal user can submit
 * a volunteer application to an organization and keep the same user account.
 */
export interface VolunteerApplication {
  id: string;
  userId: string;
  organizationId: string;
  motivation?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
