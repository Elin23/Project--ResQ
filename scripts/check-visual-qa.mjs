import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const publicScreens = [
  "AboutScreen.tsx",
  "ContactUsScreen.tsx",
  "PrivacyPolicyScreen.tsx",
  "HelpCenterScreen.tsx",
  "TermsAndConditionsScreen.tsx",
].map((name) => read(`src/features/public/screens/${name}`));

const migratedTypography = [
  "src/features/public/screens/About.styles.ts",
  "src/features/public/screens/ContactUs.styles.ts",
  "src/features/public/screens/PrivacyPolicy.styles.ts",
  "src/features/public/screens/HelpCenter.styles.ts",
  "src/features/public/screens/TermsAndConditions.styles.ts",
  "src/features/auth/screens/RegisterEntity.styles.ts",
  "src/features/auth/screens/RegisterUser.styles.ts",
  "src/features/auth/screens/RegistrationSuccess.styles.ts",
  "src/features/auth/screens/ChooseAccountScreen.tsx",
].map(read);

const screenHeader = read("src/components/ui/ScreenHeader.tsx");

if (publicScreens.some((source) => !source.includes("<ScreenHeader"))) {
  fail("Core public/support pages must use the shared ScreenHeader contract.");
} else pass("Public/support headers use the shared ScreenHeader contract.");

if (migratedTypography.some((source) => /fontSize\s*:\s*\d/.test(source))) {
  fail("Migrated public/auth surfaces still contain literal font sizes.");
} else pass("Migrated public/auth surfaces use semantic typography tokens.");

if (!screenHeader.includes('direction: "rtl"')) {
  fail("ScreenHeader must declare RTL container direction.");
} else pass("ScreenHeader owns RTL container direction.");

if (!screenHeader.includes("backAccessibilityLabel")) {
  fail("ScreenHeader must preserve an explicit back-button accessibility label.");
} else pass("ScreenHeader exposes an accessible back action.");
