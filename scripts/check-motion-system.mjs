import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const fail = (message) => {
  console.error(`Motion system check failed: ${message}`);
  process.exit(1);
};

const theme = read("src/theme/index.ts");
const launch = read("src/features/launch/hooks/useLaunchScreen.ts");
const onboarding = read("src/features/public/screens/OnboardingScreen.tsx");

for (const token of [
  "minimumVisible: 2400",
  "exit: 320",
  "progress: 2100",
  "slideOut: 180",
  "slideIn: 320",
  "completionExit: 300",
]) {
  if (!theme.includes(token)) fail(`missing motion token: ${token}`);
}

if (!launch.includes("MOTION.launch.minimumVisible")) fail("launch must use the minimum-visible token");
if (!launch.includes("MOTION.launch.exit")) fail("launch exit must use a motion token");
if (!launch.includes("MOTION.launch.progress")) fail("launch progress must use a motion token");
if (/\},\s*1350\s*\);/.test(launch)) fail("legacy 1350ms launch timer returned");
if (/duration:\s*120\b/.test(launch)) fail("legacy 120ms splash exit returned");

if (!onboarding.includes("MOTION.onboarding.slideOut")) fail("onboarding slide-out must use motion tokens");
if (!onboarding.includes("MOTION.onboarding.slideIn")) fail("onboarding slide-in must use motion tokens");
if (!onboarding.includes("MOTION.onboarding.completionExit")) fail("onboarding completion must animate before navigation");
if (/duration:\s*(90|150)\b/.test(onboarding)) fail("legacy ultra-fast onboarding durations returned");
if (!onboarding.includes("if (isCompleting || isChanging) return")) fail("onboarding completion must reject repeated taps during transitions");

console.log("Motion system check passed: launch timing and onboarding transitions use centralized, guarded motion tokens.");
