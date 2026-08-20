import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const requireFile = (file) => { if (!exists(file)) failures.push(`Missing required file: ${file}`); };
const requireText = (file, text, label = text) => {
  if (!exists(file) || !read(file).includes(text)) failures.push(`${file}: missing ${label}`);
};

[
  "app/adoptions/create.tsx",
  "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  "src/features/adoption/components/AdoptionLocationPicker.tsx",
  "src/features/adoption/components/AdoptionLocationPicker.native.tsx",
  "src/features/adoption/hooks/useCreateAdoptionListing.ts",
  "src/domain/adoption/adoption.ts",
].forEach(requireFile);

requireText("app/adoptions/create.tsx", 'capability="create-adoption-listing"', "create-adoption-listing capability gate");
requireText("src/features/adoption/screens/CreateAdoptionListingScreen.tsx", "allowsMultipleSelection: true", "multi-image selection");
requireText("src/features/adoption/screens/CreateAdoptionListingScreen.tsx", "إضافة صفة", "dynamic traits");
requireText("src/features/adoption/screens/CreateAdoptionListingScreen.tsx", "healthChecklist", "health checklist");
requireText("src/features/adoption/screens/CreateAdoptionListingScreen.tsx", "AdoptionLocationPicker", "precise map location picker");
requireText("src/features/adoption/screens/CreateAdoptionListingScreen.tsx", "معلومات التواصل", "contact section");
requireText("src/features/adoption/hooks/useCreateAdoptionListing.ts", "repositories.adoption.submit", "repository-backed submission");
requireText("src/data/repositories/inMemoryAdoptionRepository.ts", 'moderationStatus: "pending_review"', "pending moderation default");
requireText("src/data/repositories/inMemoryAdoptionRepository.ts", "isPubliclyVisible", "public moderation filter");
requireText("src/features/adoption/screens/AdoptionScreen.tsx", 'can("create-adoption-listing")', "create CTA permission visibility");
requireText("src/features/organization-dashboard/hooks/useOrganizationDashboard.ts", "openAdoptionListings", "organization access to adoption listing management and creation");
requireText("src/features/session/accessPolicy.ts", 'guest: new Set(["browse", "create-report", "view-adoption"])', "guest exclusion");

const model = read("src/domain/adoption/adoption.ts");
for (const field of ["images", "animalName", "animalType", "age", "gender", "traits", "weight", "color", "size", "breed", "healthCondition", "healthChecklist", "location", "contact"]) {
  if (!model.includes(`${field}:`) && !model.includes(`${field}?:`)) failures.push(`Adoption domain missing ${field}`);
}

if (failures.length) {
  console.error("Adoption listing creation check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Adoption listing creation check passed: authenticated creation, rich animal profile, multi-image media, dynamic traits, health checklist, precise location, contact data, and pending moderation are wired.");
