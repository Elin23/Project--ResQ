import { APP_CONFIG } from "@/src/constants/config";

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

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 400 || this.status === 422;
  }
}

type RequestOptions = RequestInit & {
  timeout?: number;
  skipAuth?: boolean;
};

type AccessTokenProvider = () => string | null | undefined | Promise<string | null | undefined>;

let accessTokenProvider: AccessTokenProvider | null = null;

/**
 * Allows the authentication layer to provide the current access token later,
 * without coupling the API client to the current mock-session implementation.
 */
export function setApiAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

const resolveUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  if (!/^https?:\/\//i.test(APP_CONFIG.apiUrl)) {
    throw new ApiError("لم يتم إعداد عنوان الخادم بعد. فعّل وضع البيانات الوهمية أو أضف EXPO_PUBLIC_API_URL.");
  }
  return `${APP_CONFIG.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const readErrorPayload = async (response: Response): Promise<ApiErrorPayload | undefined> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;

  try {
    return (await response.json()) as ApiErrorPayload;
  } catch {
    return undefined;
  }
};

const getErrorMessage = (status: number, payload?: ApiErrorPayload) => {
  const serverMessage = payload?.message || payload?.detail || payload?.title;
  if (serverMessage) return serverMessage;

  if (status === 401) return "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.";
  if (status === 403) return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  if (status === 404) return "تعذر العثور على البيانات المطلوبة.";
  if (status === 409) return "تعذر إكمال العملية بسبب تعارض في البيانات.";
  if (status === 429) return "تم إرسال عدد كبير من الطلبات. يرجى المحاولة بعد قليل.";
  if (status >= 500) return "حدث خطأ في الخادم. يرجى المحاولة لاحقًا.";
  return "تعذر إكمال الطلب.";
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout ?? APP_CONFIG.requestTimeout,
  );

  try {
    const token = options.skipAuth ? null : await accessTokenProvider?.();
    const headers = new Headers(options.headers);

    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (options.body != null && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(resolveUrl(path), {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await readErrorPayload(response);
      throw new ApiError(getErrorMessage(response.status, payload), response.status, payload);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return (await response.text()) as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("انتهت مهلة الاتصال بالخادم.");
    }
    throw new ApiError("تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.");
  } finally {
    clearTimeout(timeout);
  }
}
