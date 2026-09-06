import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const requireIncludes = (file, needles) => {
  const source = read(file);
  for (const needle of needles) {
    if (!source.includes(needle)) failures.push(`${file}: missing ${needle}`);
  }
};

requireIncludes('src/navigation/WorkspaceBackBoundary.tsx', [
  'hardwareBackPress',
  'transitionLockedRef',
  'router.canGoBack()',
  'router.replace(home)',
]);

requireIncludes('src/services/location/reliableLocation.ts', [
  'hasServicesEnabledAsync',
  'getForegroundPermissionsAsync',
  'getCurrentPositionAsync',
  'getLastKnownPositionAsync',
  'timeoutMs',
]);

requireIncludes('app.config.js', [
  'expo-location',
  'locationWhenInUsePermission',
  'GOOGLE_MAPS_API_KEY',
]);

requireIncludes('src/services/api/client.ts', [
  'AbortController',
  'requestTimeout',
  'تعذر الاتصال بالخادم',
]);

if (failures.length) {
  console.error('Device hardening V21 failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Device hardening V21 passed.');
