const parseBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value == null || value.trim() === "") return fallback;
  return value.trim().toLowerCase() === "true";
};

const parsePositiveNumberEnv = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeApiUrl = (value: string | undefined) => {
  const resolved = value?.trim() ?? "";
  return resolved.replace(/\/+$/, "");
};

/**
 * Runtime integration configuration.
 *
 * The app intentionally remains in mock mode until the real backend contract is
 * available. Expo exposes variables prefixed with EXPO_PUBLIC_ to app code.
 */
export const APP_CONFIG = {
  useMockApi: parseBooleanEnv(process.env.EXPO_PUBLIC_USE_MOCK_API, true),
  // Replace with the deployed backend URL before disabling mock mode.
  apiUrl: normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL),
  requestTimeout: parsePositiveNumberEnv(process.env.EXPO_PUBLIC_API_TIMEOUT_MS, 10_000),
} as const;

export const isBackendConfigured = () =>
  !APP_CONFIG.useMockApi &&
  APP_CONFIG.apiUrl.length > 0 &&
  /^https?:\/\//i.test(APP_CONFIG.apiUrl);
