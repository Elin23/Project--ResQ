import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    console.error(`Feedback V11 check failed: ${message}`);
    process.exit(1);
  }
};

const provider = read("src/components/ui/FeedbackProvider.tsx");
const root = read("app/_layout.tsx");
const index = read("src/components/ui/index.ts");

assert(provider.includes('"success" | "error" | "warning" | "info"'), "feedback must expose the four semantic tones");
assert(provider.includes('accessibilityRole="alert"'), "feedback surface must announce itself as an alert");
assert(provider.includes("minHeight: 44") && provider.includes("width: 44") && provider.includes("height: 44"), "feedback actions must preserve 44px touch targets");
assert(root.includes("<FeedbackProvider>") && root.includes("</FeedbackProvider>"), "FeedbackProvider must wrap the routed app");
assert(index.includes("useFeedback") && index.includes("FeedbackProvider"), "feedback API must be exported through the UI library");

const migrated = [
  "src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx",
  "src/features/feeding-points/screens/CreateFeedingPointScreen.tsx",
  "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  "src/features/donations/screens/CreateDonationCampaignScreen.tsx",
  "src/features/organization-dashboard/hooks/useOrganizationDashboard.ts",
  "src/features/organization-dashboard/hooks/useOrganizationTaskDetails.ts",
  "src/features/profile/hooks/useEditProfileForm.ts",
  "src/features/public/hooks/useContactUsForm.ts",
  "src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx",
  "src/features/map-places/screens/MapPlaceChangeRequestScreen.tsx",
  "src/features/organizations/screens/OrganizationDetailsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationTaskCompletedScreen.tsx",
];
for (const path of migrated) {
  const source = read(path);
  assert(source.includes("useFeedback"), `${path} must use shared feedback`);
  assert(!source.includes("Alert.alert"), `${path} must not use native alerts for routine feedback`);
}

const applicationDetails = read("src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx");
assert(applicationDetails.includes("useFeedback"), "map application details must use shared feedback for routine failures");
assert(applicationDetails.includes('ConfirmDialog') && applicationDetails.includes('useDecisionDialog'), "destructive cancellation must use the unified decision dialog");

console.log(`Feedback V11 passed: ${migrated.length + 1} migrated flows + global semantic feedback provider.`);
