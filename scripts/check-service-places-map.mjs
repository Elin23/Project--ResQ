import fs from "node:fs";

const required = [
  "src/domain/service-places/servicePlace.ts",
  "src/domain/service-places/servicePlaceRepository.ts",
  "src/data/servicePlaces.seed.ts",
  "src/data/repositories/inMemoryServicePlaceRepository.ts",
  "src/features/map/screens/MapScreen.tsx",
  "src/features/map/screens/ServicePlaceDetailsScreen.tsx",
  "src/features/map/components/ServicePlacesMap.native.tsx",
  "src/features/map/components/PlacePreviewCard.tsx",
  "app/(user)/(tabs)/(map)/places/[id].tsx",
  "app/organization/(tabs)/(map)/places/[id].tsx",
  "app.config.js",
];

const errors = [];
for (const file of required) if (!fs.existsSync(file)) errors.push(`Missing ${file}`);

const nativeMap = fs.readFileSync("src/features/map/components/ServicePlacesMap.native.tsx", "utf8");
if (!nativeMap.includes("PROVIDER_GOOGLE")) errors.push("Native service map must use Google provider.");

const mapScreen = fs.readFileSync("src/features/map/screens/MapScreen.tsx", "utf8");
for (const token of ['"clinic"', '"organization"', '"shelter"', '"pet_store"']) {
  if (!mapScreen.includes(token)) errors.push(`Map filter missing ${token}`);
}
if (!mapScreen.includes("expo-location")) errors.push("Map must support current location through expo-location.");

const preview = fs.readFileSync("src/features/map/components/PlacePreviewCard.tsx", "utf8");
if (!preview.includes("tel:")) errors.push("Place preview must expose call-now action.");
if (!preview.includes("google.com/maps/dir")) errors.push("Place preview must expose Google Maps directions.");

const composition = fs.readFileSync("src/services/domain/repositories.ts", "utf8");
if (!composition.includes("servicePlaces: servicePlaceRepository") && !composition.includes("servicePlaces: new InMemoryServicePlaceRepository")) errors.push("Service-place repository must be wired through the domain composition root.");



const appConfig = fs.readFileSync("app.config.js", "utf8");
if (!appConfig.includes("GOOGLE_MAPS_API_KEY") || !appConfig.includes("react-native-maps")) {
  errors.push("Google Maps API key must be configured through environment-backed app config.");
}

if (errors.length) {
  console.error("Service Places Map check failed:\n" + errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log("Service Places Map check passed: Google provider, service categories, location, contact, directions, and workspace routes are wired.");
