import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const must = (file, token, label = token) => {
  if (!fs.existsSync(path.join(root, file)) || !read(file).includes(token)) {
    failures.push(`${file}: missing ${label}`);
  }
};

for (const token of [
  "الموقع الدقيق",
  "استخدام موقعي الحالي",
  "مغلقة مؤقتًا",
  "طوارئ 24 ساعة",
  "ساعات العمل",
  "حفظ التعديلات",
]) {
  must(
    "src/features/clinic-dashboard/screens/EditClinicProfileScreen.tsx",
    token,
    `clinic editor surface: ${token}`,
  );
}

must(
  "src/features/clinic-dashboard/screens/EditClinicProfileScreen.tsx",
  "FeedingPointLocationPicker",
  "interactive map location picker",
);
must(
  "src/features/clinic-dashboard/screens/EditClinicProfileScreen.tsx",
  "validateOpeningHours",
  "opening-hours UI validation",
);
must(
  "src/domain/service-places/servicePlace.ts",
  "validateOpeningHours",
  "central opening-hours validation",
);
must(
  "src/domain/service-places/servicePlace.ts",
  "allDayOpeningHours",
  "24-hour schedule helper",
);
must(
  "src/data/repositories/inMemoryServicePlaceRepository.ts",
  "validateOpeningHours(input.openingHours)",
  "repository hours validation",
);
must(
  "src/domain/service-places/servicePlaceRepository.ts",
  '| "status"',
  "owner temporary-closure update contract",
);
for (const token of ["فتح واتساب", "الاتجاهات", "طوارئ 24 ساعة"]) {
  must(
    "src/features/clinic-dashboard/screens/ClinicProfileScreen.tsx",
    token,
    `clinic profile action/state: ${token}`,
  );
}
must("app/clinic-profile/edit.tsx", 'capability="manage-clinic-profile"', "protected clinic edit route");
must("app/clinic/_layout.tsx", 'FloatingGlassTabBar', "clinic floating glass navbar");
must("app/clinic/_layout.tsx", '"(adoption)"', "clinic explore tab");
must("app/clinic/_layout.tsx", '"(notifications)"', "clinic notifications tab");

for (const obsolete of ["app/clinic/cases.tsx", "app/clinic/services.tsx"]) {
  if (fs.existsSync(path.join(root, obsolete))) {
    failures.push(`${obsolete}: obsolete medical route restored`);
  }
}

if (failures.length) {
  console.error("Clinic final integration check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Clinic final integration check passed: profile, location, opening hours, temporary closure, 24/7 status, actions, navbar, and route protection are coherent.");
