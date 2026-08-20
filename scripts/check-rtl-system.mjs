import fs from "node:fs";
import path from "node:path";

const roots = ["src", "app"];
const extensions = new Set([".ts", ".tsx"]);
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
}
for (const root of roots) walk(root);

const issues = [];
let rtlDeclarations = 0;
let leftAlignments = 0;
let rightAlignments = 0;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  rtlDeclarations += (source.match(/writingDirection\s*:\s*["']rtl["']/g) ?? []).length;
  leftAlignments += (source.match(/textAlign\s*:\s*["']left["']/g) ?? []).length;
  rightAlignments += (source.match(/textAlign\s*:\s*["']right["']/g) ?? []).length;

  if (/textAlign\s*:\s*["']left["'][^}]*writingDirection\s*:\s*["']rtl["']/.test(source)) {
    issues.push(`${file}: contradictory textAlign:left + writingDirection:rtl`);
  }

  if (/writingDirection\s*:\s*["']rtl["'][^}]*textAlign\s*:\s*["']left["']/.test(source)) {
    issues.push(`${file}: contradictory writingDirection:rtl + textAlign:left`);
  }
}

const appText = fs.readFileSync("src/components/ui/AppText.tsx", "utf8");
if (!appText.includes('direction = APP_DIRECTION')) issues.push("AppText must default to APP_DIRECTION.");
if (!appText.includes('writingDirection: direction')) issues.push("AppText must apply writingDirection.");

const input = fs.readFileSync("src/components/ui/Input.tsx", "utf8");
if (!input.includes('contentDirection = "auto"')) issues.push("Input must default contentDirection to auto.");
if (!input.includes("resolveInputDirection")) issues.push("Input must resolve Arabic/LTR content direction centrally.");

const rtl = fs.readFileSync("src/i18n/rtl.ts", "utf8");
for (const keyboard of ["email-address", "phone-pad", "numeric", "decimal-pad", "url"]) {
  if (!rtl.includes(`"${keyboard}"`)) issues.push(`RTL input resolver is missing ${keyboard}.`);
}

console.log(`RTL declarations: ${rtlDeclarations}`);
console.log(`Left text alignments: ${leftAlignments}`);
console.log(`Right text alignments: ${rightAlignments}`);

if (issues.length) {
  console.error("RTL system check failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}
console.log("RTL system check passed.");
