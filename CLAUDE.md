# CLAUDE.md — قواعد العمل على مشروع ResQ

هذا الملف مرجع إلزامي. قبل أي تعديل، اقرأه كاملاً والتزم به.
المشروع: تطبيق React Native / Expo، عربي بالكامل، اتجاه RTL مفروض عالمياً.

**وثائق مرجعية في الجذر:**
- `AUDIT-INVENTORY.md` — جرد المكوّنات والتوكنز والقياسات بأرقام الأسطر.
- `SCREEN-INVENTORY.md` — جرد الشاشات الـ 72.
- `PRODUCTION-READINESS.md` — حدّ التكامل مع الخلفية وخطوات الإنتاج.
- `README.md` — نظرة عامة وتشغيل.

---

## 0. القاعدة الأم

**لا تخترع.** كل لون، كل مسافة، كل مكوّن، كل مسار — موجود مسبقاً. مهمتك أن تستخدم الموجود، لا أن تضيف بديلاً له.
إذا اعتقدت أنك تحتاج قيمة أو مكوّناً غير موجود: **توقّف واسأل**. لا تنشئه من تلقاء نفسك.

---

## 1. الاستيراد

الـ alias `@/*` يشير إلى **جذر المشروع**، وليس إلى `src/`. لذلك:

```ts
// صحيح
import { Screen, AppText, Button } from "@/src/components/ui";
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from "@/src/theme";
import { ROUTES } from "@/src/navigation/routes";

// خطأ
import { Screen } from "@/components/ui";        // ينقصه src
import { COLORS } from "../../../theme";          // مسار نسبي متعدد المستويات
```

المسار النسبي مسموح **فقط** داخل نفس مجلد الميزة (`../hooks/useX`، `../components/YCard`).
كل ما هو مشترك (`components/ui`, `theme`, `navigation`, `services`, `data`, `i18n`) يُستورد بـ `@/src/...` دائماً.

المكوّنات المشتركة تُستورد من الـ barrel: `@/src/components/ui` — لا من مسار الملف المفرد.

الـ alias معرّف في ثلاثة أماكن يجب أن تبقى متطابقة: `tsconfig.json` (paths)، Metro (تلقائي عبر Expo)، و `vitest.config.ts` (resolve.alias). إن أضفت مساراً جديداً، تأكد من الثلاثة.

---

## 2. التوكنز — ممنوع أي قيمة حرفية

### المسافات
مقياس `SPACING` الوحيد المسموح:

```
none: 0   xxs: 2   xs: 4   sm: 8   md: 12   lg: 16   xl: 24   2xl: 32   3xl: 40
```

ممنوع كتابة رقم حرفي في أي من: `padding`, `paddingTop/Bottom/Start/End/Horizontal/Vertical`, `margin`, `marginTop/Bottom/Start/End/Horizontal/Vertical`, `gap`.
`18` و `14` و `13` و `7` ليست قيماً صالحة. اختر أقرب قيمة من المقياس.

للتخطيط العام استخدم `LAYOUT.screenPadding` (16)، `LAYOUT.sectionGap` (20)، `LAYOUT.cardGap` (10)، وقيم `DENSITY` للبطاقات والكثافة (`cardPadding`, `sectionGap`, `itemGap`, `controlGap`, `touchTargetMin`).

### الألوان
استخدم **الرموز الدلالية فقط**:
`primary, primaryPressed, primaryStrong, primarySoft, secondary, secondaryStrong, secondarySoft, accent, background, surface, surfaceMuted, surfaceElevated, text, textSecondary, textMuted, textInverse, icon, iconMuted, placeholder, border, borderStrong, divider, disabled, disabledSurface, success, danger, warning, info` وأخواتها `*Soft`.

