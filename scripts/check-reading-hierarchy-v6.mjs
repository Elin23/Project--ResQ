import fs from "node:fs";

const mustContain = {
  "src/components/ui/ReadingSection.tsx": ["SectionHeader", "Arabic-first reading section"],
  "src/components/ui/DetailRow.tsx": ["direction: \"rtl\"", "variant=\"caption\""],
  "src/features/adoption/screens/AdoptionDetailsScreen.tsx": ["ReadingSection", "DetailRow", "عن الحالة"],
  "src/features/adoption/screens/MyAdoptionListingsScreen.tsx": ["ScreenSection", "MetaRow"],
  "src/features/donations/screens/DonationCampaignDetailsScreen.tsx": ["ReadingSection", "عن الحملة", "اختر مبلغ التبرع"],
  "src/features/donations/screens/DonationsScreen.tsx": ["SectionHeader", "الحملات النشطة"],
  "src/features/organization-dashboard/screens/OrganizationTasksScreen.tsx": ["ScreenSection", "المهام النشطة"],
  "src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx": ["ReadingSection", "DetailRow", "Input"],
};

for (const [file, needles] of Object.entries(mustContain)) {
  const source = fs.readFileSync(file, "utf8");
  for (const needle of needles) {
    if (!source.includes(needle)) throw new Error(`${file} is missing ${needle}`);
  }
}

const forbidden = [
  ["src/features/donations/screens/DonationsScreen.tsx", "backgroundColor: \"COLORS.backdrop\""],
  ["src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx", "function SectionTitle"],
  ["src/features/donations/screens/DonationCampaignDetailsScreen.tsx", "function Section({"],
];
for (const [file, needle] of forbidden) {
  if (fs.readFileSync(file, "utf8").includes(needle)) throw new Error(`${file} still contains forbidden legacy pattern: ${needle}`);
}

const src = fs.readdirSync("src", { recursive: true }).filter((x) => typeof x === "string" && /\.(ts|tsx)$/.test(x));
for (const rel of src) {
  const file = `src/${rel}`;
  const source = fs.readFileSync(file, "utf8");
  if (/backgroundColor:\s*["']COLORS\./.test(source)) throw new Error(`${file} contains a quoted COLORS token`);
}

console.log("Reading hierarchy V6 check passed.");
