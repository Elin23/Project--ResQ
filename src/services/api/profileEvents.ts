import type { MyProfileDto } from "./profileApi";

type ProfileListener = (profile: MyProfileDto) => void;

const listeners = new Set<ProfileListener>();
let latestProfile: MyProfileDto | null = null;

/**
 * Returns the newest profile known by the running app.
 * This is an in-memory UI cache only; the backend remains the source of truth.
 */
export function getLatestProfile() {
  return latestProfile;
}

/**
 * Publishes a freshly loaded/saved profile to every mounted profile consumer.
 * This makes avatar/name changes visible immediately without signing out.
 */
export function publishProfileChanged(profile: MyProfileDto) {
  latestProfile = profile;

  for (const listener of listeners) {
    try {
      listener(profile);
    } catch {
      // A UI listener must never break a successful profile update.
    }
  }
}

export function subscribeProfileChanged(listener: ProfileListener) {
  listeners.add(listener);

  if (latestProfile) {
    try {
      listener(latestProfile);
    } catch {
      // Ignore rendering/listener failures.
    }
  }

  return () => {
    listeners.delete(listener);
  };
}