**ممنوع تماماً** استخدام مفاتيح قسم *Compatibility aliases* في `src/theme/index.ts` (الأسطر 122–176). هذه طبقة توافق مؤقتة موسومة في الكود نفسه كقيد الإزالة:
`neutral, lightgray, darkgray, brown, brownDark, brownMuted, bgblue, textblue, bggreen, textgreen, peach, tan, ink, navy, offwhite, ...`
إذا وجدت ملفاً قائماً يستخدمها، **لا تنسخ النمط** في كود جديد. ولا تستبدلها في الملفات القائمة إلا إذا طُلب منك ذلك صراحةً كمهمة مستقلة.

**ممنوع** كتابة `#RRGGBB` أو `rgba(...)` مباشرة في أي ملف خارج `src/theme/index.ts`.
ممنوع استخدام `PALETTE` مباشرة في ملفات الميزات — `PALETTE` مصدر داخلي لـ `COLORS` فقط.

### الخطوط
استخدم `TYPOGRAPHY` (`display, h1, h2, h3, bodyLarge, body, bodySmall, label, caption`) — تحمل `fontSize` و `lineHeight` و `fontFamily` معاً.
`FONT_SIZES` موسومة في الكود كـ backwards-compatible — لا تستخدمها في كود جديد.
ممنوع `fontFamily` حرفياً؛ الخط يأتي من `TYPOGRAPHY` أو `FONTS` (IBMPlexSansArabic).

### باقي المقاييس
`RADIUS` للزوايا، `ICON_SIZES` لأحجام الأيقونات، `CONTROL_SIZES` لارتفاعات الأزرار والحقول، `SHADOWS` للظلال، `MOTION` لمدد الحركة، `NAVIGATION` لأبعاد شريط التنقّل. لا أرقام حرفية في أي منها.

---

## 3. المكوّنات الجاهزة — استخدمها ولا تعد بناءها

### هيكل الشاشة
| بدل هذا | استخدم |
|---|---|
| `<SafeAreaView>` + `<ScrollView>` يدوي | `<Screen scroll>` |
| هيدر مبني يدوياً بزر رجوع | `<ScreenHeader title onBack>` |
| `<Text>` | `<AppText variant="...">` |
| `<TouchableOpacity>` كزر | `<Button>` |
| `<TouchableOpacity>` بأيقونة فقط | `<IconButton>` |
| `<TextInput>` | `<Input>` |
| `<View>` كبطاقة | `<Card>` |
| شريط أزرار سفلي ثابت | `<StickyActionBar>` |
| صف أزرار / عمود أزرار | `<ActionRow>` / `<ActionStack>` |
| `<ScrollView>` داخل شاشة ذات تنقّل عائم | `<ShellAwareScrollView>` |

استثناء وحيد: `src/components/ui/AppText.tsx` هو المكوّن المعرِّف، ويستخدم `Text` الخام بالضرورة. لا يُعتبر مخالفة.

### الحالات (إلزامية في كل شاشة تجلب بيانات)
`<LoadingState>` أثناء التحميل، `<ErrorState onRetry>` عند الخطأ، `<EmptyState>` عند الفراغ، `<SkeletonList>` للقوائم، `<RefreshStatus>` لحالة إعادة الجلب.
لا تكتب `<ActivityIndicator>` أو نص "جاري التحميل" يدوياً.

### العناصر
`Chip`, `StatusBadge`, `DetailRow`, `MetaRow`, `ListItem`, `RatingStars`, `ToggleField`, `SectionHeader`, `ScreenSection`, `ReadingSection`, `FormSection`, `FormValidationSummary`, `QuickActionGrid`, `WorkspaceMetricGrid`, `SelectionSheet`, `ConfirmDialog`, `QuickReportFab`.

### الحوارات والتنبيهات
- تنبيه للمستخدم: `useFeedback().showFeedback({ title, message, tone })`. **ممنوع** `Alert.alert`.
- تأكيد إجراء خطر: `<ConfirmDialog>`.
- تغييرات غير محفوظة: `useUnsavedChangesGuard` — لا تبنِ منطقاً بديلاً ولا تستدعِ `UnsavedChangesDialog` مباشرة.

