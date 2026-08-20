/**
 * Product contract for the persistent floating navigation shell.
 *
 * Reading, browsing and detail surfaces keep the navbar visible. We leave the
 * shell only for focused data-entry/authentication flows where the keyboard,
 * validation or a transactional step needs the full viewport.
 */
export const NAVBAR_HIDDEN_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/welcome$/,
  /^\/onboarding$/,
  /^\/(?:login|choose-account|register-user|register-entity)$/,
  /^\/(?:forgot-password|verify-reset-code|create-new-password|password-reset-success)$/,
  /^\/(?:verify-registration-phone|registration-pending|registration-success)$/,
  /^\/reports\/create$/,
  /^\/reports\/success$/,
  /^\/profile\/edit$/,
  /^\/contact-us$/,
  /^\/organization\/tasks\/[^/]+$/,
] as const;

export function shouldShowPersistentNavbar(pathname: string) {
  return !NAVBAR_HIDDEN_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}
