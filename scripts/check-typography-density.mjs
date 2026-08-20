import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const extensions = new Set([".ts", ".tsx"]);
const ignored = new Set([path.normalize("src/theme/index.ts")]);

function collect(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return collect(rel);
    return extensions.has(path.extname(entry.name)) ? [rel] : [];
  });
}

const files = ["app", "src"].flatMap(collect).filter((file) => !ignored.has(path.normalize(file)));
let oversizedType = 0;
let oversizedLeading = 0;
let literalFontSize = 0;

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  literalFontSize += (source.match(/\bfontSize\s*:\s*\d+/g) ?? []).length;
  oversizedType += (source.match(/\bfontSize\s*:\s*(?:2[5-9]|[3-9]\d)\b/g) ?? []).length;
  oversizedLeading += (source.match(/\blineHeight\s*:\s*(?:3[4-9]|[4-9]\d)\b/g) ?? []).length;
}

const theme = fs.readFileSync(path.join(root, "src/theme/index.ts"), "utf8");
const required = ["TYPOGRAPHY", "FONT_SIZES", "CONTROL_SIZES", "DENSITY", "LAYOUT"];
const errors = [];
for (const token of required) {
  if (!theme.includes(`export const ${token}`)) errors.push(`missing density token group: ${token}`);
}

// Package 06 establishes a density ratchet. Hero/display text may remain large,
// but feature screens should not reintroduce oversized local typography.
if (oversizedType > 4) errors.push(`oversized literal typography increased: ${oversizedType} > 4`);
if (oversizedLeading > 2) errors.push(`oversized literal line-height increased: ${oversizedLeading} > 2`);
if (literalFontSize > 277) errors.push(`literal font-size debt increased: ${literalFontSize} > 277`);

if (errors.length) {
  console.error("Typography & density check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Typography & density check passed.");
console.log(`- oversized literal font sizes: ${oversizedType}/4`);
console.log(`- oversized literal line heights: ${oversizedLeading}/2`);
console.log(`- literal font-size debt: ${literalFontSize}/277`);
console.log("- typography/density token groups: present");
