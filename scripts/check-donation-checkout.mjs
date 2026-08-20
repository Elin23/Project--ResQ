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
  "بيانات مستلم الحوالة",
  "بيانات الحوالة المرسلة",
  "الاسم الثلاثي للمرسل",
  "رقم الحوالة",
  "مبلغ الحوالة",
  "إرسال بيانات الحوالة",
]) {
  must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", token, `Figma checkout surface: ${token}`);
}
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "repositories.donationTransfers.submit", "real transfer submission");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "campaign.paymentRecipient", "campaign-owned official recipient data");
must("src/features/donations/screens/DonationCheckoutEntryScreen.tsx", "DONATION_TRANSFER_PROVIDERS", "configured transfer providers");
must("src/navigation/routes.ts", 'pathname: "/donation-checkout/[id]"', "focused checkout outside persistent navbar shell");
must("src/navigation/routes.ts", "donationTransferSubmittedRoute", "post-submit confirmation route");
if (read("src/features/donations/screens/DonationCheckoutEntryScreen.tsx").includes('name="copy-outline"')) {
  failures.push("Checkout must not expose a fake copy button without a clipboard implementation.");
}

if (failures.length) {
  console.error("Donation checkout check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donation checkout check passed: Figma bank-transfer checkout is functional, repository-backed, and isolated as a focused data-entry flow.");
