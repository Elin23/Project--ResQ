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
  "src/features/donations/screens/DonationTransferSubmittedScreen.tsx",
  "src/features/donations/screens/DonationTransferDetailsScreen.tsx",
  "src/features/donations/screens/MyDonationsScreen.tsx",
  "src/features/donations/hooks/useMyDonations.ts",
  "app/(user)/(tabs)/(home)/donations/my-donations.tsx",
  "app/organization/(tabs)/(home)/donations/my-donations.tsx",
].forEach(mustFile);

for (const token of [
  "رقم طلب التحقق",
  "ملخص الحوالة",
  "مراحل التحقق",
  "لا ترسل نفس الحوالة مرة أخرى",
  "تحديثات حالة الحوالة",
  "متابعة حالة التبرع",
]) {
  must("src/features/donations/screens/DonationTransferSubmittedScreen.tsx", token, `Payment Details Figma surface: ${token}`);
}

for (const token of [
  "تفاصيل التبرع",
  "مراحل التحقق",
  "ملاحظات فريق المراجعة",
  "الحملة التي دعمتها",
  "هل تحتاج مساعدة؟",
]) {
  must("src/features/donations/screens/DonationTransferDetailsScreen.tsx", token, `Donation Details Figma surface: ${token}`);
}

must("src/features/donations/hooks/useMyDonations.ts", "listByDonor(accountId)", "account-scoped donation history");
must("src/navigation/routes.ts", "myDonationsRoute", "my donations route helper");
must("src/features/donations/screens/DonationsScreen.tsx", "myDonationsRoute(accountKind)", "real Show All donation-history action");
must("src/features/donations/screens/DonationTransferDetailsScreen.tsx", "getByDonor(id, account.id)", "private donor details authorization");

if (failures.length) {
  console.error("Donation tracking check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Donation tracking check passed: Figma submitted/detail surfaces and account-scoped donation history are implemented.");
