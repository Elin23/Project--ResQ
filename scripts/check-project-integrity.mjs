import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "src"];
const extensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".png", ".jpg", ".jpeg", ".webp"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    return entry.isDirectory() ? walk(relativePath) : [relativePath];
  });
}

function resolveLocalImport(importer, specifier) {
  const base = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(root, path.dirname(importer), specifier);

  const candidates = [
    base,
    ...extensions.map((extension) => `${base}${extension}`),
    ...extensions.map((extension) => path.join(base, `index${extension}`)),
  ];

  return candidates.some((candidate) => fs.existsSync(candidate));
}

function routeVariants(file) {
  const withoutExtension = file.replace(/^app[\\/]/, "").replace(/\.(?:tsx?|jsx?)$/, "");
  if (withoutExtension.endsWith("_layout") || withoutExtension.startsWith("+")) return [];

  const segments = withoutExtension.split(/[\\/]/);
  if (segments.at(-1) === "index") segments.pop();

  const explicitRoute = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  const publicSegments = segments.filter((segment) => !/^\(.+\)$/.test(segment));
  const publicRoute = `/${publicSegments.join("/")}`.replace(/\/$/, "") || "/";

  return [...new Set([explicitRoute, publicRoute])];
}

const files = sourceRoots.flatMap(walk);
const sourceFiles = files.filter((file) => sourceExtensions.has(path.extname(file)));
const emptySourceFiles = sourceFiles.filter((file) => fs.statSync(path.join(root, file)).size === 0);
const missingImports = [];
const missingRoutes = [];
const importPattern = /(?:from\s+|import\s*\(|require\s*\()\s*["']([^"']+)["']/g;
const routePattern = /(?:router\.(?:push|replace|navigate)\(\s*|pathname\s*:\s*)["'](\/[^"']*)["']/g;
const knownRoutes = new Set(
  files
    .filter((file) => file.startsWith(`app${path.sep}`) && sourceExtensions.has(path.extname(file)))
    .flatMap(routeVariants),
);

for (const file of sourceFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");

  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if ((specifier.startsWith(".") || specifier.startsWith("@/")) && !resolveLocalImport(file, specifier)) {
      missingImports.push(`${file}: ${specifier}`);
    }
  }

  for (const match of content.matchAll(routePattern)) {
    const route = match[1].split("?")[0];
    if (!route.includes("[") && !knownRoutes.has(route)) {
      missingRoutes.push(`${file}: ${route}`);
    }
  }
}

if (emptySourceFiles.length || missingImports.length || missingRoutes.length) {
  if (emptySourceFiles.length) {
    console.error("Empty source files:");
    emptySourceFiles.forEach((file) => console.error(`- ${file}`));
  }
  if (missingImports.length) {
    console.error("Missing local imports/assets:");
    missingImports.forEach((item) => console.error(`- ${item}`));
  }
  if (missingRoutes.length) {
    console.error("Unknown literal routes:");
    missingRoutes.forEach((item) => console.error(`- ${item}`));
  }
  process.exit(1);
}

console.log(
  `Integrity check passed: ${sourceFiles.length} source files, ${knownRoutes.size} route variants, 0 empty files, 0 missing local imports/assets, 0 unknown literal routes.`,
);
