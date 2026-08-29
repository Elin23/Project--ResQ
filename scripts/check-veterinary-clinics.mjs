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
  "src/features/vets/screens/VeterinaryClinicsScreen.tsx",
  "src/features/vets/screens/VeterinaryClinicDetailsScreen.tsx",
  "src/features/vets/hooks/useVeterinaryClinics.ts",
  "src/features/vets/hooks/useVeterinaryClinicDetails.ts",
  "app/(user)/(tabs)/(home)/vets/index.tsx",
  "app/(user)/(tabs)/(home)/vets/[id].tsx",
  "app/organization/(tabs)/(home)/vets/index.tsx",
].forEach(mustFile);

for (const token of [
  "العيادات البيطرية",
  "مفتوحة الآن",
  "طوارئ 24 ساعة",
  "عيادات موصى بها",
  "على الخريطة",
  "جميع العيادات",
  "اتصال",
  "الاتجاهات",
  "التفاصيل",
]) {
  must("src/features/vets/screens/VeterinaryClinicsScreen.tsx", token, `Vets Figma surface: ${token}`);
}

for (const token of [
  "الشخص المسؤول",
  "ساعات العمل",
  "الموقع على الخريطة",
  "اتصال الآن",
  "الاتجاهات",
]) {
  must("src/features/vets/screens/VeterinaryClinicDetailsScreen.tsx", token, `clinic details surface: ${token}`);
}

must("src/features/vets/hooks/useVeterinaryClinics.ts", 'list({ type: "clinic" })', "clinic-only repository query");
must("src/domain/service-places/servicePlace.ts", "responsiblePerson", "clinic responsible-person field");
must("src/domain/service-places/servicePlace.ts", "emergency24h", "24h emergency field");
must("src/domain/service-places/servicePlace.ts", "isOvernight", "overnight opening-hour handling");
must("src/navigation/routes.ts", "veterinaryClinicsRoute", "workspace-aware vets route");
must("src/navigation/routes.ts", "veterinaryClinicDetailsRoute", "workspace-aware clinic-details route");
must("src/features/home/hooks/useHomeScreen.ts", "veterinaryClinicsRoute(browseKind)", "home clinic action");
must("src/features/organization-dashboard/components/OrganizationQuickActions.tsx", 'label: "العيادات"', "organization workspace vets entry");

if (failures.length) {
  console.error("Veterinary clinics check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Veterinary clinics check passed: Figma-inspired discovery/details, filters, maps, contact actions, and workspace routes are wired.");
