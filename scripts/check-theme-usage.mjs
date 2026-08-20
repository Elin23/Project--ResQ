import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const themePath = path.join(projectRoot, "src", "theme", "index.ts");
const themeNames = [
  "PALETTE",
  "COLORS",
  "FONTS",
  "FONT_SIZES",
  "TYPOGRAPHY",
  "SPACING",
  "RADIUS",
  "CONTROL_SIZES",
  "ICON_SIZES",
  "LAYOUT",
  "SHADOWS",
];

function listSourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules") return [];
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const themeSource = fs.readFileSync(themePath, "utf8");
const themeKeys = new Map();

for (const themeName of themeNames) {
  const objectMatch = themeSource.match(
    new RegExp(`export\\s+const\\s+${themeName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}\\s*(?:as\\s+const)?\\s*;`),
  );
  if (!objectMatch) throw new Error(`Unable to read ${themeName} from src/theme/index.ts`);

  const keys = new Set();
  for (const match of objectMatch[1].matchAll(/^\s*["']?([A-Za-z_$][\w$]*|\d+xl)["']?\s*:/gm)) {
    keys.add(match[1]);
  }
  themeKeys.set(themeName, keys);
}

const files = [
  ...listSourceFiles(path.join(projectRoot, "app")),
  ...listSourceFiles(path.join(projectRoot, "src")),
];
const errors = [];

for (const filePath of files) {
  const source = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(projectRoot, filePath);

  for (const themeName of themeNames) {
    const accessRegex = new RegExp(`\\b${escapeRegex(themeName)}\\.([A-Za-z_$][\\w$]*)`, "g");
    const accesses = [...source.matchAll(accessRegex)];
    if (accesses.length === 0) continue;

    const hasThemeImport = new RegExp(
      `import\\s*\\{[\\s\\S]*?\\b${escapeRegex(themeName)}\\b[\\s\\S]*?\\}\\s*from\\s*["'][^"']*(?:src/theme|theme(?:/index)?)["']`,
    ).test(source);
    const hasLocalDeclaration = new RegExp(`\\b(?:const|let|var|function|class)\\s+${escapeRegex(themeName)}\\b`).test(source);

    if (!hasThemeImport && !hasLocalDeclaration && filePath !== themePath) {
      errors.push(`${relativePath} uses ${themeName} without importing it from @/src/theme`);
    }

    for (const access of accesses) {
      const property = access[1];
      if (!themeKeys.get(themeName)?.has(property)) {
        const line = source.slice(0, access.index).split("\n").length;
        errors.push(`${relativePath}:${line} uses missing property ${themeName}.${property}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Theme usage check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Theme usage check passed: ${files.length} files, no missing theme imports or properties.`);
