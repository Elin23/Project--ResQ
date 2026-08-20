import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const required = [
  "src/components/ui/RtlRow.tsx",
  "src/components/ui/ContentBlock.tsx",
  "src/components/ui/ListItem.tsx",
  "src/components/ui/MetaRow.tsx",
  "src/components/ui/ActionRow.tsx",
  "src/components/ui/SectionHeader.tsx",
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) failures.push(`missing ${file}`);

const contracts = {
  "src/components/ui/RtlRow.tsx": ['flexDirection: "row"', 'ARABIC_LAYOUT.direction'],
  "src/components/ui/ListItem.tsx": ['flexDirection: "row"', 'direction: "rtl"', 'alignItems: "stretch"'],
  "src/components/ui/MetaRow.tsx": ['flexDirection: "row"', 'direction: "rtl"', 'alignSelf: "stretch"'],
  "src/components/ui/ActionRow.tsx": ['flexDirection: "row"', 'direction: "rtl"'],
  "src/components/ui/SectionHeader.tsx": ['flexDirection: "row"', 'direction: "rtl"'],
  "src/components/ui/StatusBadge.tsx": ['flexDirection: "row"', 'direction: "rtl"'],
  "src/components/ui/Chip.tsx": ['flexDirection: "row"', 'direction: "rtl"'],
  "src/components/ui/Card.tsx": ['direction: "rtl"'],
  "src/components/ui/Screen.tsx": ['direction: "rtl"'],
};
for (const [file, needles] of Object.entries(contracts)) {
  const source = read(file);
  for (const needle of needles) if (!source.includes(needle)) failures.push(`${file} missing ${needle}`);
}

if (failures.length) {
  console.error("RTL layout architecture check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`RTL layout architecture check passed: ${required.length} shared logical-layout contracts.`);
