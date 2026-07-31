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
  registrationSuccess: "/registration-success",
  registrationPending: "/registration-pending",
  home: "/(tabs)",
  reports: "/reports",
  map: "/map",
  adoption: "/adoption",
  search: "/search",
  profile: "/profile",
  helpCenter: "/help-center",
  contactUs: "/contact-us",
  about: "/about",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
