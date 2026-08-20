import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const required = [
  "src/features/adoption/screens/AdoptionListingApplicationsScreen.tsx",
  "src/features/adoption/screens/OwnerAdoptionApplicationDetailsScreen.tsx",
  "src/features/adoption/hooks/useListingApplications.ts",
  "src/features/adoption/hooks/useOwnerAdoptionApplication.ts",
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing Package 40 file: ${file}`);
}
const repo = read("src/data/repositories/inMemoryAdoptionApplicationRepository.ts");
for (const token of ["acceptForListingOwner", "rejectForListingOwner", '"not_selected"', "reserveOwned"]) {
  if (!repo.includes(token)) throw new Error(`Owner decision repository contract missing: ${token}`);
}
const listingRepo = read("src/data/repositories/inMemoryAdoptionRepository.ts");
if (!listingRepo.includes('status: "reserved"')) throw new Error("Accepted adoption must reserve the listing.");
const routes = read("src/navigation/routes.ts");
for (const token of ["adoptionListingApplicationsRoute", "adoptionListingApplicationDetailsRoute"]) {
  if (!routes.includes(token)) throw new Error(`Missing owner application route helper: ${token}`);
}
const details = read("src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx");
if (!details.includes("applications.length") || !details.includes("adoptionListingApplicationsRoute")) {
  throw new Error("Owned listing dashboard must show real application count and route to applicants.");
}
console.log("✓ Package 40 adoption applicants + owner decision contract passed");
