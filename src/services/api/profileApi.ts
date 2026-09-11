import { apiRequest } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { resolveOptionalMediaUrl } from "./mediaUrl";

export type MyProfileDto = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  phoneVerified: boolean;
  birthDate?: string | null;
  governorateId?: number | null;
  governorateName?: string | null;
  regionId?: number | null;
  regionName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type UpdateMyProfileRequest = {
  fullName: string;
  phone?: string | null;
  birthDate?: string | null;
  governorateId?: number | null;
  regionId?: number | null;
  bio?: string | null;
  avatarMediaId?: number | null;
};

const normalize = (profile: MyProfileDto): MyProfileDto => ({
  ...profile,
  avatarUrl: resolveOptionalMediaUrl(profile.avatarUrl),
});

export const profileApi = {
  async getMine() {
    return normalize(await apiRequest<MyProfileDto>(API_ENDPOINTS.profile.me));
  },
  async updateMine(input: UpdateMyProfileRequest) {
    return normalize(await apiRequest<MyProfileDto>(API_ENDPOINTS.profile.me, {
      method: "PUT",
      body: JSON.stringify(input),
    }));
  },
  changePassword(currentPassword: string, newPassword: string) {
    return apiRequest<void>(API_ENDPOINTS.profile.changePassword, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  deactivateMine() {
    return apiRequest<void>(API_ENDPOINTS.profile.me, { method: "DELETE" });
  },
};
