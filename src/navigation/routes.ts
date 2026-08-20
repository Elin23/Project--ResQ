import type { AccountKind } from "@/src/types/accounts";

/** Central route registry. Keep navigation paths here to avoid broken literals. */
export const ROUTES = {
  root: "/",
  welcome: "/welcome",
  onboarding: "/onboarding",
  login: "/login",
  chooseAccount: "/choose-account",

  registerUser: "/register-user",
  registerEntity: "/register-entity",
  verifyRegistrationPhone: "/verify-registration-phone",

  forgotPassword: "/forgot-password",
  verifyResetCode: "/verify-reset-code",
  createNewPassword: "/create-new-password",
  passwordResetSuccess: "/password-reset-success",

  registrationSuccess: "/registration-success",
  registrationPending: "/registration-pending",

  userHome: "/(user)/(tabs)/(home)",
  home: "/(user)/(tabs)/(home)",

  notifications: "/notifications",

  reports: "/reports",
  createReport: "/reports/create",
  reportSuccess: "/reports/success",

  map: "/map",

  feedingPoints: "/feeding-points",
  createFeedingPoint: "/feeding-points/create",

  adoption: "/adoption",
  adoptionList: "/adoptions",
  createAdoptionListing: "/adoptions/create",

  search: "/search",

  profile: "/profile",
  editProfile: "/profile/edit",

  myMapPlaces: "/map-places",
  mapPlaceApply: "/map-places/apply",

  organizations: "/organizations",
  organizationDashboard: "/organization",
  organizationTasks: "/organization/tasks",
  organizationReports: "/organization/reports",
  organizationMap: "/organization/map",
  organizationNotifications: "/organization/notifications",
  organizationProfile: "/organization/profile",


  donations: "/donations",

  helpCenter: "/help-center",
  contactUs: "/contact-us",
  about: "/about",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** مسار ديناميكي — ملف جهة محددة. app/organizations/[id].tsx */
export function organizationDetailsRoute(id: string) {
  return {
    pathname: "/organizations/[id]",
    params: { id },
  } as const;
}

/** مسار ديناميكي — نتيجة بحث محددة. app/search/[id].tsx */
export function searchResultDetailsRoute(id: string) {
  return {
    pathname: "/search/[id]",
    params: { id },
  } as const;
}


/** Public adoption discovery while preserving the active account workspace. */
export function adoptionRoute(accountKind: AccountKind | null = null) {
  if (accountKind === "organization") return "/organization/adoptions" as const;
  return ROUTES.adoptionList;
}

/** Public adoption details while preserving the active account workspace. */
export function adoptionDetailsRoute(id: string, accountKind: AccountKind | null = null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/adoptions/[id]", params: { id } } as const;
  }
  return { pathname: "/adoptions/[id]", params: { id } } as const;
}


/** Feeding-points list in the current account workspace. Guests/users share the public user shell. */
export function feedingPointsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/feeding-points" as const;
  return ROUTES.feedingPoints;
}

/** Owner submission list in the current account workspace. */
export function feedingPointSubmissionsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/feeding-points/submissions" as const;
  return "/feeding-points/submissions" as const;
}

/** Owner submission details in the current account workspace. */
export function feedingPointSubmissionDetailsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/feeding-points/submissions/[id]", params: { id } } as const;
  }
  return { pathname: "/feeding-points/submissions/[id]", params: { id } } as const;
}

/** مسار ديناميكي — تفاصيل نقطة إطعام محددة. app/feeding-points/[id].tsx */
export function feedingPointDetailsRoute(id: string, accountKind: AccountKind | null = null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/feeding-points/[id]", params: { id } } as const;
  }
  return { pathname: "/feeding-points/[id]", params: { id } } as const;
}





/** User-owned map-place application details. Ownership is enforced again in the screen/repository. */
export function mapPlaceApplicationDetailsRoute(id: string) {
  return { pathname: "/map-places/applications/[id]", params: { id } } as const;
}

/** Edit a draft/rejected map-place application owned by the current user. */
export function mapPlaceApplicationEditRoute(id: string) {
  return { pathname: "/map-places/applications/[id]/edit", params: { id } } as const;
}

/** Edit one approved map place owned by the current user. */
export function mapPlaceEditRoute(id: string) {
  return { pathname: "/map-places/[id]/edit", params: { id } } as const;
}

/** Submit a review request for sensitive identity/location/verification changes. */
export function mapPlaceChangeRequestRoute(id: string) {
  return { pathname: "/map-places/[id]/change-request", params: { id } } as const;
}

/** Data-entry flow for applying to adopt a public listing. */
export function adoptionApplyRoute(id: string) {
  return { pathname: "/adoptions/[id]/apply", params: { id } } as const;
}

/** Applicant adoption requests inside the persistent user shell. */
export function adoptionMyApplicationsRoute(accountKind: AccountKind | null = null) {
  if (accountKind === "organization") return "/organization/adoptions/my-applications" as const;
  return "/adoptions/my-applications" as const;
}

/** Applicant-owned adoption request status while preserving the active workspace. */
export function adoptionApplicationDetailsRoute(
  applicationId: string,
  accountKind: AccountKind | null = null,
) {
  if (accountKind === "organization") {
    return { pathname: "/organization/adoptions/my-applications/[applicationId]", params: { applicationId } } as const;
  }
  return { pathname: "/adoptions/my-applications/[applicationId]", params: { applicationId } } as const;
}

/** Owner adoption listings in the current account workspace. */
export function adoptionMyListingsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/adoptions/my-listings" as const;
  return "/adoptions/my-listings" as const;
}

/** Owner adoption-listing details in the current account workspace. */
export function adoptionMyListingDetailsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/adoptions/my-listings/[id]", params: { id } } as const;
  }
  return { pathname: "/adoptions/my-listings/[id]", params: { id } } as const;
}

