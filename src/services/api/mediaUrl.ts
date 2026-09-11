import { APP_CONFIG } from "@/src/constants/config";
import { resolveApiUrl } from "./client";

const normalizePath = (raw: string) => raw
  .replace(/\\/g, "/")
  .replace(/^~\//, "/")
  .replace(/^\.?\/?wwwroot\//i, "/")
  .replace(/^\.?\/?public\//i, "/")
  .replace(/\/+/g, "/");

const isLoopbackOrPrivateHost = (host: string) => {
  const value = host.toLowerCase();
  return value === "localhost" || value === "127.0.0.1" || value === "0.0.0.0" ||
    /^10\./.test(value) || /^192\.168\./.test(value) || /^172\.(1[6-9]|2\d|3[01])\./.test(value);
};

/**
 * Converts every backend media representation into a URL reachable by the phone.
 * It also repairs common production responses that accidentally contain localhost,
 * a private host, a Windows path, ~/uploads or wwwroot/uploads.
 */
export function resolveMediaUrl(value?: string | null): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  if (/^(?:file:|content:|data:|blob:)/i.test(raw)) return raw;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const media = new URL(raw);
      if (!isLoopbackOrPrivateHost(media.hostname)) return raw;
      const api = new URL(APP_CONFIG.apiUrl);
      return `${api.origin}${normalizePath(media.pathname)}${media.search}`;
    } catch {
      return raw;
    }
  }

  const path = normalizePath(raw);
  return resolveApiUrl(path.startsWith("/") ? path : `/${path}`);
}

export function resolveOptionalMediaUrl(value?: string | null): string | undefined {
  const resolved = resolveMediaUrl(value);
  return resolved || undefined;
}
