/**
 * Central API route catalog. The paths are intentionally isolated here so the
 * backend team can align them with the final ASP.NET Core contract without
 * touching screen code.
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  reports: {
    list: "/api/reports",
    byId: (id: string) => `/api/reports/${encodeURIComponent(id)}`,
    mine: "/api/reports/mine",
  },
  adoption: {
    listings: "/api/adoption/listings",
    byId: (id: string) => `/api/adoption/listings/${encodeURIComponent(id)}`,
    applications: "/api/adoption/applications",
  },
  feedingPoints: {
    list: "/api/feeding-points",
    submissions: "/api/feeding-points/submissions",
  },
  servicePlaces: {
    list: "/api/service-places",
    applications: "/api/service-places/applications",
  },
  donations: {
    campaigns: "/api/donation-campaigns",
    byId: (id: string) => `/api/donation-campaigns/${encodeURIComponent(id)}`,
  },
  notifications: {
    list: "/api/notifications",
    devices: "/api/notifications/devices",
  },
  content: {
    articles: "/api/content/articles",
    successStories: "/api/content/success-stories",
    byId: (kind: "articles" | "success-stories", id: string) =>
      `/api/content/${kind}/${encodeURIComponent(id)}`,
  },
} as const;
