import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredAuthTokens = {
  accessToken: string;
  accessTokenExpiresAt?: string;
  refreshToken: string;
  refreshTokenExpiresAt?: string;
};

const STORAGE_KEY = "resq.auth.tokens.v1";
let memoryTokens: StoredAuthTokens | null = null;

export async function loadAuthTokens() {
  if (memoryTokens) return memoryTokens;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAuthTokens>;
    if (!parsed.accessToken || !parsed.refreshToken) return null;
    memoryTokens = parsed as StoredAuthTokens;
    return memoryTokens;
  } catch {
    return null;
  }
}

export function getAuthTokensSync() {
  return memoryTokens;
}

export async function saveAuthTokens(tokens: StoredAuthTokens) {
  memoryTokens = tokens;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export async function clearAuthTokens() {
  memoryTokens = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function isIsoExpiryPast(value?: string | null, skewMs = 0) {
  if (!value) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && time <= Date.now() + skewMs;
}
