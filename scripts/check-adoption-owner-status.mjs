import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const requireFile = (file) => {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
};
const requireText = (file, text, label = text) => {
  if (!exists(file) || !read(file).includes(text)) {
    failures.push(`${file}: missing ${label}`);
  }
};

[
  "src/features/adoption/screens/MyAdoptionListingsScreen.tsx",
  "src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx",
  "src/features/adoption/hooks/useOwnedAdoptionListings.ts",
  "src/features/adoption/hooks/useOwnedAdoptionListingDetails.ts",
  "app/(user)/(tabs)/(adoption)/adoptions/my-listings/index.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/my-listings/[id]/index.tsx",
  "app/organization/(tabs)/(home)/adoptions/my-listings/index.tsx",
  "app/organization/(tabs)/(home)/adoptions/my-listings/[id]/index.tsx",
  "app/adoptions/my-listings/[id]/edit.tsx",
].forEach(requireFile);

requireText(
  "src/data/repositories/inMemoryAdoptionRepository.ts",
  "updateAndResubmit",
  "owner resubmit repository operation",
);
requireText(
  "src/data/repositories/inMemoryAdoptionRepository.ts",
  '["rejected", "draft"]',
  "edit eligibility guard",
);
requireText(
  "src/data/repositories/inMemoryAdoptionRepository.ts",
  "submitForReview",
  "resubmission moderation reset",
);
requireText(
  "src/data/repositories/inMemoryAdoptionRepository.ts",
  "closeOwned",
  "owner close operation",
);
requireText(
  "src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx",
  "سبب رفض الإعلان",
  "rejection reason surface",
);
requireText(
  "src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx",
  "تعديل وإعادة الإرسال",
  "rejected edit/resubmit CTA",
);
requireText(
  "src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx",
  "لوحة إدارة الإعلان",
  "approved management state",
);
requireText(
  "src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx",
  "عرض طلبات التبني",
  "applicants management surface",
);
requireText(
  "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  "updateAndResubmit",
  "edit form resubmission wiring",
);
requireText(
  "src/features/adoption/screens/AdoptionScreen.tsx",
  "adoptionMyListingsRoute",
  "user owner-listing entry point",
);
requireText(
  "src/features/organization-dashboard/hooks/useOrganizationDashboard.ts",
  'adoptionMyListingsRoute("organization")',
  "organization owner-listing entry point",
);
requireText(
  "src/navigation/routes.ts",
  "adoptionMyListingDetailsRoute",
  "workspace-aware owner detail routes",
);
requireText(
  "src/navigation/routes.ts",
  "adoptionMyListingEditRoute",
  "focus edit route",
);

if (failures.length) {
  console.error(
    "Adoption owner-status check failed:\n" +
      failures.map((item) => `- ${item}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  "Adoption owner-status check passed: owner-scoped listing status, rejection reasons, edit/resubmit, approved management, workspace-preserving routes, and close lifecycle are wired.",
);
