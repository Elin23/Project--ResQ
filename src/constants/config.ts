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
 * Production/runtime configuration. The application runtime is API-only;
 * mock/in-memory repositories are kept out of the production graph.
 */
export const APP_CONFIG = {
  runtimeMode: "api-only" as const,
  apiUrl: normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL ?? "https://resqmob.runasp.net"),
  requestTimeout: parsePositiveNumberEnv(process.env.EXPO_PUBLIC_API_TIMEOUT_MS, 40_000),
  uploadTimeout: parsePositiveNumberEnv(process.env.EXPO_PUBLIC_UPLOAD_TIMEOUT_MS, 130_000),
} as const;

export const isBackendConfigured = () =>
  APP_CONFIG.apiUrl.length > 0 &&
  /^https?:\/\//i.test(APP_CONFIG.apiUrl);