/** Adoption applications received for one owned listing. */
export function adoptionListingApplicationsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/adoptions/my-listings/[id]/applications", params: { id } } as const;
  }
  return { pathname: "/adoptions/my-listings/[id]/applications", params: { id } } as const;
}

/** One adoption application, visible only to the listing owner. */
export function adoptionListingApplicationDetailsRoute(
  id: string,
  applicationId: string,
  accountKind: AccountKind | null,
) {
  if (accountKind === "organization") {
    return {
      pathname: "/organization/adoptions/my-listings/[id]/applications/[applicationId]",
      params: { id, applicationId },
    } as const;
  }
  return {
    pathname: "/adoptions/my-listings/[id]/applications/[applicationId]",
    params: { id, applicationId },
  } as const;
}

/** Data-entry edit flow intentionally lives outside the persistent tab shell. */
export function adoptionMyListingEditRoute(id: string) {
  return {
    pathname: "/adoptions/my-listings/[id]/edit",
    params: { id },
  } as const;
}

/** Report details preserving the active account workspace. */
export function reportDetailsRoute(id: string, accountKind: AccountKind | null = null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/reports/[id]", params: { id } } as const;
  }
  return { pathname: "/reports/[id]", params: { id } } as const;
}


/** مسار ديناميكي — فرز بلاغ وارد داخل مساحة الجمعية. */
export function organizationReportDetailsRoute(id: string) {
  return {
    pathname: "/organization/reports/[id]",
    params: { id },
  } as const;
}

/** مسار ديناميكي — تفاصيل مهمة إنقاذ خاصة بالجمعية. */
export function organizationTaskDetailsRoute(id: string) {
  return {
    pathname: "/organization/tasks/[id]",
    params: { id },
  } as const;
}

/** مسار ديناميكي — ملخص إكمال مهمة إنقاذ خاصة بالجمعية. */
export function organizationTaskCompletedRoute(id: string) {
  return {
    pathname: "/organization/tasks/[id]/completed",
    params: { id },
  } as const;
}

/** تفاصيل جهة خدمة من داخل مساحة الحساب الحالية مع إبقاء الـNavbar. */
export function servicePlaceDetailsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/places/[id]", params: { id } } as const;
  }
  return { pathname: "/places/[id]", params: { id } } as const;
}


/** Veterinary clinics discovery in the current account workspace. */
export function veterinaryClinicsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/vets" as const;
  return "/vets" as const;
}

/** Public veterinary clinic details preserving the current workspace. */
export function veterinaryClinicDetailsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/vets/[id]", params: { id } } as const;
  }
  return { pathname: "/vets/[id]", params: { id } } as const;
}


/** Donations discovery in the current account workspace. */
export function donationsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/donations" as const;
  return ROUTES.donations;
}

/** Public campaign details while preserving the current account workspace. */
export function donationCampaignDetailsRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/donations/[id]", params: { id } } as const;
  }
  return { pathname: "/donations/[id]", params: { id } } as const;
}

/** Campaign owner profile fallback for campaign-owned entities. */
export function donationCampaignOwnerRoute(id: string, accountKind: AccountKind | null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/donations/[id]/owner", params: { id } } as const;
  }
  return { pathname: "/donations/[id]/owner", params: { id } } as const;
}

/** Donation checkout is a focused data-entry flow outside the persistent navbar shell. */
export function donationCheckoutRoute(
  id: string,
  accountKind: AccountKind | null,
  input?: { amount?: number; supportMessage?: string },
) {
  return {
    pathname: "/donation-checkout/[id]",
    params: {
      id,
      accountKind: accountKind ?? "user",
      ...(input?.amount ? { amount: String(input.amount) } : {}),
      ...(input?.supportMessage ? { supportMessage: input.supportMessage } : {}),
    },
  } as const;
}

/** Transfer submitted confirmation, keyed by verification code. */
export function donationTransferSubmittedRoute(
  verificationCode: string,
  accountKind: AccountKind | null,
) {
  const params = { code: verificationCode };
  if (accountKind === "organization") {
    return { pathname: "/organization/donations/transfer-submitted", params } as const;
  }
  return { pathname: "/donations/transfer-submitted", params } as const;
}

/** Create campaign is a focused data-entry flow for approved organizations. */
export function createCampaignRoute(accountKind: AccountKind | null) {
  return {
    pathname: "/campaigns/create",
    params: {
      accountKind: "organization",
    },
  } as const;
}

/** Owner campaign status / management surface inside its entity workspace. */
export function ownedCampaignStatusRoute(id: string, accountKind: AccountKind | null) {
  return { pathname: "/organization/donations/campaigns/[id]", params: { id } } as const;
}

/** Owner campaign list in the current entity workspace. */
export function myCampaignsRoute(accountKind: AccountKind | null) {
  return "/organization/donations/campaigns" as const;
}

/** Focused campaign edit flow outside the persistent navbar shell. */
export function editCampaignRoute(id: string, accountKind: AccountKind | null) {
  return {
    pathname: "/campaigns/[id]/edit",
    params: {
      id,
      accountKind: "organization",
    },
  } as const;
}

/** Account-scoped donation history while preserving the current workspace. */
export function myDonationsRoute(accountKind: AccountKind | null) {
  if (accountKind === "organization") return "/organization/donations/my-donations" as const;
  return "/donations/my-donations" as const;
}

/** Donor-owned transfer details while preserving the current account workspace. */
export function donationDetailsRoute(id: string, accountKind: AccountKind | null = null) {
  if (accountKind === "organization") {
    return { pathname: "/organization/donations/transfers/[id]", params: { id } } as const;
  }
  return { pathname: "/donations/transfers/[id]", params: { id } } as const;
}
