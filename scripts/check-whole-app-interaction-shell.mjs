import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const passes = [];
const fail = (message) => failures.push(message);
const pass = (message) => passes.push(message);

const tsxFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.endsWith(".tsx")) tsxFiles.push(rel);
  }
}
walk("app");
walk("src");

let deadControls = 0;
for (const file of tsxFiles) {
  const source = read(file);
  for (const tag of ["Pressable", "TouchableOpacity"]) {
    const regex = new RegExp(`<${tag}\\b([^>]*)>`, "gs");
    for (const match of source.matchAll(regex)) {
      const attrs = match[1];
      if (!attrs.includes("onPress=") && !attrs.includes("disabled")) {
        deadControls += 1;
        fail(`${file}: ${tag} without onPress`);
      }
    }
  }
}
if (!deadControls) pass(`0 dead Pressable/TouchableOpacity controls across ${tsxFiles.length} TSX files`);

const shellAware = "src/components/ui/ShellAwareScrollView.tsx";
if (!exists(shellAware)) {
  fail("ShellAwareScrollView primitive is missing");
} else {
  const source = read(shellAware);
  if (!source.includes("useFloatingNavigation") || !source.includes("contentBottomInset")) {
    fail("ShellAwareScrollView must derive clearance from FloatingNavigationContext");
  } else {
    pass("ShellAwareScrollView owns floating-navbar scroll clearance");
  }
}

const shellReadingSurfaces = [
  ["src/features/search/screens/SearchScreen.tsx", "ShellAwareScrollView"],
  ["src/features/public/screens/AboutScreen.tsx", "ShellAwareScrollView"],
  ["src/features/public/screens/HelpCenterScreen.tsx", "ShellAwareScrollView"],
  ["src/features/public/screens/PrivacyPolicyScreen.tsx", "ShellAwareScrollView"],
  ["src/features/public/screens/TermsAndConditionsScreen.tsx", "ShellAwareScrollView"],
  ["src/features/reports/components/ReportDetailsScreen.tsx", "<Screen"],
];
for (const [file, contract] of shellReadingSurfaces) {
  if (!read(file).includes(contract)) fail(`${file} is not shell-aware (${contract})`);
}
if (!failures.some((item) => item.includes("shell-aware"))) pass(`${shellReadingSurfaces.length} high-risk reading surfaces clear the floating navbar`);

const reportDetails = read("src/features/reports/components/ReportDetailsScreen.tsx");
for (const token of ["ScreenHeader", 'accessibilityLabel="مشاركة البلاغ"', "organizationDetailsRoute", "setSaved"]) {
  if (!reportDetails.includes(token)) fail(`Report details interaction/header contract missing ${token}`);
}
if (!failures.some((item) => item.startsWith("Report details"))) pass("Report details uses the shared header and real share/profile/save actions");

const createReport = read("src/features/reports/components/CreateReportForm.tsx");
for (const token of ["expo-image-picker", "expo-location", "handlePickImages", "handleUseCurrentLocation", "handleChooseAnimalType", "imageUrl: selectedImages[0]", "ROUTES.helpCenter"]) {
  if (!createReport.includes(token)) fail(`Create Report interaction contract missing ${token}`);
}
if (createReport.includes("mapPickerBtn")) fail("Create Report still exposes a map-picker button without a dedicated interaction flow");
if (!failures.some((item) => item.startsWith("Create Report"))) pass("Create Report upload/location/type/help affordances are wired to real actions");

const helpCenter = read("src/features/public/screens/HelpCenterScreen.tsx");
for (const forbidden of ["المحتوى قيد التجهيز", "سيتم ربط هذه المقالة", "قاعدة المعرفة عند إضافة محتوى الدعم النهائي"]) {
  if (helpCenter.includes(forbidden)) fail(`Help Center leaks developer-facing copy: ${forbidden}`);
}
if (!helpCenter.includes("openPublicRoute") || !helpCenter.includes("focusCategory")) fail("Help Center navigation/filter actions are not wired");
else pass("Help Center contains no placeholder navigation alert");

const workspaceLayouts = [
  "app/(user)/(tabs)/_layout.tsx",
  "app/organization/(tabs)/_layout.tsx",
];
for (const file of workspaceLayouts) {
  const source = read(file);
  if (!source.includes("FloatingNavigationProvider") || !source.includes("FloatingGlassTabBar")) {
    fail(`${file} is missing the shared floating navigation shell`);
  }
}
if (!failures.some((item) => item.includes("floating navigation shell"))) pass("User and organization share the same floating navigation shell");

const shellPolicy = read("src/navigation/shellVisibilityPolicy.ts");
for (const token of ["reports\\/create", "profile\\/edit", "contact-us", "organization\\/tasks"] ) {
  if (!shellPolicy.includes(token)) fail(`Shell visibility policy missing focus-flow pattern ${token}`);
}

const forbiddenRuntimeCopy = [
  /المحتوى قيد التجهيز/,
  /سيتم ربط .*لاحق/,
  /Repository مستقل/,
  /يمكن استبداله لاحقًا بـAPI/,
  /البيانات الحالية تجريبية/,
];
for (const file of tsxFiles) {
  const source = read(file);
  for (const pattern of forbiddenRuntimeCopy) {
    if (pattern.test(source) && !source.trimStart().startsWith("/**")) {
      fail(`${file} contains runtime/developer placeholder copy matching ${pattern}`);
    }
  }
}
if (!failures.some((item) => item.includes("runtime/developer"))) pass("No known developer/demo placeholder copy remains in TSX surfaces");

for (const message of passes) console.log(`✔ ${message}`);
if (failures.length) {
  console.error("Whole-app interaction & shell QA failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Whole-app interaction & shell QA passed.");