### مكوّنات ميتة — لا تستخدمها ولا تحذفها
`ContentBlock`, `FilterSheet`, `RtlRow`, `ScreenStack` — صفر استخدام حالياً. والدالة `directionalIcon()` في `src/i18n/rtl.ts` غير مستدعاة إطلاقاً في المشروع.
لا تبنِ عليها ولا تحذفها؛ إذا احتجت واحدة منها، اسأل أولاً.

---

## 4. RTL

التطبيق عربي فقط و `I18nManager.forceRTL(true)` مفعّل في `app/_layout.tsx`.

**القاعدة:** في التخطيط المتدفّق (flow layout) استخدم `start` / `end` دائماً:
`paddingStart`, `paddingEnd`, `marginStart`, `marginEnd`, `borderStartWidth`, `alignSelf: "flex-start"`.
ممنوع `paddingLeft`, `paddingRight`, `marginLeft`, `marginRight` في التخطيط المتدفّق.

**الاستثناءات المسموحة لـ `left` / `right`:**
- عنصر `position: "absolute"` زخرفي بحت (glow، خلفية، رسم خريطة وهمية) — لا معنى اتجاهياً له.
- عندما تُضبط `left` و `right` **بنفس القيمة** (تمدد متناظر) — لا فرق بين RTL و LTR.

عدا ذلك، أي عنصر مطلق له معنى اتجاهي (بادج فوق صورة، زر عائم، pill حالة، عدّاد) يجب أن يستخدم `start` / `end`.

**النص:** `AppText` محاذاته الافتراضية `right` مأخوذة من `ARABIC_LAYOUT.textAlign`. لا تكتب `textAlign` يدوياً.
للمحتوى اللاتيني إجبارياً (بريد إلكتروني، رقم هاتف، رابط، رمز تحقّق) استخدم `LTR_TEXT` من `@/src/i18n/rtl` — لا `textAlign: "left"` حرفياً.

**كل صف أفقي (`flexDirection: "row"`) يجب أن يعلن اتجاهه صراحةً** خلال 5 أسطر من تعريفه (`direction: "rtl"` أو `ARABIC_LAYOUT.direction`). هذا مفروض آلياً في `check:ui-consistency`. و `flexDirection: "row-reverse"` ممنوع تماماً.

**الأيقونات الاتجاهية:** استخدم `<DirectionalIcon direction="back|forward|previous|next" />`.
لا تكتب `chevron-back` / `chevron-forward` / `arrow-forward` / `arrow-back` حرفياً في كود جديد.

⚠️ **تحذير مهم للكود القائم:** في واجهة RTL، أيقونة `chevron-back` (تشير لليسار) هي غالباً **الصحيحة بصرياً** كمؤشّر "المزيد" في القوائم. لا تفترض أن كل أيقونة مكتوبة حرفياً هي خطأ. لا تستبدل أي أيقونة اتجاهية قائمة إلا ضمن مهمة صريحة، وأدرجها في تقريرك لتُفحص بصرياً قبل الاعتماد.

---

## 5. بنية الملفات

```
app/                        ملفات المسارات فقط — سطر واحد يربط المسار بالشاشة، لا منطق ولا UI
src/features/<feature>/
  screens/                  الشاشات
  components/               مكوّنات خاصة بالميزة
  hooks/
src/components/ui/          المكوّنات المشتركة فقط
src/domain/                 قواعد العمل، معزولة عن الواجهة
src/application/            خدمات التنسيق
src/data/repositories/      المستودعات (وهمية حالياً)
src/theme/index.ts          كل التوكنز
src/i18n/rtl.ts             أدوات الاتجاه (LTR_TEXT, RTL_TEXT, directionalIcon)
src/navigation/routes.ts    كل المسارات
src/constants/config.ts     useMockApi + apiUrl
scripts/                    فحوصات الجودة الآلية
```

**قواعد:**

