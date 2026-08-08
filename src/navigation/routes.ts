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

  home: "/(tabs)",

  notifications: "/notifications",

  reports: "/reports",
  createReport: "/reports/create",
  reportSuccess: "/reports/success",

  map: "/map",

  adoption: "/adoption",
  adoptionList: "/adoptions",

  search: "/search",

  profile: "/profile",
  editProfile: "/profile/edit",

  organizations: "/organizations",
  organizationDashboard: "/organization-dashboard",

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

/** مسار ديناميكي — تفاصيل نقطة إطعام محددة. app/feeding-points/[id].tsx */
export function feedingPointDetailsRoute(id: string) {
  return {
    pathname: "/feeding-points/[id]",
    params: { id },
  } as const;
}

/** مسار ديناميكي — تفاصيل بلاغ إنقاذ محدد. app/reports/[id].tsx */
export function reportDetailsRoute(id: string) {
  return {
    pathname: "/reports/[id]",
    params: { id },
  } as const;
}
