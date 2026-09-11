import { API_ENDPOINTS } from "./endpoints";
import { apiRequest } from "./client";

export type AuthAccountDto = {
  id: string;
  email?: string | null;
  phone?: string | null;
  accountType?: string | null;
  accountStatus?: string | null;
  displayName?: string | null;
  organizationId?: number | null;
  normalUserId?: number | null;
  phoneVerified?: boolean;
};

export type AuthResponse = {
  accessToken?: string | null;
  accessTokenExpiresAt?: string;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: string;
  account: AuthAccountDto;
};

export type RegisterUserRequest = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  birthDate?: string;
  governorateId?: number;
  regionId?: number;
  areaId?: number;
};

export type RegisterOrganizationRequest = {
  organizationName: string;
  email: string;
  phone: string;
  password: string;
  description?: string;
  licenseNumber?: string;
  registrationNumber?: string;
  governorateId: number;
  address: string;
  latitude: number;
  longitude: number;
  regionId?: number;
  areaId?: number;
};

const jsonPost = <T>(path: string, body: unknown, skipAuth = false) =>
  apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth,
  });

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      skipAuth: true,
      // Shared hosting can cold-start. Login is idempotent and deserves a wider
      // timeout than ordinary reads so the UI does not abort a valid request early.
      timeout: 90_000,
    });
  },
  registerUser(input: RegisterUserRequest) {
    return jsonPost<AuthResponse>(API_ENDPOINTS.auth.registerUser, input, true);
  },
  registerOrganization(input: RegisterOrganizationRequest) {
    return jsonPost<AuthResponse>(API_ENDPOINTS.auth.registerOrganization, input, true);
  },
  sendPhoneVerification() {
    return jsonPost<void>(API_ENDPOINTS.auth.sendPhoneVerification, {});
  },
  verifyPhone(code: string) {
    return jsonPost<AuthResponse>(API_ENDPOINTS.auth.verifyPhone, { code });
  },
  sendPasswordResetCode(phone: string) {
    return jsonPost<void>(API_ENDPOINTS.auth.sendPasswordReset, { phone }, true);
  },
  verifyPasswordResetCode(phone: string, code: string) {
    return jsonPost<{ resetToken: string }>(API_ENDPOINTS.auth.verifyPasswordReset, { phone, code }, true);
  },
  completePasswordReset(phone: string, resetToken: string, newPassword: string) {
    return jsonPost<void>(API_ENDPOINTS.auth.completePasswordReset, { phone, resetToken, newPassword }, true);
  },
  refresh(refreshToken: string) {
    return jsonPost<AuthResponse>(API_ENDPOINTS.auth.refresh, { refreshToken }, true);
  },
  logout(refreshToken: string) {
    return jsonPost<void>(API_ENDPOINTS.auth.logout, { refreshToken }, true);
  },
  logoutAll() {
    return jsonPost<void>(API_ENDPOINTS.auth.logoutAll, {});
  },
};