- **ممنوع** تعريف مكوّن مشترك داخل ملف شاشة. المشترك في `src/components/ui/`، والخاص بالميزة في `src/features/<feature>/components/`.
- **الستايلات:** المشروع يستخدم نمطين قائمين — ملف `X.styles.ts` منفصل (شاشات `auth` و `public`)، و `StyleSheet.create` داخل ملف الشاشة (باقي الميزات). **لا تنقل ملفاً من نمط لآخر.** التزم بنمط الملف الذي تعدّله، ولا تمزج النمطين في نفس الملف.
- كل مسار جديد يُضاف إلى `src/navigation/routes.ts`. **ممنوع** `as never` أو نص مسار حرفي في `router.push`.
- ملفات `app/` تبقى إعادة تصدير بسطر واحد؛ استخراج الـ params يتم داخل الشاشة.
- **ممنوع** `console.log` و `@ts-ignore` و `@ts-nocheck` و `as never` و علامات `TODO`/`FIXME`/`HACK` — كلها مفروضة آلياً في `check:final-rc` وستكسر السلسلة.
- وضع الـ API الوهمي مركزي في `src/constants/config.ts` (`useMockApi`). ممنوع أي راية `USE_MOCKS` محلية داخل ميزة.
- النصوص العربية تبقى كما هي في مكانها؛ لا تعيد صياغتها ولا تترجمها أثناء عمل تنسيقي.

---

## 6. طريقة العمل معي

1. **لا تعدّل قبل أن تعرض خطة.** لكل مهمة: اعرض قائمة الملفات وأرقام الأسطر والتغييرات المقصودة، وانتظر الموافقة صراحةً — ولا تبدأ التنفيذ حتى تصلك.
2. **دفعة واحدة في كل مرة.** لا تخلط نوعي إصلاح مختلفين في نفس التعديل.
3. **بعد كل دفعة شغّل `npm run typecheck` و `npm run lint` و `npm run test` مباشرةً وبشكل منفصل** (انظر القسم 9)، ثم `npm run check` إن كان التعديل معمارياً. أرفق الناتج كما هو.
4. **لا تصلح شيئاً لم يُطلب منك.** إذا لاحظت مشكلة أخرى، اذكرها في تقريرك ولا تلمسها.
5. **لا تغيّر السلوك.** أعمال التوحيد البصري لا تحمل منطقاً جديداً ولا حقولاً جديدة ولا تغييراً في تدفّق الشاشات.
6. إذا كان التعديل يغيّر المظهر بشكل ملحوظ، ضع عليه علامة في تقريرك ليُفحص بصرياً على `expo start --web`. لا يوجد emulator على الجهاز — الفحص البصري يدوي على الويب فقط.
7. لا تعدّل ملفات لم تُذكر في الخطة المعتمدة. إن اقتضى التعديل ملفاً إضافياً، توقّف واسأل.
8. **لا تنقل حالة الملفات من الذاكرة.** قبل أن تصف حالة ملف أو فحص، اقرأه أو شغّله. لا تعتمد على ما هو مكتوب في هذا الملف كحقيقة راهنة — قد يكون تغيّر.

---

## 7. ما هو خارج صلاحيتك بدون طلب صريح

- حذف أي ملف أو مكوّن.
- إضافة أي حزمة (dependency) جديدة.
- تعديل `src/theme/index.ts` أو `app/_layout.tsx` أو إعدادات Expo (`app.config.js`).
- تعديل `scripts/` أو ملفات الـ QA أو `eslint.config.js` أو `vitest.config.ts`.
- تعديل `package.json`.
- تعديل ملفات الاختبار (`*.test.ts`).
- تغيير نصوص المستخدم العربية.

---

## 8. دين معروف — مؤجّل، لا تعالجه بدون طلب صريح

**لا تبادر بإصلاح أي بند هنا**، ولا تدرجه ضمن أي خطة إلا إذا طُلب بالاسم:

