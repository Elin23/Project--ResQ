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
const mustNot = (file, token, label = token) => {
  if (fs.existsSync(path.join(root, file)) && read(file).includes(token)) failures.push(`${file}: must not contain ${label}`);
};

[
  "src/features/donations/screens/DonationCheckoutEntryScreen.tsx",
  "src/features/donations/constants/transferProviders.ts",
  "src/features/donations/screens/DonationTransferSubmittedScreen.tsx",
  "app/donation-checkout/[id].tsx",
  "app/(user)/(tabs)/(home)/donations/transfer-submitted.tsx",
  "app/organization/(tabs)/(home)/donations/transfer-submitted.tsx",
].forEach(mustFile);

for (const token of [
  "تأكيد الحوالة",
  "طريقة التبرع",
  "اختر شركة الحوالات",
  "بيانات التحويل الرسمية",
  "بيانات الحوالة المرسلة",
  "الاسم الثلاثي للمرسل",
  "رقم الحوالة",
  "مبلغ الحوالة",
  "إرسال بيانات الحوالة",
]) must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", token, `checkout surface: ${token}`);

must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "API_ENDPOINTS.donations.transferProviders", "backend transfer-provider source");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "recipientName", "backend recipient name");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "recipientAccount", "backend recipient account");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "validateSyrianMobile", "sender mobile validation");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "formatSyrianMobileInternational", "normalized sender mobile");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "repositories.donationTransfers.submit", "real transfer submission");
mustNot("src/features/donations/constants/transferProviders.ts", "al-haram", "hard-coded provider");
mustNot("src/features/donations/constants/transferProviders.ts", "al-fouad", "hard-coded provider");
mustNot("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "DONATION_TRANSFER_PROVIDERS", "mock/fallback provider list");
mustNot("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "campaign.paymentRecipient", "campaign-local recipient data ignored by backend");
mustNot("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "رقم الموبايل (اختياري)", "optional sender phone label");
must("src/navigation/routes.ts", 'pathname: "/donation-checkout/[id]"', "focused checkout outside persistent navbar shell");
must("src/navigation/routes.ts", "donationTransferSubmittedRoute", "post-submit confirmation route");
if (read("src/features/donations/screens/DonationCheckoutEntryScreen.tsx").includes('name="copy-outline"')) failures.push("Checkout must not expose a fake copy button without a clipboard implementation.");

if (failures.length) {
  console.error("Donation checkout check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donation checkout check passed: transfer providers and recipient data are backend-owned, sender mobile is required, and no provider fallback mocks remain.");
