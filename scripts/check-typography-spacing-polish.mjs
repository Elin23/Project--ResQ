import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const report = read("src/features/reports/components/CreateReportForm.tsx");
const profileHeader = read("src/features/profile/components/ProfileHeader.tsx");
const profileStats = read("src/features/profile/components/ProfileStatsGrid.tsx");
const editProfile = read("src/features/profile/screens/EditProfileScreen.tsx");
const screenHeader = read("src/components/ui/ScreenHeader.tsx");

if (!report.includes('padded={false}') || !report.includes('paddingHorizontal: LAYOUT.screenPadding')) fail("Create Report must use exactly one application screen gutter.");
else pass("Create Report uses the canonical screen gutter without double padding.");

if (/<AppText[^>]*size=/.test(report)) fail("Create Report still uses numeric AppText sizes instead of typography variants.");
else pass("Create Report text uses semantic typography variants.");

if (/width:\s*12[0-9]|height:\s*12[0-9]/.test(profileHeader + editProfile)) fail("Profile avatar scale regressed to oversized 120px+ dimensions.");
else pass("Profile avatars stay within the compact account scale.");

if (/fontSize:\s*28/.test(profileHeader + profileStats)) fail("Profile hero/stat typography regressed to oversized 28px text.");
else pass("Profile hero and statistics use the shared typography scale.");

if (/FONT_SIZES\./.test(screenHeader)) fail("ScreenHeader must use semantic typography variants, not legacy FONT_SIZES.");
else pass("ScreenHeader uses semantic typography variants.");

if (/<AppText[^>]*size=/.test(profileHeader + profileStats)) fail("Profile summary components must not use numeric AppText sizes.");
else pass("Profile summary components use semantic typography variants.");
