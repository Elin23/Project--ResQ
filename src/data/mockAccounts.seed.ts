import type { AuthenticatedAccount } from "@/src/types/accounts";

/**
 * Local sign-in directory used while `APP_CONFIG.useMockApi` is enabled.
 * The backend replaces it: the API response provides the canonical account.
 */
export type MockAccount = AuthenticatedAccount & {
  email: string;
  password: string;
};

/**
 * `resq-syria` and `hope-animals` match the organization identifiers already
 * used by the domain seeds, so the workspace opens with its own data.
 */
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "resq-syria",
    kind: "organization",
    status: "active",
    displayName: "جمعية الرفق بالحيوان",
    email: "jamia@resq.sy",
    password: "Test@1234",
  },
  {
    id: "hope-animals",
    kind: "organization",
    status: "pending",
    displayName: "مأوى الوفاء للحيوانات",
    email: "pending@resq.sy",
    password: "Test@1234",
  },
];

export function findMockAccountByEmail(email: string): MockAccount | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return MOCK_ACCOUNTS.find((account) => account.email === normalizedEmail);
}
