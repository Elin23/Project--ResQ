import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    console.error(`Unsaved Navigation V14 failed: ${message}`);
    process.exit(1);
  }
};

const root = read("app/_layout.tsx");
assert(root.includes("UnsavedChangesDecisionProvider"), "root layout must mount the global unsaved-changes decision provider");

const guard = read("src/hooks/useUnsavedChangesGuard.ts");
assert(guard.includes("usePreventRemove"), "guard must intercept all navigation-removal actions");
assert(guard.includes("requestUnsavedChangesDecision"), "guard must use the global decision surface");
assert(!guard.includes("Alert.alert"), "guard must not use native Alert");
assert(guard.includes("onSaveDraft"), "guard must support an optional save-draft action");
assert(guard.includes("navigation.dispatch(action)"), "discard/save completion must replay the original navigation action");

const provider = read("src/components/ui/UnsavedChangesDecisionProvider.tsx");
assert(provider.includes("requestUnsavedChangesDecision"), "provider must expose a global request API");
assert(provider.includes("result === false"), "failed draft saves must keep the user on the form");
assert(provider.includes("current.onDiscard()"), "successful save/discard must resume the intercepted navigation");

const dialog = read("src/components/ui/UnsavedChangesDialog.tsx");
for (const label of ["متابعة التعديل", "تجاهل التغييرات", "حفظ كمسودة والخروج"]) {
  assert(dialog.includes(label), `decision surface must include Arabic action: ${label}`);
}
assert(dialog.includes("showSaveDraft"), "save-draft action must be optional per form");
assert(dialog.includes("onRequestClose"), "Android back must be handled by the same decision surface");

const mapPlace = read("src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx");
assert(mapPlace.includes("saveDraftBeforeExit"), "map-place application must support saving a draft during route exit");
assert(mapPlace.includes("onSaveDraft: saveDraftBeforeExit"), "map-place guard must wire the draft exit action");
assert(mapPlace.includes('saveDraftLabel: "حفظ كمسودة والخروج"'), "map-place draft exit action must use explicit Arabic copy");

for (const path of [
  "src/features/adoption/screens/CreateAdoptionListingScreen.tsx",
  "src/features/feeding-points/screens/CreateFeedingPointScreen.tsx",
]) {
  const source = read(path);
  assert(source.includes("useUnsavedChangesGuard"), `${path} must retain route-exit protection`);
  assert(!source.includes("onSaveDraft:"), `${path} must not invent a draft action when the workflow has no draft contract`);
}

const alertUsages = [];
for (const rootDir of ["src/features", "src/hooks"]) {
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const path = `${current}/${entry.name}`;
      if (entry.isDirectory()) stack.push(path);
      else if (/\.(ts|tsx)$/.test(entry.name) && read(path).includes("Alert.alert")) alertUsages.push(path);
    }
  }
}
assert(alertUsages.length === 0, `native Alert must be absent from feature/navigation guard flows; found: ${alertUsages.join(", ")}`);

console.log("Unsaved Navigation V14 passed: global decision provider + route replay + optional draft exit + zero native feature alerts.");
