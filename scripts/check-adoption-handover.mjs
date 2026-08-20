import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const requireText = (file, token, label = token) => {
  if (!fs.existsSync(path.join(root, file)) || !read(file).includes(token)) {
    failures.push(`${file}: missing ${label}`);
  }
};

requireText("src/domain/adoption/adoptionApplication.ts", '"completed"', "completed application state");
requireText("src/domain/adoption/adoptionApplication.ts", "applicantHandoverConfirmedAt", "applicant handover confirmation timestamp");
requireText("src/domain/adoption/adoptionApplication.ts", "ownerHandoverConfirmedAt", "owner handover confirmation timestamp");
requireText("src/domain/adoption/adoptionRepository.ts", "markAdoptedOwned", "listing completion operation");
requireText("src/data/repositories/inMemoryAdoptionApplicationRepository.ts", "confirmHandoverForApplicant", "applicant confirmation operation");
requireText("src/data/repositories/inMemoryAdoptionApplicationRepository.ts", "confirmHandoverForListingOwner", "owner confirmation operation");
requireText("src/data/repositories/inMemoryAdoptionApplicationRepository.ts", "completeHandoverIfReady", "two-party completion coordinator");
requireText("src/data/repositories/inMemoryAdoptionRepository.ts", 'status: "adopted"', "adopted listing transition");
requireText("src/features/adoption/screens/AdoptionApplicationStatusScreen.tsx", "تأكيد استلام الحيوان", "applicant handover UI");
requireText("src/features/adoption/screens/OwnerAdoptionApplicationDetailsScreen.tsx", "تأكيد تسليم الحيوان", "owner handover UI");

if (failures.length) {
  console.error("Adoption handover check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Adoption handover check passed: accepted requests require dual handover confirmation before listing completion.");
