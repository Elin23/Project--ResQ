import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const mustExist = [
  "src/domain/adoption/adoptionApplication.ts",
  "src/domain/adoption/adoptionApplicationRepository.ts",
  "src/data/repositories/inMemoryAdoptionApplicationRepository.ts",
  "src/features/adoption/screens/AdoptionApplicationScreen.tsx",
  "src/features/adoption/screens/MyAdoptionApplicationsScreen.tsx",
  "src/features/adoption/screens/AdoptionApplicationStatusScreen.tsx",
  "app/adoptions/[id]/apply.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/my-applications/index.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/my-applications/[applicationId].tsx",
];
for (const file of mustExist) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing adoption application file: ${file}`);
}

const details = read("src/features/adoption/screens/AdoptionDetailsScreen.tsx");
if (details.includes("ROUTES.contactUs")) throw new Error("Adoption CTA must not route to Contact Us");
if (!details.includes("adoptionApplyRoute")) throw new Error("Adoption CTA must route to the application flow");

const repo = read("src/data/repositories/inMemoryAdoptionApplicationRepository.ts");
for (const token of ["status: \"pending\"", "getByApplicant", "listByApplicant", "listByListing", "adoptionRepository.getById"]) {
  if (!repo.includes(token)) throw new Error(`Application repository missing contract: ${token}`);
}

const adoptionRepo = read("src/data/repositories/inMemoryAdoptionRepository.ts");
if (!adoptionRepo.includes("publicClone") || !adoptionRepo.includes('phone: ""')) {
  throw new Error("Public adoption reads must redact private owner contact");
}

const applyRoute = read("app/adoptions/[id]/apply.tsx");
if (!applyRoute.includes("AuthenticatedRouteGate") || !applyRoute.includes('capability="apply-adoption"')) {
  throw new Error("Adoption application route must be authenticated and capability-protected");
}

console.log("Adoption applications workflow check passed.");
