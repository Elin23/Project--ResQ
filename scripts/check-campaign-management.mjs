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
  "src/features/donations/screens/MyDonationCampaignsScreen.tsx",
  "src/features/donations/screens/OwnedDonationCampaignStatusScreen.tsx",
  "src/features/donations/hooks/useOwnedDonationCampaigns.ts",
  "src/features/donations/hooks/useOwnedCampaignTransfers.ts",
  "src/features/donations/hooks/useManageDonationCampaign.ts",
  "app/organization/(tabs)/(home)/donations/campaigns/index.tsx",
  "app/campaigns/[id]/edit.tsx",
].forEach(mustFile);

for (const token of [
  "إجمالي الحملات",
  "نشطة",
  "قيد المراجعة",
  "إجمالي المحقق",
  "إدارة الحملة",
]) {
  must("src/features/donations/screens/MyDonationCampaignsScreen.tsx", token, `campaign-list surface: ${token}`);
}

for (const token of [
  "إيقاف مؤقت",
  "إعادة فتح الحملة",
  "إغلاق الحملة",
  "تعديل تفاصيل الحملة",
  "بانتظار المراجعة",
  "قيد التحقق",
  "معتمدة",
  "مرفوضة",
]) {
  must("src/features/donations/screens/OwnedDonationCampaignStatusScreen.tsx", token, `campaign-management surface: ${token}`);
}

must("src/features/donations/hooks/useManageDonationCampaign.ts", "pauseOwned", "owner pause operation");
must("src/features/donations/hooks/useManageDonationCampaign.ts", "resumeOwned", "owner resume operation");
must("src/features/donations/hooks/useManageDonationCampaign.ts", "closeOwned", "owner close operation");
must("src/features/donations/hooks/useOwnedCampaignTransfers.ts", "listByCampaignOwner", "owner-scoped campaign transfer stats");
must("src/data/repositories/inMemoryDonationTransferRepository.ts", "getOwnedById(campaignId, ownerAccountId)", "campaign transfer ownership check");
must("src/features/donations/screens/CreateDonationCampaignScreen.tsx", "updateAndSubmit", "rejected/draft resubmission edit flow");
must("src/features/donations/screens/CreateDonationCampaignScreen.tsx", "حفظ التعديلات", "active/paused edit save");
must("src/navigation/routes.ts", "myCampaignsRoute", "my campaigns route helper");
must("src/navigation/routes.ts", 'pathname: "/campaigns/[id]/edit"', "focused edit route");
must("src/features/donations/screens/DonationsScreen.tsx", "myCampaignsRoute(accountKind)", "donations manager entry");
must("src/features/organization-dashboard/components/OrganizationQuickActions.tsx", 'label: "حملاتي"', "organization my campaigns entry");

if (failures.length) {
  console.error("Campaign management check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Campaign management check passed: owner campaign list, edit/resubmit, pause/resume/close, and transfer stats are wired.");