**تصميم وتنسيق**
- **`SCREEN_SURFACES`**: القيم الأربع (`app`, `plain`, `elevated`, `subtle`) كلها `COLORS.background`. الـ prop بلا أثر بصري حالياً. قرار تصميم مؤجّل — لا تعدّله ولا تحذفه.
- **21 شاشة لا تستخدم `<Screen>` wrapper** (11 في `auth`، 7 في `public`، إضافة إلى `LaunchScreen`, `CreateReportScreen`, `SearchScreen`). تحويلها يغيّر الحشوة و safe area — مؤجّل.
- **390 قيمة مسافات خارج مقياس `SPACING`** في 32 ملفاً (مركّزة في `RegisterEntity`, `About`, `ContactUs`, `PrivacyPolicy`, `HelpCenter`, `CreateReportForm`, `TermsAndConditions`). القاعدة في القسم 2 تنطبق على **الكود الجديد**؛ التنظيف الشامل للقائم مؤجّل.
- **54 مفتاح Compatibility alias** في `COLORS`. الهجرة تدريجية ومؤجّلة.
- **16 استخدام لـ `chevron-back`** كمؤشّر قوائم — مطابق بصرياً لـ RTL، ليس خطأً. مؤجّل كتحسين اتساق فقط.

**كود وبنية**
- **نمطان لتوليد المعرّفات في `src/data/repositories/`**: خمسة ملفات تستخدم `${Date.now()}-${++this.idCounter}` (adoption, adoptionApplication, feedingPointSubmission, report, donationCampaign)، وخمسة تستخدم `${Date.now()}-${array.length}` (donationTransfer, mapPlaceApplication, servicePlace, mapPlaceChangeRequest, notification). كلاهما يعمل. التوحيد مؤجّل، ويُفضّل أن يتم عند نقل توليد المعرّفات إلى الخادم.
- **قواعد عمل داخل المستودعات الوهمية**: اعتماد طلبات التبنّي، مراجعة نقاط الإطعام، والتحقق من التحويلات — منطقها حالياً في `src/data/repositories/`. عند ربط الخلفية يجب أن ينتقل إلى الخادم. انظر `PRODUCTION-READINESS.md`.
- **9 تحذيرات ESLint** (غير حاجبة، 0 أخطاء): أربعة متغيّرات غير مستخدمة، وخمسة `react-hooks/exhaustive-deps` في `useLoginForm`, `useWelcomeScreen`, `notifications/hooks.ts`, `useOrganizationDashboard`. **لا تعدّل مصفوفات الـ deps** — ذلك تغيير سلوك قد يسبّب إعادة رسم لا نهائية، ويحتاج فحصاً فعلياً.
- **5 سكربتات معرّفة في `package.json` وغير مضمومة إلى سلسلة `check`**: `check:map-place-management`, `check:map-place-review`, `check:map-place-hardening`, `check:ui-foundation-v3`, `check:header-v3`. لم تُشغَّل منذ فترة وقد تكون فاشلة. ضمّها يحتاج قراراً منفصلاً.

---

## 9. حالة `npm run check`

**السلسلة تمرّ كاملة الآن** — 68 فحصاً معمارياً + `typecheck` + `lint` + `test` (71 اختباراً في 15 ملفاً).

لكنها 71 خطوة مربوطة بـ `&&`، و `typecheck` و `lint` و `test` في آخرها: **أي فشل في أي خطوة يحجب كل ما بعدها**. لذلك عند التحقّق من عمل جديد، شغّل الثلاثة الأهم مباشرةً وبشكل منفصل أولاً:

```
npm run typecheck
npm run lint
npm run test
```

ثم `npm run check` للسلسلة الكاملة.

**درسان من إصلاحات سابقة، انتبه لهما عند أي فشل:**

1. **قد يكون السكربت هو المتخلّف، لا الكود.** بعض سكربتات الـ QA تبحث عن نصوص حرفية في ملفات محدّدة؛ إذا تطوّر الكود ولم يُحدَّث السكربت، يفشل الفحص خطأً. اقرأ ما يتوقّعه السكربت وقارنه بالكود قبل أن تفترض أن الكود معطوب. لا تعدّل كوداً سليماً لإرضاء سكربت قديم.
2. **بعض السكربتات فيها افتراضات مسارات POSIX.** المشروع يُطوَّر على ويندوز؛ إن ظهر مسار بفواصل خلفية (`src\...`) في رسالة خطأ، اشتبه بمقارنة مسار نصية قبل أن تشتبه بالكود.