import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "src"];
const VALID_VARIANTS = new Set([
  "primary",
  "secondary",
  "outline",
  "danger",
  "text",
  "ghost",
  "custom",
]);
const VALID_SIZES = new Set(["small", "medium", "large"]);
const extensions = new Set([".tsx", ".ts"]);
const errors = [];
let filesChecked = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) checkFile(full);
  }
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function checkFile(file) {
  filesChecked += 1;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/<Button\b[\s\S]*?>/g)) {
    const tag = match[0];
    const variant = tag.match(/\bvariant\s*=\s*["']([^"']+)["']/);
    const size = tag.match(/\bsize\s*=\s*["']([^"']+)["']/);
    if (variant && !VALID_VARIANTS.has(variant[1])) {
      errors.push(`${file}:${lineNumber(text, match.index)} invalid Button variant "${variant[1]}"`);
    }
    if (size && !VALID_SIZES.has(size[1])) {
      errors.push(`${file}:${lineNumber(text, match.index)} invalid Button size "${size[1]}"`);
    }
  }
}

for (const root of ROOTS) walk(root);

if (errors.length) {
  console.error("Button props check failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Button props check passed: ${filesChecked} files, 0 invalid variants/sizes`);
