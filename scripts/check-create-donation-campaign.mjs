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
  "src/features/donations/screens/CreateDonationCampaignScreen.tsx",
  "src/features/donations/screens/OwnedDonationCampaignStatusScreen.tsx",
  "src/features/donations/hooks/useCreateDonationCampaign.ts",
  "src/features/donations/hooks/useOwnedDonationCampaign.ts",
  "src/features/donations/CampaignManagerRouteGate.tsx",
  "app/campaigns/create.tsx",
  "app/organization/(tabs)/(home)/donations/campaigns/[id]/index.tsx",
].forEach(mustFile);

for (const token of [
  "صور الحملة",
  "المعلومات الأساسية",
  "الهدف المالي والمدة",
  "موقع الحملة",
  "ماذا سيحقق تبرعك؟",
  "بيانات استلام الحوالات",
  "إرسال الحملة للمراجعة",
  "حفظ كمسودة",
]) {
  must("src/features/donations/screens/CreateDonationCampaignScreen.tsx", token, `campaign form section: ${token}`);
}

must("src/features/donations/screens/CreateDonationCampaignScreen.tsx", "allowsMultipleSelection: true", "multi-image campaign picker");
must("src/features/donations/hooks/useCreateDonationCampaign.ts", "createDraft(input)", "draft persistence");
must("src/data/repositories/inMemoryDonationCampaignRepository.ts", "validateDraftInput", "partial draft validation");
must("src/data/repositories/inMemoryDonationCampaignRepository.ts", "validateCampaignInput(current)", "full validation before moderation submission");
must("src/features/donations/hooks/useCreateDonationCampaign.ts", "submitForReview", "moderation submission");
must("src/features/donations/CampaignManagerRouteGate.tsx", 'can("manage-campaigns")', "capability route protection");
must("src/features/session/accessPolicy.ts", '"manage-campaigns"', "campaign capability");
const access = read("src/features/session/accessPolicy.ts");
const organizationBlock = access.match(/organization:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const userBlock = access.match(/user:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
if (!organizationBlock.includes('"manage-campaigns"')) failures.push("Organization must be able to manage campaigns.");
if (userBlock.includes('"manage-campaigns"')) failures.push("Normal user must not be able to manage campaigns.");

must("src/features/donations/screens/DonationsScreen.tsx", 'can("manage-campaigns")', "role-aware create campaign CTA");
must("src/features/organization-dashboard/components/OrganizationQuickActions.tsx", 'label: "فتح حملة"', "organization campaign entry");
must("src/navigation/routes.ts", 'pathname: "/campaigns/create"', "focused create campaign route");
must("src/navigation/routes.ts", "ownedCampaignStatusRoute", "owner campaign status route");

if (failures.length) {
  console.error("Create donation campaign check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Create donation campaign check passed: organization campaign creation, drafts, moderation submission, and owner status are wired.");
