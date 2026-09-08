/**
 * Central API route catalog shared by the future ASP.NET Core repositories.
 * Mobile screens must never hard-code backend paths.
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    registerUser: "/api/auth/register/user",
    registerOrganization: "/api/auth/register/organization",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  lookups: {
    governorates: "/api/lookups/governorates",
    regions: (governorateId: string) => `/api/lookups/governorates/${encodeURIComponent(governorateId)}/regions`,
  },
  users: {
    me: "/api/users/me",
  },
  organizations: {
    list: "/api/organizations",
    byId: (id: string) => `/api/organizations/${encodeURIComponent(id)}`,
    me: "/api/organizations/me",
  },
  reports: {
    list: "/api/reports",
    create: "/api/reports",
    byId: (id: string) => `/api/reports/${encodeURIComponent(id)}`,
    mine: "/api/reports/mine",
    mission: (reportId: string) => `/api/reports/${encodeURIComponent(reportId)}/rescue-mission`,
  },
  rescueMissions: {
    mine: "/api/rescue-missions/mine",
    byId: (id: string) => `/api/rescue-missions/${encodeURIComponent(id)}`,
  },
  adoption: {
    listings: "/api/adoption/listings",
    byId: (id: string) => `/api/adoption/listings/${encodeURIComponent(id)}`,
    mine: "/api/adoption/listings/mine",
    submit: (id: string) => `/api/adoption/listings/${encodeURIComponent(id)}/submit`,
    applications: "/api/adoption/applications",
    myApplications: "/api/adoption/applications/mine",
    listingApplications: (id: string) => `/api/adoption/listings/${encodeURIComponent(id)}/applications`,
  },
  feedingPoints: {
    list: "/api/feeding-points",
    byId: (id: string) => `/api/feeding-points/${encodeURIComponent(id)}`,
    submissions: "/api/feeding-points/submissions",
    mySubmissions: "/api/feeding-points/submissions/mine",
    refills: (id: string) => `/api/feeding-points/${encodeURIComponent(id)}/refills`,
    issues: (id: string) => `/api/feeding-points/${encodeURIComponent(id)}/issues`,
  },
  map: {
    entities: "/api/map/entities",
    requests: "/api/map/requests",
    myRequests: "/api/map/requests/mine",
  },
  donations: {
    campaigns: "/api/donation-campaigns",
    byId: (id: string) => `/api/donation-campaigns/${encodeURIComponent(id)}`,
    mine: "/api/donation-campaigns/mine",
    submit: (id: string) => `/api/donation-campaigns/${encodeURIComponent(id)}/submit`,
    transfers: "/api/donation-transfers",
    myTransfers: "/api/donation-transfers/mine",
  },
  advertisements: {
    byPlacement: (placement: string) => `/api/advertisements?placement=${encodeURIComponent(placement)}`,
  },
  notifications: {
    list: "/api/notifications",
    markRead: (id: string) => `/api/notifications/${encodeURIComponent(id)}/read`,
    devices: "/api/notifications/devices",
  },
  content: {
    articles: "/api/content/articles",
    articleById: (id: string) => `/api/content/articles/${encodeURIComponent(id)}`,
    successStories: "/api/content/success-stories",
    successStoryById: (id: string) => `/api/content/success-stories/${encodeURIComponent(id)}`,
    faq: "/api/content/faq",
  },
  uploads: {
    create: "/api/uploads",
  },
} as const;
