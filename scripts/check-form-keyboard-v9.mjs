import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const expect = (condition, label) => {
  if (!condition) {
    console.error(`✗ ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ ${label}`);
  }
};

const input = read("src/components/ui/Input.tsx");
const screen = read("src/components/ui/Screen.tsx");
const navigation = read("src/components/forms/useFormFieldNavigation.ts");
const guard = read("src/hooks/useUnsavedChangesGuard.ts");
const adoption = read("src/features/adoption/screens/CreateAdoptionListingScreen.tsx");
const feeding = read("src/features/feeding-points/screens/CreateFeedingPointScreen.tsx");
const mapPlace = read("src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx");

expect(input.includes("forwardRef<TextInput, Props>"), "Input exposes a real TextInput ref");
expect(screen.includes('keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}'), "Screen has canonical keyboard dismissal");
expect(screen.includes('behavior={Platform.OS === "ios" ? "padding" : "height"}'), "Screen avoids Android keyboard overlap");
expect(navigation.includes("nextProps") && navigation.includes("doneProps") && navigation.includes("requestAnimationFrame"), "shared Next/Done field navigation exists");
expect(guard.includes("usePreventRemove") && guard.includes("requestUnsavedChangesDecision"), "unsaved changes guard protects navigation removal through the global decision surface");
for (const [name, source] of [["adoption", adoption], ["feeding point", feeding], ["map place", mapPlace]]) {
  expect(source.includes("useUnsavedChangesGuard"), `${name} form protects unsaved work`);
  expect(source.includes("useFormFieldNavigation"), `${name} form uses keyboard field navigation`);
  expect(source.includes("<StickyActionBar>"), `${name} form keeps completion actions visible`);
}
expect(adoption.includes('fieldNavigation.focus("weight")'), "adoption form focuses invalid numeric input");
expect(feeding.includes('if (!name.trim()) fieldNavigation.focus("name")') && feeding.includes('else if (!address.trim()) fieldNavigation.focus("address")'), "feeding form focuses first missing required input");
expect(mapPlace.includes("focusFirstInvalidField"), "map-place form focuses first invalid required input");

if (process.exitCode) process.exit(process.exitCode);
console.log("Form & keyboard UX V9 passed.");
