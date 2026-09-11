import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const sourceFiles = [];

function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.isFile()) sourceFiles.push(rel);
  }
}

walk("src");
walk("app");

const codeFiles = sourceFiles.filter((file) => /\.(?:ts|tsx|js|mjs)$/.test(file));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const must = (file, token, label = token) => {
  if (!fs.existsSync(path.join(root, file)) || !read(file).includes(token)) {
    failures.push(`${file}: missing ${label}`);
  }
};

// No temp/editor artifacts in source.
for (const file of sourceFiles) {
  if (/\.(?:tmp|bak|orig|old)$/.test(file) || /(?:^|\/)(?:copy|backup|temp|tmp)(?:\/|$)/i.test(file)) {
    failures.push(`${file}: temporary/backup artifact`);
  }
}

// No suppressive TypeScript escape hatches, debug logs, or stale TODO/FIXME markers.
for (const file of codeFiles) {
  const source = read(file);
  if (/@ts-ignore|@ts-nocheck/.test(source)) failures.push(`${file}: TypeScript suppression`);
  if (/\bas\s+never\b/.test(source)) failures.push(`${file}: 'as never' suppression`);
  if (/\bconsole\.log\s*\(/.test(source)) failures.push(`${file}: console.log`);
  if (/\b(?:TODO|FIXME|HACK)\b/.test(source)) failures.push(`${file}: unresolved TODO/FIXME/HACK`);
}

// Final naming: production detail screens must not retain compatibility "PreviewScreen" shims.
for (const obsolete of [
  "src/features/donations/screens/DonationCampaignPreviewScreen.tsx",
  "src/features/donations/screens/DonationTransferPreviewScreen.tsx",
]) {
  if (fs.existsSync(path.join(root, obsolete))) failures.push(`${obsolete}: obsolete preview compatibility screen`);
}

must("src/features/donations/screens/DonationCampaignDetailsScreen.tsx", "export default function DonationCampaignDetailsScreen", "canonical campaign details screen");
must("src/features/donations/screens/DonationTransferDetailsScreen.tsx", "export default function DonationTransferDetailsScreen", "canonical donation transfer details screen");

// Production runtime is API-only: mocks may exist as isolated test fixtures but must not be selectable at runtime.
must("src/constants/config.ts", 'runtimeMode: "api-only"', "explicit API-only runtime mode");
for (const file of codeFiles) {
  if (file.includes("/__tests__/") || /\.test\.[jt]sx?$/.test(file) || file.startsWith("test-fixtures/")) continue;
  const source = read(file);
  if (/\buseMockApi\b|\bUSE_MOCKS\b/.test(source)) failures.push(`${file}: runtime mock-mode switch is forbidden`);
  if (/inMemory[A-Z]|InMemory[A-Z]/.test(source)) failures.push(`${file}: production source references an in-memory repository`);
}

// No obvious embedded credentials.
for (const file of codeFiles) {
  const source = read(file);
  const secretPattern = /(?:api[_-]?key|client[_-]?secret|private[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["']/i;
  if (secretPattern.test(source)) failures.push(`${file}: possible embedded credential`);
}
must(".env.example", "GOOGLE_MAPS_API_KEY=", "maps environment variable template");

// Core final regression gates stay present in package scripts.
const pkg = JSON.parse(read("package.json"));
for (const script of [
  "check:integrity",
  "check:navigation",
  "check:ui-consistency",
  "check:roles-e2e",
  "check:production",
]) {
  if (!pkg.scripts?.[script]) failures.push(`package.json: missing ${script}`);
}

// Source RC must document that mock mode is not equivalent to backend-connected production.
must("README.md", "API-only", "API-only integration disclosure");
must("README.md", "resqmob.runasp.net", "hosted API disclosure");
must("PRODUCTION-READINESS.md", "V1 Mobile RC integration boundary", "production integration boundary");

if (failures.length) {
  console.error("Final Mobile RC check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(
  `Final Mobile RC check passed: ${sourceFiles.length} app/src files; no temp artifacts, TS suppressions, console.log, stale TODO/FIXME, embedded credentials, or obsolete donation preview shims; runtime is API-only and the hosted integration boundary is documented.`,
);
