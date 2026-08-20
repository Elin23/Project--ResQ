import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const requireFile = (file) => { if (!exists(file)) failures.push(`Missing ${file}`); };
const requireText = (file, token, label = token) => {
  if (!exists(file) || !read(file).includes(token)) failures.push(`${file}: missing ${label}`);
};

[
  "src/domain/donations/campaign.ts",
  "src/domain/donations/campaignRepository.ts",
  "src/domain/donations/transfer.ts",
  "src/domain/donations/transferRepository.ts",
  "src/data/donationCampaigns.seed.ts",
  "src/data/repositories/inMemoryDonationCampaignRepository.ts",
  "src/data/repositories/inMemoryDonationTransferRepository.ts",
  "src/data/repositories/inMemoryDonationRepositories.test.ts",
].forEach(requireFile);

for (const status of ["draft", "pending_review", "active", "paused", "completed", "closed", "rejected"]) {
  requireText("src/domain/donations/campaign.ts", `\"${status}\"`, `campaign status ${status}`);
}
for (const status of ["submitted", "verifying", "approved", "rejected"]) {
  requireText("src/domain/donations/transfer.ts", `\"${status}\"`, `transfer status ${status}`);
}
requireText("src/domain/donations/campaign.ts", 'Extract<ContentOwnerKind, "organization">', "organization-only campaign ownership");
requireText("src/data/repositories/inMemoryDonationCampaignRepository.ts", "recordVerifiedDonation", "verified donation accounting");
requireText("src/data/repositories/inMemoryDonationCampaignRepository.ts", "input.targetAmount < current.raisedAmount", "target cannot drop below raised amount");
requireText("src/data/repositories/inMemoryDonationTransferRepository.ts", "duplicate", "duplicate transfer protection");
requireText("src/data/repositories/inMemoryDonationTransferRepository.ts", "markVerifying", "transfer verification stage");
requireText("src/data/repositories/inMemoryDonationTransferRepository.ts", "recordVerifiedDonation", "approval updates campaign accounting");
requireText("src/services/domain/repositories.ts", "donationCampaigns", "campaign repository composition");
requireText("src/services/domain/repositories.ts", "donationTransfers", "transfer repository composition");

const access = read("src/features/session/accessPolicy.ts");
const organizationBlock = access.match(/organization:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const userBlock = access.match(/user:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
if (!organizationBlock.includes('"manage-campaigns"')) failures.push("Organization must retain manage-campaigns capability");
if (userBlock.includes('"manage-campaigns"')) failures.push("Normal user must not manage campaigns");

if (failures.length) {
  console.error("Donation domain foundation check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donation domain foundation check passed: organization campaign ownership/lifecycle, transfer verification, and accounting are wired.");
