import { APP_CONFIG } from "@/src/constants/config";
import { clearAuthTokens, getAuthTokensSync, isIsoExpiryPast, loadAuthTokens, saveAuthTokens } from "./authTokens";
import { emitSessionInvalidated } from "./authSessionEvents";
import { API_ENDPOINTS } from "./endpoints";

export type ApiErrorPayload = {
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
  traceId?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly payload?: ApiErrorPayload,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isNotFound() { return this.status === 404; }
  get isValidationError() { return this.status === 400 || this.status === 422; }
}

type RequestOptions = RequestInit & {
  timeout?: number;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

type AccessTokenProvider = () => string | null | undefined | Promise<string | null | undefined>;
let accessTokenProvider: AccessTokenProvider | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setApiAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

export const resolveApiUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  if (!/^https?:\/\//i.test(APP_CONFIG.apiUrl)) {
    throw new ApiError("تعذر إعداد الاتصال بالخادم. يرجى تحديث التطبيق أو التواصل مع الدعم.");
  }
  return `${APP_CONFIG.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const readErrorPayload = async (response: Response): Promise<ApiErrorPayload | undefined> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!/(?:application\/json|[^;]+\+json)/i.test(contentType)) return undefined;
  try { return (await response.json()) as ApiErrorPayload; } catch { return undefined; }
};

const firstValidationMessage = (payload?: ApiErrorPayload) => {
  if (!payload?.errors) return undefined;
  for (const value of Object.values(payload.errors)) {
    if (Array.isArray(value) && value[0]) return value[0];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
};

const looksArabic = (value: string) => /[\u0600-\u06FF]/.test(value);

const getErrorMessage = (status: number, payload?: ApiErrorPayload, isPublicAuthRequest = false) => {
  const validation = firstValidationMessage(payload);
  const serverMessage = validation || payload?.message || payload?.detail || payload?.title;
  // Show backend text only when it is already localized. This prevents raw English
  // ProblemDetails/SQL/internal messages from leaking into the Arabic UI.
  if (serverMessage && looksArabic(serverMessage)) return serverMessage;

  if (status === 400 || status === 422) return "البيانات المدخلة غير صحيحة. راجع الحقول المطلوبة ثم حاول مرة أخرى.";
  if (status === 401) return isPublicAuthRequest
    ? "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن الحساب غير متاح لتسجيل الدخول."
    : "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.";
  if (status === 403) return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  if (status === 404) return "تعذر العثور على البيانات المطلوبة.";
  if (status === 409) {
    const normalized = (serverMessage ?? "").toLowerCase();
    if (normalized.includes("email") && (normalized.includes("already exists") || normalized.includes("already registered") || normalized.includes("duplicate"))) {
      return "يوجد حساب مسجل بهذا البريد الإلكتروني مسبقًا. استخدم بريدًا آخر أو سجّل الدخول.";
    }
    if (normalized.includes("phone") && (normalized.includes("already exists") || normalized.includes("already registered") || normalized.includes("duplicate"))) {
      return "يوجد حساب مسجل بهذا رقم الهاتف مسبقًا. استخدم رقمًا آخر أو سجّل الدخول.";
    }
    return "تعذر إكمال العملية لأن البيانات تغيرت أثناء الحفظ. أعد المحاولة بعد تحديث الصفحة.";
  }
  if (status === 413) return "حجم الملف أكبر من الحد المسموح. اختر ملفًا أصغر ثم حاول مرة أخرى.";
  if (status === 429) return "تم إرسال طلبات كثيرة خلال وقت قصير. انتظر قليلًا ثم حاول مرة أخرى.";
  if (status >= 500) return "حدث خلل مؤقت في الخادم. يرجى المحاولة بعد قليل.";
  return "تعذر إكمال الطلب. يرجى المحاولة مرة أخرى.";
};

type RefreshResponse = {
  accessToken?: string | null;
  accessTokenExpiresAt?: string;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: string;
};

async function invalidateSessionTokens() {
  await clearAuthTokens();
  emitSessionInvalidated();
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const current = getAuthTokensSync() ?? await loadAuthTokens();
    if (!current?.refreshToken) return null;
    if (isIsoExpiryPast(current.refreshTokenExpiresAt, 5_000)) {
      await invalidateSessionTokens();
      return null;
    }
    try {
      const response = await fetch(resolveApiUrl(API_ENDPOINTS.auth.refresh), {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!response.ok) {
        if ([400, 401, 403].includes(response.status)) await invalidateSessionTokens();
        return null;
      }
      const data = (await response.json()) as RefreshResponse;
      if (!data.accessToken || !data.refreshToken) {
        await invalidateSessionTokens();
        return null;
      }
      await saveAuthTokens({
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      });
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? APP_CONFIG.requestTimeout);

  try {
    let stored = options.skipAuth ? null : (getAuthTokensSync() ?? await loadAuthTokens());
    if (!options.skipAuth && !options.skipRefresh && stored?.refreshToken && isIsoExpiryPast(stored.accessTokenExpiresAt, 30_000)) {
      const proactiveToken = await refreshAccessToken();
      if (proactiveToken) stored = getAuthTokensSync() ?? stored;
    }
    const provided = options.skipAuth ? null : await accessTokenProvider?.();
    const token = provided ?? stored?.accessToken ?? null;
    const headers = new Headers(options.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (options.body != null && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

    const run = (requestHeaders: Headers) => fetch(resolveApiUrl(path), {
      ...options,
      headers: requestHeaders,
      signal: controller.signal,
    });

    let response = await run(headers);
    if (response.status === 401 && !options.skipAuth && !options.skipRefresh) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        const retryHeaders = new Headers(headers);
        retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
        response = await run(retryHeaders);
      }
    }

    if (!response.ok) {
      const payload = await readErrorPayload(response);
      throw new ApiError(getErrorMessage(response.status, payload, Boolean(options.skipAuth)), response.status, payload);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
    const contentType = response.headers.get("content-type") ?? "";
    if (!/(?:application\/json|[^;]+\+json)/i.test(contentType)) return (await response.text()) as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") throw new ApiError("استغرق الاتصال بالخادم وقتًا أطول من المتوقع. حاول مرة أخرى.");
    throw new ApiError("تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.");
  } finally {
    clearTimeout(timeout);
  }
}
