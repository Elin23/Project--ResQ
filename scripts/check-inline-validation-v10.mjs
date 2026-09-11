import fs from "node:fs";

const files = {
  summary: "src/components/ui/FormValidationSummary.tsx",
  adoption: "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  feeding: "src/features/feeding-points/screens/CreateFeedingPointScreen.tsx",
  place: "src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx",
  donation: "src/features/donations/screens/DonationCheckoutEntryScreen.tsx",
};

const read = (file) => fs.readFileSync(file, "utf8");
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

for (const file of Object.values(files)) expect(fs.existsSync(file), `Missing ${file}`);
if (!failures.length) {
  const summary = read(files.summary);
  const adoption = read(files.adoption);
  const feeding = read(files.feeding);
  const place = read(files.place);
  const donation = read(files.donation);

  expect(summary.includes('accessibilityRole="alert"'), "Validation summary must be announced as an alert");
  expect(summary.includes("COLORS.dangerSoft"), "Validation summary must use semantic danger surface");
  expect(adoption.includes("FormValidationSummary"), "Adoption form must render validation summary");
  expect(adoption.includes('error={showValidation && !animalName.trim()'), "Adoption form must expose field-level errors");
  expect(adoption.includes('disabled={submitting}'), "Adoption submit must remain tappable before validation so feedback can be shown");
  expect(feeding.includes("FormValidationSummary"), "Feeding point form must render validation summary");
  expect(feeding.includes('error={showValidation && !name.trim()'), "Feeding point form must expose field-level errors");
  expect(place.includes("FormValidationSummary"), "Map place form must render validation summary");
  expect(place.includes('governorateId') && place.includes('regionId'), "Map place validation must require the backend location contract");
  expect(place.includes('!location'), "Map place validation must require an explicitly selected map location");
  expect(place.includes('supportingDocumentUri') && place.includes('licenseNumber'), "Veterinary clinic map requests must collect verification evidence supported by the backend contract");
  expect(donation.includes("FormValidationSummary"), "Donation checkout must render inline validation summary");
  expect(donation.includes('error={showValidation && !transferNumber.trim()'), "Donation checkout must expose transfer-number error inline");
  expect(!donation.includes('Alert.alert("رقم الحوالة مطلوب"'), "Donation checkout must not use alerts for required field validation");
}

if (failures.length) {
  console.error("Inline validation V10 check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("Inline validation V10 check passed: summaries, field errors, backend location requirements, and supported-field validation and clinic verification evidence are enforced.");
