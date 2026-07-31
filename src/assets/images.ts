/**
 * Static image registry.
 * React Native requires image paths to be statically analyzable, so all local
 * images are declared once from this stable location instead of using fragile
 * paths relative to feature screens.
 */
export const IMAGES = {
  resqDog: require("../../assets/images/resq-dog.png"),
  helpCenterHero: require("../../assets/images/help-center-hero.png"),
  onboarding: {
    journey: require("../../assets/images/onboarding/onboarding-1.png"),
    community: require("../../assets/images/onboarding/onboarding-2.png"),
    rescue: require("../../assets/images/onboarding/onboarding-3.png"),
  },
} as const;
