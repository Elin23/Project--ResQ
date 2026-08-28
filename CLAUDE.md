# CLAUDE.md — قواعد العمل على مشروع ResQ

هذا الملف مرجع إلزامي. قبل أي تعديل، اقرأه كاملاً والتزم به.
المشروع: تطبيق React Native / Expo، عربي بالكامل، اتجاه RTL مفروض عالمياً.
المرجع الرقمي للحالة الحالية للمشروع: `AUDIT-INVENTORY.md` في الجذر.

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
src/theme/index.ts          كل التوكنز
src/i18n/rtl.ts             أدوات الاتجاه (LTR_TEXT, RTL_TEXT, directionalIcon)
src/navigation/routes.ts    كل المسارات
src/data/                   بيانات وهمية
src/services/api/client.ts  عميل الـ API
src/constants/config.ts     useMockApi + apiUrl
```

**قواعد:**

- **ممنوع** تعريف مكوّن مشترك داخل ملف شاشة. المشترك في `src/components/ui/`، والخاص بالميزة في `src/features/<feature>/components/`.
- **الستايلات:** المشروع يستخدم نمطين قائمين — ملف `X.styles.ts` منفصل (شاشات `auth` و `public`)، و `StyleSheet.create` داخل ملف الشاشة (باقي الميزات). **لا تنقل ملفاً من نمط لآخر.** التزم بنمط الملف الذي تعدّله، ولا تمزج النمطين في نفس الملف.
- كل مسار جديد يُضاف إلى `src/navigation/routes.ts`. **ممنوع** `as never` أو نص مسار حرفي في `router.push`.
- ملفات `app/` تبقى إعادة تصدير بسطر واحد؛ استخراج الـ params يتم داخل الشاشة.
- النصوص العربية تبقى كما هي في مكانها؛ لا تعيد صياغتها ولا تترجمها أثناء عمل تنسيقي.

---

## 6. طريقة العمل معي

1. **لا تعدّل قبل أن تعرض خطة.** لكل مهمة: اعرض قائمة الملفات وأرقام الأسطر والتغييرات المقصودة، وانتظر الموافقة صراحةً.
2. **دفعة واحدة في كل مرة.** لا تخلط نوعي إصلاح مختلفين في نفس التعديل.
3. **شغّل `npm run check` بعد كل دفعة** قبل أن تعلن الانتهاء، وأرفق ناتجها.
4. **لا تصلح شيئاً لم يُطلب منك.** إذا لاحظت مشكلة أخرى، اذكرها في تقريرك ولا تلمسها.
5. **لا تغيّر السلوك.** هذه أعمال توحيد بصري: لا منطق جديد، لا حقول جديدة، لا تغيير في تدفّق الشاشات.
6. إذا كان التعديل يغيّر المظهر بشكل ملحوظ، ضع عليه علامة في تقريرك ليُفحص بصرياً على `expo start --web`. لا يوجد emulator على الجهاز — الفحص البصري يدوي على الويب فقط.
7. لا تعدّل ملفات لم تُذكر في الخطة المعتمدة. إن اقتضى التعديل ملفاً إضافياً، توقّف واسأل.

---

## 7. ما هو خارج صلاحيتك بدون طلب صريح

- حذف أي ملف أو مكوّن.
- إضافة أي حزمة (dependency) جديدة.
- تعديل `src/theme/index.ts` أو `app/_layout.tsx` أو إعدادات Expo (`app.config.js`).
- تعديل `scripts/` أو ملفات الـ QA أو `eslint.config.js`.
- تعديل `package.json`.
- تغيير نصوص المستخدم العربية.

---

## 8. دين معروف — مؤجّل، لا تعالجه بدون طلب صريح

هذه بنود معروفة وموثّقة في `AUDIT-INVENTORY.md`. **لا تبادر بإصلاحها**، ولا تدرجها ضمن أي خطة إلا إذا طُلبت بالاسم:

- **`SCREEN_SURFACES`**: القيم الأربع (`app`, `plain`, `elevated`, `subtle`) كلها `COLORS.background`. الـ prop بلا أثر بصري حالياً. قرار تصميم مؤجّل — لا تعدّله ولا تحذفه.
- **21 شاشة لا تستخدم `<Screen>` wrapper** (11 في `auth`، 7 في `public`، إضافة إلى `LaunchScreen`, `CreateReportScreen`, `SearchScreen`). تحويلها يغيّر الحشوة و safe area — مؤجّل.
- **390 قيمة مسافات خارج مقياس `SPACING`** في 32 ملفاً (مركّزة في `RegisterEntity`, `About`, `ContactUs`, `PrivacyPolicy`, `HelpCenter`, `CreateReportForm`, `TermsAndConditions`). القاعدة في القسم 2 تنطبق على **الكود الجديد**؛ التنظيف الشامل للقائم مؤجّل.
- **54 مفتاح Compatibility alias** في `COLORS`. الهجرة تدريجية ومؤجّلة.
- **16 استخدام لـ `chevron-back`** كمؤشّر قوائم — مطابق بصرياً لـ RTL، ليس خطأً. مؤجّل كتحسين اتساق فقط.

---

## 9. حالة `npm run check`

السلسلة 71 خطوة مربوطة بـ `&&`، و `typecheck` و `lint` و `test` في آخرها.
أي فشل في أي خطوة يمنع كل ما بعدها من العمل — بما فيها الثلاثة الأهم.

لذلك: عند التحقّق من عملك، **شغّل `npm run typecheck` و `npm run lint`
و `npm run test` مباشرةً وبشكل منفصل**، ولا تكتفِ بـ `npm run check`.

عائق `check:product` (ملف `SCREEN-INVENTORY.md` المفقود) تم إصلاحه بإضافة
الملف إلى الجذر — الخطوة تمرّ الآن.