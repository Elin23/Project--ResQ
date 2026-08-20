import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = ["src", "app"];
const files = [];
function walk(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.isFile() && [".ts", ".tsx"].includes(path.extname(rel))) files.push(rel);
  }
}
for (const dir of roots) walk(dir);

const failures = [];
let physicalPositionCount = 0;
let rtlRows = 0;
let ltrRows = 0;
let totalRows = 0;

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (/flexDirection\s*:\s*["']row-reverse["']/.test(source)) {
    failures.push(`${file}: row-reverse is forbidden; use row + explicit direction`);
  }
  physicalPositionCount += (source.match(/\b(?:left|right)\s*:/g) || []).length;

  const lines = source.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!/flexDirection\s*:\s*["']row["']/.test(lines[index])) continue;
    totalRows += 1;
    const window = lines.slice(index, index + 4).join(" ");
    if (/direction\s*:\s*(?:["']rtl["']|ARABIC_LAYOUT\.direction)/.test(window)) rtlRows += 1;
    else if (/direction\s*:\s*["']ltr["']/.test(window)) ltrRows += 1;
    else failures.push(`${file}:${index + 1}: every row must declare direction: rtl or ltr explicitly`);
  }
}

const reportFile = "src/features/reports/components/ReportDetailsScreen.tsx";
const report = fs.readFileSync(path.join(root, reportFile), "utf8");
const reportContracts = [
  ["titleRow", /titleRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
  ["metaWrap", /metaWrap:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
  ["twoColumnRow", /twoColumnRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
  ["timelineRow", /timelineRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
  ["personRow", /personRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
  ["commentRow", /commentRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s],
];
for (const [name, pattern] of reportContracts) if (!pattern.test(report)) failures.push(`${reportFile}: ${name} is missing the logical RTL row contract`);

const titleIndex = report.indexOf('<AppText variant="h1"');
const urgentIndex = report.indexOf('<StatusBadge label="حالة عاجلة"');
if (titleIndex < 0 || urgentIndex < 0 || titleIndex > urgentIndex) failures.push(`${reportFile}: main Arabic title must be the first logical child; urgency badge belongs on the opposite edge`);
if (!/statusRow:\s*\{[^}]*direction:\s*["']rtl["']/s.test(report)) failures.push(`${reportFile}: status badge row must anchor to Arabic start edge`);
if (!/timelineRow:\s*\{[^}]*direction:\s*["']rtl["']/s.test(report)) failures.push(`${reportFile}: timeline rail must be driven by the logical RTL row contract`);
if (/timelineCopy:\s*\{[^}]*alignItems:\s*["']flex-end["']/s.test(report)) failures.push(`${reportFile}: timeline text block must stretch, not shrink-align to flex-end`);
if (/locationCopy:\s*\{[^}]*alignItems:\s*["']flex-end["']/s.test(report)) failures.push(`${reportFile}: location text block must stretch, not shrink-align to flex-end`);

const orgCard = fs.readFileSync(path.join(root, "src/features/organizations/components/OrganizationCard.tsx"), "utf8");
const infoIndex = orgCard.indexOf('<View style={styles.info}>');
const imageIndex = orgCard.indexOf('<Image source={organization.image}');
if (infoIndex < 0 || imageIndex < 0 || infoIndex > imageIndex) failures.push("OrganizationCard: content block must precede side image so Arabic title starts from the card start edge");
if (!orgCard.includes('info: { flex: 1, minWidth: 0, alignItems: "stretch" }')) failures.push("OrganizationCard: text container must stretch instead of shrink-aligning to an edge");

const contentBlock = fs.readFileSync(path.join(root, "src/components/ui/ContentBlock.tsx"), "utf8");
if (!contentBlock.includes('alignItems: "stretch"')) failures.push("ContentBlock must stretch text blocks so right-aligned Arabic text owns the full width");

if (failures.length) {
  console.error("RTL combination audit failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`RTL combination audit passed: ${files.length} TS/TSX files scanned; ${totalRows} explicit rows (${rtlRows} RTL, ${ltrRows} intentionally LTR), 0 row-reverse declarations. ${physicalPositionCount} physical left/right coordinates remain classified for overlays/maps/decorative positioning.`);
