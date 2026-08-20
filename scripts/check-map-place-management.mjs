import fs from "node:fs";

const failures = [];
const read = (file) => fs.readFileSync(file, "utf8");
const must = (file, token, label = token) => {
  if (!fs.existsSync(file) || !read(file).includes(token)) failures.push(`${file}: missing ${label}`);
};
const mustAny = (file, tokens, label = tokens.join(" OR ")) => {
  if (!fs.existsSync(file) || !tokens.some((token) => read(file).includes(token))) failures.push(`${file}: missing ${label}`);
};
const mustNot = (file, token, label = token) => {
  if (fs.existsSync(file) && read(file).includes(token)) failures.push(`${file}: forbidden ${label}`);
};

for (const file of [
  "app/map-places/index.tsx",
  "app/map-places/apply.tsx",
  "app/map-places/applications/[id].tsx",
  "app/map-places/[id]/edit.tsx",
  "src/features/map-places/screens/MyMapPlacesScreen.tsx",
  "src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx",
  "src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx",
  "src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx",
]) {
  if (!fs.existsSync(file)) failures.push(`Missing ${file}`);
}

must("src/types/accounts.ts", 'AccountType = "user" | "organization"', "two account kinds only");
mustNot("src/types/accounts.ts", '"clinic"', "clinic account kind");
must("src/features/session/SessionContext.tsx", "version: 3, principal: nextPrincipal", "session v3 persistence");

for (const capability of ["submit-map-place-application", "view-own-map-place-applications", "edit-owned-map-place"]) {
  must("src/features/session/accessPolicy.ts", `"${capability}"`, `map-place capability ${capability}`);
}
must("app/map-places/apply.tsx", 'capability="submit-map-place-application"', "application route gate");
must("app/map-places/applications/[id].tsx", 'capability="view-own-map-place-applications"', "application details route gate");
must("app/map-places/[id]/edit.tsx", 'capability="edit-owned-map-place"', "owned place edit route gate");

must("src/domain/service-places/mapPlaceApplication.ts", 'applicantUserId: string', "application ownership");
must("src/domain/service-places/servicePlace.ts", 'ownerUserId?: string', "place ownership");
must("src/data/repositories/inMemoryMapPlaceApplicationRepository.ts", "application.applicantUserId === userId", "repository application ownership enforcement");
must("src/data/repositories/inMemoryServicePlaceRepository.ts", "item.ownerUserId === userId", "repository place ownership enforcement");
must("src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx", "canUserManageMapPlaceApplication", "screen application ownership enforcement");
must("src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx", "canUserManageMapPlace", "screen place ownership enforcement");

for (const type of ["clinic", "pet_store", "pet_hotel", "cat_cafe", "grooming", "shelter", "other"]) {
  mustAny("src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx", [`"${type}"`, `'${type}'`], `place type ${type}`);
}
mustAny("src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx", ['type === "clinic"', "type==='clinic'"], "clinic-specific dynamic fields");
must("src/features/profile/constants/profile.ts", 'route: "/map-places"', "profile map-place entry point");
must("src/product/screenCatalog.ts", 'route: "/map-places/apply"', "screen catalog coverage");

if (failures.length) {
  console.error("Map-place management check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log("Map-place management check passed: two-account model, user application flow, dynamic place categories, route gates, resource ownership, profile entry, and session v3 persistence are wired.");
