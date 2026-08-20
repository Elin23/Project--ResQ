import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const required = [
  "src/domain/moderation/moderation.ts",
  "src/domain/shared/ownership.ts",
  "src/domain/feeding-points/feedingPointSubmission.ts",
  "src/domain/feeding-points/feedingPointSubmissionRepository.ts",
  "src/data/repositories/inMemoryFeedingPointSubmissionRepository.ts",
  "src/data/repositories/inMemoryAdoptionRepository.ts",
];

const errors = [];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
}

if (!errors.length) {
  const moderation = read("src/domain/moderation/moderation.ts");
  const access = read("src/features/session/accessPolicy.ts");
  const adoptionRepo = read("src/data/repositories/inMemoryAdoptionRepository.ts");
  const feedingRepo = read("src/data/repositories/inMemoryFeedingPointSubmissionRepository.ts");
  const accountModel = read("src/types/accounts.ts");

  for (const state of ["draft", "pending_review", "approved", "rejected", "archived"]) {
    if (!moderation.includes(`"${state}"`)) errors.push(`Moderation lifecycle missing ${state}`);
  }
  if (!moderation.includes("A rejection reason is required")) errors.push("Rejected content must require a reason");
  if (!adoptionRepo.includes("isPubliclyVisible")) errors.push("Public adoption queries must filter by moderation status");
  if (!feedingRepo.includes("listPendingReview")) errors.push("Feeding submissions need a moderation queue contract");

  for (const cap of ["create-feeding-point", "create-adoption-listing", "view-own-submissions", "review-feeding-points", "review-adoption-listings"]) {
    if (!access.includes(`"${cap}"`)) errors.push(`Missing capability ${cap}`);
  }

  const guestBlock = access.match(/guest:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
  if (guestBlock.includes("create-feeding-point") || guestBlock.includes("create-adoption-listing")) {
    errors.push("Guest must not receive content submission capabilities");
  }

  // Admin account routing is intentionally deferred to Package 42. Do not create
  // an authenticated account kind without its own safe workspace route.
  if (/AccountKind\s*=.*"admin"/.test(accountModel)) {
    errors.push("Admin AccountKind must not be introduced before the admin workspace exists");
  }
}

if (errors.length) {
  console.error("Moderation foundation check failed:\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("Moderation foundation check passed.");
