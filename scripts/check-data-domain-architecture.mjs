import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const required = [
  "src/domain/index.ts",
  "src/domain/reports/reportRepository.ts",
  "src/domain/rescue/rescueRepository.ts",
  "src/domain/service-places/servicePlaceRepository.ts",
  "src/domain/adoption/adoptionRepository.ts",
  "src/services/domain/repositories.ts",
  "src/services/domain/services.ts",
  "src/application/rescue/RescueOperationsService.ts",
  "src/hooks/useAsyncResource.ts",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) errors.push(`missing architecture file: ${rel}`);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const domainDir = path.join(root, "src/domain");
for (const file of walk(domainDir).filter((file) => /\.tsx?$/.test(file))) {
  const text = fs.readFileSync(file, "utf8");
  if (/from\s+["'](?:react|react-native|expo-router)/.test(text)) {
    errors.push(`domain layer depends on UI/runtime framework: ${path.relative(root, file)}`);
  }
}

const screenDirs = ["src/features/organization-dashboard/screens", "src/features/adoption/screens", "src/features/map-places/screens"];
for (const rel of screenDirs) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir).filter((file) => file.endsWith(".tsx"))) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("/data/seeds/") || text.includes("/data/repositories/")) {
      errors.push(`screen bypasses hooks/services and imports data implementation directly: ${path.relative(root, file)}`);
    }
  }
}

const orgReports = fs.readFileSync(path.join(root, "src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx"), "utf8");
if (!orgReports.includes("useOrganizationReports")) errors.push("organization reports screen is not repository-backed");
const adoption = fs.readFileSync(path.join(root, "src/features/adoption/hooks/useAdoptionListings.ts"), "utf8");
if (!adoption.includes("repositories.adoption")) errors.push("adoption feature is not repository-backed");
const personalReports = fs.readFileSync(path.join(root, "src/features/reports/hooks/useMyReports.ts"), "utf8");
if (!personalReports.includes("repositories.reports")) errors.push("personal reports are not repository-backed");
const submitReport = fs.readFileSync(path.join(root, "src/features/reports/hooks/useSubmitReport.ts"), "utf8");
if (!submitReport.includes("repositories.reports.create")) errors.push("report submission does not persist through repository");
const rescueService = fs.readFileSync(path.join(root, "src/application/rescue/RescueOperationsService.ts"), "utf8");
if (!rescueService.includes("createFromReport") || !rescueService.includes("ReportRepository")) errors.push("cross-domain report-to-rescue workflow is missing");

if (errors.length) {
  console.error("Data/domain architecture check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Data/domain architecture check passed.");
console.log("- domain contracts: isolated from UI frameworks");
console.log("- repository composition root: present");
console.log("- report -> rescue orchestration: service-backed");
console.log("- personal reports + submission: repository-backed");
console.log("- organization, map-place, and adoption screens: repository-backed through hooks/services");
