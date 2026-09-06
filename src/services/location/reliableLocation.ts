import * as Location from "expo-location";

export type ReliableLocationResult = {
  location: Location.LocationObject;
  source: "current" | "last-known";
};

export type ReliableLocationOptions = {
  accuracy?: Location.Accuracy;
  timeoutMs?: number;
  maxLastKnownAgeMs?: number;
};

export class LocationUnavailableError extends Error {
  constructor(
    message: string,
    public readonly reason:
      | "services-disabled"
      | "permission-denied"
      | "position-unavailable",
  ) {
    super(message);
    this.name = "LocationUnavailableError";
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("location-timeout")), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Gets a usable device location without leaving the UI waiting indefinitely.
 * A fresh reading is preferred; a recent last-known position is the fallback.
 */
export async function getReliableCurrentLocation(
  options: ReliableLocationOptions = {},
): Promise<ReliableLocationResult> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new LocationUnavailableError(
      "خدمات الموقع غير مفعّلة على الجهاز.",
      "services-disabled",
    );
  }

  const existingPermission = await Location.getForegroundPermissionsAsync();
  const permission = existingPermission.granted
    ? existingPermission
    : await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new LocationUnavailableError(
      "لم يتم منح صلاحية الوصول إلى الموقع.",
      "permission-denied",
    );
  }

  const timeoutMs = options.timeoutMs ?? 8000;
  const accuracy = options.accuracy ?? Location.Accuracy.Balanced;

  try {
    const current = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy }),
      timeoutMs,
    );
    return { location: current, source: "current" };
  } catch {
    const lastKnown = await Location.getLastKnownPositionAsync({
      maxAge: options.maxLastKnownAgeMs ?? 5 * 60 * 1000,
    });

    if (lastKnown) return { location: lastKnown, source: "last-known" };

    throw new LocationUnavailableError(
      "تعذر الحصول على موقع حالي أو موقع حديث محفوظ على الجهاز.",
      "position-unavailable",
    );
  }
}
