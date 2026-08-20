import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "src"];
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

const files = sourceRoots.flatMap(collect).filter((file) => !ignored.has(path.normalize(file)));
let hex = 0;
let fontSize = 0;
let radius = 0;
for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  hex += (source.match(/#[0-9A-Fa-f]{6,8}\b/g) ?? []).length;
  fontSize += (source.match(/\bfontSize\s*:\s*\d+/g) ?? []).length;
  radius += (source.match(/\bborderRadius\s*:\s*\d+/g) ?? []).length;
}

// Package 04 establishes a ratchet: legacy debt may be migrated progressively,
// but future changes are not allowed to increase it.
const limits = { hex: 848, fontSize: 277, radius: 240 };
const errors = [];
if (hex > limits.hex) errors.push(`hardcoded colors increased: ${hex} > ${limits.hex}`);
if (fontSize > limits.fontSize) errors.push(`literal fontSize values increased: ${fontSize} > ${limits.fontSize}`);
if (radius > limits.radius) errors.push(`literal borderRadius values increased: ${radius} > ${limits.radius}`);

const requiredThemeTokens = ["PALETTE", "COLORS", "TYPOGRAPHY", "SPACING", "RADIUS", "CONTROL_SIZES", "ICON_SIZES", "DENSITY", "LAYOUT", "SHADOWS"];
const theme = fs.readFileSync(path.join(root, "src/theme/index.ts"), "utf8");
for (const token of requiredThemeTokens) {
  if (!theme.includes(`export const ${token}`)) errors.push(`missing design-system token group: ${token}`);
}

if (errors.length) {
  console.error("Design system check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Design system check passed.");
console.log(`- hardcoded colors: ${hex}/${limits.hex}`);
console.log(`- literal font sizes: ${fontSize}/${limits.fontSize}`);
console.log(`- literal radii: ${radius}/${limits.radius}`);
console.log("- semantic token groups: present");
