import { APP_CONFIG } from "@/src/constants/config";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit & { timeout?: number };

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
    const response = await fetch(`${APP_CONFIG.apiUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError("تعذر إكمال الطلب", response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("انتهت مهلة الاتصال بالخادم");
    }
    throw new ApiError("تعذر الاتصال بالخادم");
  } finally {
    clearTimeout(timeout);
  }
}
