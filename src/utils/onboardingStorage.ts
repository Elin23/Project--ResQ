import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@resq:onboarding-completed";

export async function hasCompletedOnboarding() {
  return false;
}

export async function completeOnboarding() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    return;
  }
}

export async function resetOnboarding() {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch {
    return;
  }
}
