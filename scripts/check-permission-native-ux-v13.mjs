import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    console.error(`Permission & Native Prompt V13 failed: ${message}`);
    process.exit(1);
  }
};

const permissionHook = read("src/hooks/usePermissionFeedback.ts");
assert(permissionHook.includes("canAskAgain === false"), "permission feedback must distinguish permanently blocked permissions");
assert(permissionHook.includes("Linking.openSettings()"), "blocked permissions must offer app settings");
assert(permissionHook.includes('actionLabel: blocked ? "فتح الإعدادات"'), "settings action must use Arabic copy");

const selectionSheet = read("src/components/ui/SelectionSheet.tsx");
assert(selectionSheet.includes('accessibilityRole="radio"'), "selection sheet options must expose radio semantics");
assert(selectionSheet.includes("minHeight: 52"), "selection sheet options must preserve comfortable touch targets");

const report = read("src/features/reports/components/CreateReportForm.tsx");
assert(report.includes("SelectionSheet"), "report animal type must use in-app selection sheet");
assert(report.includes("usePermissionFeedback"), "report permissions must use shared permission feedback");
assert(!report.includes("Alert.alert"), "report flow must not use native Alert for selection/permissions");

const directPermissionFiles = [
  "src/features/feeding-points/screens/CreateFeedingPointScreen.tsx",
  "src/features/feeding-points/components/UpdateStatusSheet.tsx",
  "src/features/public/hooks/useContactUsForm.ts",
  "src/features/donations/screens/CreateDonationCampaignScreen.tsx",
  "src/features/organization-dashboard/hooks/useOrganizationTaskDetails.ts",
  "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  "src/features/auth/hooks/useRegisterEntityForm.tsx",
  "src/features/map/screens/MapScreen.tsx",
];
for (const path of directPermissionFiles) {
  const source = read(path);
  assert(source.includes("usePermissionFeedback"), `${path} must use shared permission feedback`);
  assert(source.includes("handlePermission"), `${path} must route denied permissions through the shared handler`);
}

const profileForm = read("src/features/profile/hooks/useEditProfileForm.ts");
assert(!profileForm.includes("Alert.prompt"), "profile skill editing must not depend on iOS-only Alert.prompt");
assert(profileForm.includes("skillDraft"), "profile skill editing must expose inline skill input state");

const alertUsages = [];
for (const root of ["src/features", "src/hooks"]) {
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const path = `${current}/${entry.name}`;
      if (entry.isDirectory()) stack.push(path);
      else if (/\.(ts|tsx)$/.test(entry.name) && read(path).includes("Alert.alert")) alertUsages.push(path);
    }
  }
}
assert(alertUsages.length === 0, `feature/hooks code must not use native Alert.alert; found: ${alertUsages.join(", ")}`);

console.log(`Permission & Native Prompt V13 passed: ${directPermissionFiles.length} permission flows + report selector + profile prompt migration + zero feature native alerts.`);
