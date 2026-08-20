import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => { console.error(`Auth RTL/Copy V2 check failed: ${msg}`); process.exit(1); };

const coreScreens = [
  'src/features/auth/screens/LoginScreen.tsx',
  'src/features/auth/screens/ForgotPasswordScreen.tsx',
  'src/features/auth/screens/CreateNewPasswordScreen.tsx',
  'src/features/auth/screens/VerifyResetCodeScreen.tsx',
  'src/features/auth/screens/PasswordResetSuccessScreen.tsx',
  'src/features/auth/screens/ChooseAccountScreen.tsx',
  'src/features/auth/screens/RegisterUserScreen.tsx',
  'src/features/auth/screens/RegisterEntityScreen.tsx',
  'src/features/auth/screens/VerifyRegistrationPhoneScreen.tsx',
];

for (const file of coreScreens) {
  const source = read(file);
  if (!source.includes('ScreenHeader')) fail(`${file} must use the canonical ScreenHeader`);
  if (/styles\.topBar/.test(source)) fail(`${file} still renders a legacy custom top bar`);
  if (/name="arrow-(?:back|forward)-outline"/.test(source)) fail(`${file} still hardcodes a directional back arrow`);
}

const scanRoots = ['src', 'app'];
const forbiddenGreeting = /(أهلاً بعودتك|أهلا بعودتك|اهلاً بعودتك|مرحبًا بعودتك|مرحباً بعودتك)/;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
for (const base of scanRoots) {
  for (const file of walk(path.join(root, base)).filter((f) => /\.(ts|tsx)$/.test(f))) {
    const source = fs.readFileSync(file, 'utf8');
    if (forbiddenGreeting.test(source)) fail(`${path.relative(root, file)} contains a forbidden welcome-back greeting`);
  }
}

if (fs.existsSync(path.join(root, 'src/features/home/components/UserWelcomeHeader.tsx'))) {
  fail('UserWelcomeHeader must not exist; Home must not render a personal greeting block');
}
const home = read('src/features/home/screens/HomeScreen.tsx');
if (/UserWelcomeHeader|displayName/.test(home)) fail('HomeScreen still renders or consumes the personal greeting name');
const homeHook = read('src/features/home/hooks/useHomeScreen.ts');
if (/displayName/.test(homeHook)) fail('useHomeScreen still exposes a displayName for the removed greeting');
const regHero = read('src/features/auth/components/registration-success/RegistrationSuccessSections.tsx');
if (/displayName|`مرحبًا \$\{/.test(regHero)) fail('Registration success still personalizes the hero with a person name');

const loginStyles = read('src/features/auth/screens/Login.styles.ts');
if (!/forgotPasswordButton:\s*\{[\s\S]*?alignSelf:\s*"flex-end"/.test(loginStyles)) {
  fail('Login forgot-password action must align to the Arabic reading edge');
}
if (!/subtitle:\s*\{[\s\S]*?writingDirection:\s*"rtl"/.test(loginStyles)) {
  fail('Login intro copy must explicitly follow RTL writing direction');
}

console.log(`Auth RTL/Copy V2 check passed: ${coreScreens.length} auth flow screens use ScreenHeader; no welcome-back/personal-name greeting remains.`);
