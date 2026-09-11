import { APP_CONFIG } from "@/src/constants/config";
import { apiRequest } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface MediaUploadDto {
  id: number;
  type?: string | null;
  originalFileName?: string | null;
  contentType?: string | null;
  sizeBytes: number;
  url?: string | null;
  thumbnailUrl?: string | null;
  isCommitted: boolean;
  createdAt: string;
}

const inferFileName = (uri: string, index = 0) => {
  const clean = uri.split("?")[0];
  const segment = clean.split("/").pop();
  return segment && segment.includes(".") ? segment : `resq-upload-${Date.now()}-${index}.jpg`;
};

const inferMimeType = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "heic" || ext === "heif") return "image/heic";
  if (ext === "mp4") return "video/mp4";
  if (ext === "mov") return "video/quicktime";
  if (ext === "pdf") return "application/pdf";
  return "image/jpeg";
};

export async function uploadMediaUri(uri: string, index = 0): Promise<MediaUploadDto> {
  if (!uri || /^https?:\/\//i.test(uri)) {
    throw new Error("تعذر رفع الملف لأن مساره المحلي غير صالح.");
  }
  const name = inferFileName(uri, index);
  const form = new FormData();
  form.append("file", { uri, name, type: inferMimeType(name) } as unknown as Blob);
  return apiRequest<MediaUploadDto>(API_ENDPOINTS.uploads.create, { method: "POST", body: form, timeout: APP_CONFIG.uploadTimeout });
}

export async function uploadLocalMediaUris(uris: (string | undefined | null)[]): Promise<MediaUploadDto[]> {
  const local = uris.filter((uri): uri is string => Boolean(uri && !/^https?:\/\//i.test(uri)));
  const results: MediaUploadDto[] = [];
  // Sequential uploads are intentional: it avoids saturating slower mobile networks and
  // makes backend 429 handling predictable.
  for (let index = 0; index < local.length; index += 1) {
    results.push(await uploadMediaUri(local[index], index));
  }
  return results;
}
