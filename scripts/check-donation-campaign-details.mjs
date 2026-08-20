import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const mustFile = (file) => {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`);
};
const must = (file, token, label = token) => {
  if (!fs.existsSync(path.join(root, file)) || !read(file).includes(token)) {
    failures.push(`${file}: missing ${label}`);
  }
};

[
  "src/features/donations/screens/DonationCampaignDetailsScreen.tsx",
  "src/features/donations/screens/DonationCheckoutEntryScreen.tsx",
  "src/features/donations/screens/DonationCampaignOwnerScreen.tsx",
  "app/(user)/(tabs)/(home)/donations/[id]/index.tsx",
  "app/donation-checkout/[id].tsx",
  "app/(user)/(tabs)/(home)/donations/[id]/owner.tsx",
  "app/organization/(tabs)/(home)/donations/[id]/index.tsx",
].forEach(mustFile);

for (const token of [
  "عن الحملة",
  "ماذا سيحقق تبرعك؟",
  "اختر مبلغ التبرع",
  "رسالة دعم (اختياري)",
  "عرض الملف التعريفي",
  "مشاركة الحملة",
  "تبرع الآن",
]) {
  must("src/features/donations/screens/DonationCampaignDetailsScreen.tsx", token, `Figma campaign-details surface: ${token}`);
}
must("src/features/donations/screens/DonationCampaignDetailsScreen.tsx", "QUICK_AMOUNTS", "quick donation amounts");
must("src/features/donations/screens/DonationCampaignDetailsScreen.tsx", "donationCheckoutRoute", "checkout handoff");
must("src/features/donations/screens/DonationCampaignDetailsScreen.tsx", "Share.share", "native campaign sharing");
must("src/navigation/routes.ts", "donationCheckoutRoute", "workspace-aware checkout route");
must("src/navigation/routes.ts", "donationCampaignOwnerRoute", "campaign-owner profile route");

if (failures.length) {
  console.error("Donation campaign details check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donation campaign details check passed: the supplied Figma detail surface is implemented with real campaign data and checkout state handoff.");
