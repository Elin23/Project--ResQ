import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = "src/features/reports/components/ReportDetailsScreen.tsx";
const source = fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const required = [
  'import AppText from "@/src/components/ui/AppText"',
  'import Card from "@/src/components/ui/Card"',
  'import MetaRow from "@/src/components/ui/MetaRow"',
  'import ScreenHeader from "@/src/components/ui/ScreenHeader"',
  'import ActionStack from "@/src/components/ui/ActionStack"',
  'import ActionRow from "@/src/components/ui/ActionRow"',
  'onLayout={handleCarouselLayout}',
  'title="تفاصيل البلاغ"',
];
for (const token of required) if (!source.includes(token)) failures.push(`missing Report Experience V2 contract: ${token}`);

if (/\bDimensions\s*\.\s*get\s*\(/.test(source)) failures.push("ReportDetailsScreen must measure its carousel container instead of reading a one-time window width");
if (/<Text\b/.test(source)) failures.push("ReportDetailsScreen must use AppText instead of raw Text nodes");
if (/\bTouchableOpacity\b/.test(source)) failures.push("ReportDetailsScreen must use shared Button/Pressable primitives instead of legacy TouchableOpacity controls");
if (/topBar\s*:|bottomButtonsRow\s*:|timelineVerticalLine\s*:|cardsGridContainer\s*:/.test(source)) failures.push("legacy ReportDetails layout styles are still present");
if (!/titleRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s.test(source)) failures.push("report title row must use the logical RTL contract");
if (!/timelineRow:\s*\{[^}]*flexDirection:\s*["']row["'][^}]*direction:\s*["']rtl["']/s.test(source)) failures.push("timeline must use the logical RTL contract");
if (!/pageContent:\s*\{[^}]*gap:\s*SPACING\.lg/s.test(source)) failures.push("report screen must use the shared page rhythm");

if (failures.length) {
  console.error("Report Experience V2 check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Report Experience V2 check passed: shared primitives, responsive carousel, logical RTL rows, and legacy controls removed.");
