import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const mustFile = (file) => {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`);
};
const must = (file, token, label = token) => {
  if (!fs.existsSync(path.join(root, file)) || !read(file).includes(token)) failures.push(`${file}: missing ${label}`);
};

[
  "src/features/donations/screens/DonationsScreen.tsx",
  "src/features/donations/hooks/useDonationDiscovery.ts",
  "src/features/donations/screens/DonationCampaignDetailsScreen.tsx",
  "app/(user)/(tabs)/(home)/donations/index.tsx",
  "app/(user)/(tabs)/(home)/donations/[id]/index.tsx",
  "app/organization/(tabs)/(home)/donations/index.tsx",
].forEach(mustFile);

must("src/features/donations/hooks/useDonationDiscovery.ts", "repositories.donationCampaigns.listPublic", "campaign repository discovery");
must("src/features/donations/hooks/useDonationDiscovery.ts", "repositories.donationTransfers.listByDonor", "donor transfer history");
for (const text of ["الأكثر احتياجًا", "الحملات النشطة", "أثر مساهمات المجتمع", "آخر تبرعاتك"]) {
  must("src/features/donations/screens/DonationsScreen.tsx", text, `Figma discovery section ${text}`);
}
must("src/features/donations/screens/DonationsScreen.tsx", "HeroCampaign", "Figma hero campaign");
must("src/features/donations/screens/DonationsScreen.tsx", "CATEGORY_ITEMS", "campaign category filters");
must("src/navigation/routes.ts", "donationCampaignDetailsRoute", "campaign details route");
must("src/navigation/routes.ts", "donationDetailsRoute", "donation transfer details route");
must("src/features/home/hooks/useHomeScreen.ts", "donationsRoute(browseKind)", "donations entry for authenticated user");
if (read("src/features/donations/screens/DonationsScreen.tsx").includes("const OPTIONS")) {
  failures.push("Legacy static donations OPTIONS surface still exists.");
}

if (failures.length) {
  console.error("Donations discovery check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donations discovery check passed: Figma-inspired public campaign discovery is repository-backed and workspace-aware.");
