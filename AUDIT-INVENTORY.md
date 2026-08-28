# AUDIT-INVENTORY — جرد وقياسات (بدون اقتراحات إصلاح)

تاريخ الجرد: 2026-08-28
نطاق الفحص: `src/` و `app/` داخل `Project--ResQ` (باستثناء `node_modules`).
هذا الملف أرقام ومسارات فقط، ناتج عن قراءة الكود الفعلي وgrep دقيق بأرقام الأسطر — لا يحتوي على أي اقتراح إصلاح.

---

## 1. جرد مكوّنات `src/components/ui`

المجلد يحتوي 48 عنصرًا: 46 ملف مكوّن/hook/provider + `index.ts` (barrel export) + `README.md`. عدد "الشاشات" المُحتسب أدناه = عدد الملفات ضمن `src/features/*/screens/*.tsx` (إجمالي 72 ملف شاشة) التي تستورد المكوّن مباشرة (سواء بـ `@/` أو بمسار نسبي). الاستخدامات داخل `src/features/*/components/*` أو `app/*` (تخطيطات Router) لا تُحتسب ضمن هذا الرقم، وموضّحة بشكل منفصل عند الحاجة.

### ActionRow (`ActionRow.tsx`)
**Props:** `children: ReactNode`, `gap?: number = SPACING.sm`, `style?: StyleProp<ViewStyle>`
**مثال حقيقي:** `src/features/feeding-points/screens/FeedingPointsScreen.tsx:82` — `<ActionRow>`
**عدد الشاشات:** 2

### ActionStack (`ActionStack.tsx`)
**Props:** `children: ReactNode`, `gap?: number = SPACING.sm`, `style?: StyleProp<ViewStyle>`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:114` — `<ActionStack>`
**عدد الشاشات:** 19

### AppText (`AppText.tsx`)
**Props:** `TextProps &` `variant?: TypographyVariant = "body"`, `size?: number`, `color?: string = COLORS.text`, `weight?: "regular"|"medium"|"bold"`, `align?: "left"|"center"|"right"|"auto" = ARABIC_LAYOUT.textAlign ("right")`, `direction?: "rtl"|"ltr"|"auto" = APP_DIRECTION`, `style?: StyleProp<TextStyle>`, `allowFontScaling = true`, `maxFontSizeMultiplier = ACCESSIBILITY.textMaxFontSizeMultiplier`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:87` — `<AppText variant="h3" weight="bold">خصوصيتك محفوظة</AppText>`
**عدد الشاشات:** 61

### Button (`Button.tsx`)
**Props:** `title: string`, `onPress: () => void`, `variant?: "primary"|"secondary"|"outline"|"danger"|"text"|"ghost"|"custom" = "primary"`, `size?: "small"|"medium"|"large" = "medium"`, `icon?: Ionicons glyph`, `iconPosition?: "start"|"end" = "start"`, `iconSize?: number`, `loading?: boolean = false`, `loadingText?: string = "جاري المعالجة..."`, `disabled?: boolean = false`, `fullWidth?: boolean = true`, `backgroundColor?: string`, `borderColor?: string`, `borderWidth?: number`, `textColor?: string`, `radius?: number = RADIUS.md`, `style?`, `textStyle?`, `accessibilityLabel?: string`, `numberOfLines?: number = 2`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:115` — `<Button title="إرسال طلب التبني" icon="heart-outline" onPress={() => void submit()} loading={submitting} disabled={!valid} />`
**عدد الشاشات:** 49

### Card (`Card.tsx`)
**Props:** `PressableProps &` `children: ReactNode`, `padding?: number = DENSITY.cardPadding`, `radius?: number = RADIUS.lg`, `backgroundColor?: string = COLORS.surfaceElevated`, `borderColor?: string = COLORS.border`, `borderWidth?: number = 1`, `shadow?: boolean = false`, `elevation?: "none"|"sm"|"md"`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:86` — `<Card disabled style={styles.notice}>`
**عدد الشاشات:** 33

### Chip (`Chip.tsx`)
**Props:** `label: string`, `color?: string = COLORS.primaryStrong`, `icon?: Ionicons glyph`, `soft?: boolean = false`, `selected?: boolean`, `onPress?: () => void`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:98` — `<Chip key={option.value} label={option.label} selected={housing === option.value} onPress={() => setHousing(option.value)} />`
**عدد الشاشات:** 16

### ConfirmDialog (`ConfirmDialog.tsx`)
**Props:** `visible: boolean`, `title: string`, `message: string`, `confirmLabel: string`, `cancelLabel?: string = "إلغاء"`, `onConfirm: () => void`, `onCancel: () => void`, `icon?: Ionicons glyph = "alert-circle-outline"`, `destructive?: boolean = true`, `loading?: boolean = false`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationStatusScreen.tsx:121` — `{decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}`
**عدد الشاشات:** 6

### ContentBlock (`ContentBlock.tsx`)
**Props:** `ViewProps &` `children: ReactNode`, `gap?: number = SPACING.xs`, `style?`
**مثال حقيقي:** لا يوجد — لا استخدام خارج ملف تعريفه وملف `index.ts` (تم التحقق عبر بحث `\bContentBlock\b` في كامل المشروع).
**عدد الشاشات:** 0

### DetailRow (`DetailRow.tsx`)
**Props:** `label: string`, `value: string`, `icon?: Ionicons glyph`, `tone?: "default"|"soft" = "default"`, `valueColor?: string`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionDetailsScreen.tsx:40` — `<DetailRow label="نوع الحيوان" value={listing.animalType} icon="paw-outline" tone="soft" />`
**عدد الشاشات:** 2

### DirectionalIcon (`DirectionalIcon.tsx`)
**Props:** `direction: "back"|"forward"|"previous"|"next"`, `size?: number = ICON_SIZES.md`, `color?: string = COLORS.icon`
**مثال حقيقي:** `src/features/profile/components/ProfileMenuSection.tsx:21` (ملف components وليس screens) — `<DirectionalIcon direction="back" size={ICON_SIZES.sm} color={COLORS.brownMuted} />`. الاستخدام الآخر داخلي: `src/components/ui/ScreenHeader.tsx:83`.
**عدد الشاشات:** 0

### EmptyState (`EmptyState.tsx`)
**Props:** `title: string`, `description?: string`, `icon?: Ionicons glyph = "file-tray-outline"`, `actionTitle?: string`, `onActionPress?: () => void`, `compact?: boolean = false`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:54` — `<EmptyState title="الحيوان غير متاح" description="قد يكون الإعلان مغلقًا أو غير متاح للتبني حاليًا." />`
**عدد الشاشات:** 32

### ErrorState (`ErrorState.tsx`)
**Props:** `title?: string = "حدث خطأ"`, `description: string`, `retryTitle?: string = "المحاولة مجددًا"`, `onRetry?: () => void`, `style?` (يبني على `EmptyState`)
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:53` — `<ErrorState description={details.error} onRetry={() => void details.reload()} />`
**عدد الشاشات:** 39

### FeedbackProvider (`FeedbackProvider.tsx`)
**Props Provider:** `{ children: ReactNode }`. **Hook `useFeedback()` يُرجع:** `{ showFeedback(options), hideFeedback() }` حيث `options: { title, message?, tone?: "success"|"error"|"warning"|"info", durationMs?, actionLabel?, onAction? }`
**مثال حقيقي:** Provider يُركَّب في `app/_layout.tsx:63`. استدعاء `showFeedback` في `src/features/adoption/screens/AdoptionApplicationScreen.tsx:76` — `showFeedback({ title: "تعذر إرسال الطلب", message: ..., tone: "error" });`
**عدد الشاشات:** 18 (تستدعي `useFeedback`)

### FilterSheet (`FilterSheet.tsx`)
**Props:** `visible: boolean`, `onApply: (filters: { animalType: string; condition: string }) => void`, `onClose: () => void`
**مثال حقيقي:** لا يوجد — لا استخدام خارج ملف تعريفه (تم التحقق: لا وجود لـ `FilterSheet` في أي مكان آخر بالمشروع).
**عدد الشاشات:** 0

### FloatingGlassTabBar (`FloatingGlassTabBar.tsx`)
**Props:** `BottomTabBarProps &` `tabs: Record<string, { label: string; icon: IconName; iconFocused?: IconName }>`
**مثال حقيقي:** `app/(user)/(tabs)/_layout.tsx:31` — `tabBar={(props) => <FloatingGlassTabBar {...props} tabs={tabs} />}` (تخطيط Router وليس ملف screens)
**عدد الشاشات:** 0

### FloatingNavigationProvider / useFloatingNavigation (`FloatingNavigationContext.tsx`)
**Props Provider:** `{ children: ReactNode }`. **Hook يُرجع:** `{ overlay, contentBottomInset, navBarBottomOffset, navBarHeight, quickActionBottomOffset }`
**مثال حقيقي:** `app/(user)/(tabs)/_layout.tsx:29` — `<FloatingNavigationProvider>`. مستخدم داخليًا أيضًا في `Screen.tsx` و`QuickReportFab.tsx`.
**عدد الشاشات:** 0

### FormSection (`FormSection.tsx`)
**Props:** `children: ReactNode`, `title: string`, `subtitle?: string`, `actionLabel?: string`, `onActionPress?: () => void`, `compact?: boolean = false`, `cardStyle?`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/CreateAdoptionListingScreen.tsx:336` — `<FormSection title="صور الحيوان" subtitle="اختر صورًا واضحة ومتنوعة؛ الصورة الأولى ستكون الرئيسية.">`
**عدد الشاشات:** 3

### FormValidationSummary (`FormValidationSummary.tsx`)
**Props:** `errors: string[]`, `title?: string = "راجع البيانات التالية"`
**مثال حقيقي:** `src/features/adoption/screens/CreateAdoptionListingScreen.tsx:334` — `<FormValidationSummary errors={showValidation ? validationErrors : []} />`
**عدد الشاشات:** 4

### GuestPromoCard (`GuestPromoCard.tsx`)
**Props:** `onCreateAccount: () => void`, `onLogin: () => void`
**مثال حقيقي:** `src/features/home/screens/HomeScreen.tsx:37-39` — `<GuestPromoCard onCreateAccount={() => router.push("/choose-account")} onLogin={() => router.push("/login")} .../>`
**عدد الشاشات:** 1

### IconButton (`IconButton.tsx`)
**Props:** `icon: Ionicons glyph`, `onPress: () => void`, `accessibilityLabel: string`, `size?: number = ICON_SIZES.md`, `color?: string = COLORS.icon`, `disabled?: boolean = false`, `hitSlop?: number = 8`, `contained?: boolean = false`, `style?`
**مثال حقيقي:** `src/features/donations/screens/DonationCampaignDetailsScreen.tsx:96` — `<IconButton icon="share-social-outline" accessibilityLabel="مشاركة الحملة" onPress={() => void shareCampaign()} />`
**عدد الشاشات:** 5

### Input (`Input.tsx`)
**Props:** `TextInputProps &` `label?: string`, `error?: string`, `helperText?: string`, `required?: boolean = false`, `icon?: Ionicons glyph`, `iconColor?: string`, `iconSize?: number = ICON_SIZES.lg`, `password?: boolean = false`, `prefix?: string`, `prefixWidth?: number = 98`, `disabled?: boolean = false`, `readOnly?: boolean = false`, `containerStyle?`, `fieldStyle?`, `inputStyle?`, `iconPosition?: "leading"|"trailing"`, `onIconPress?: () => void`, `contentDirection?: ContentDirection = "auto"`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:91` — `<Input label="الاسم" value={applicantName} onChangeText={setApplicantName} required />`
**عدد الشاشات:** 20

### ListItem (`ListItem.tsx`)
**Props:** `title: string`, `subtitle?: string`, `leading?: ReactNode`, `trailing?: ReactNode`, `icon?: Ionicons glyph`, `onPress?: () => void`, `accessibilityLabel?: string`, `style?`
**مثال حقيقي:** `src/features/profile/components/ProfileMenuSection.tsx:15-22` (ملف components وليس screens) — `<ListItem key={item.id} title={item.label} onPress={...} leading={...} trailing={...} />`
**عدد الشاشات:** 0

### LoadingState (`LoadingState.tsx`)
**Props:** `label?: string = "جاري التحميل..."`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:52` — `<LoadingState label="جاري تجهيز طلب التبني..." />`
**عدد الشاشات:** 34

### MetaRow (`MetaRow.tsx`)
**Props:** `text: string`, `icon?: Ionicons glyph`, `color?: string = COLORS.textSecondary`, `numberOfLines?: number = 1`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/MyAdoptionListingsScreen.tsx:124` — `<MetaRow icon="paw-outline" text={...} />`
**عدد الشاشات:** 1

### QuickActionGrid (`QuickActionGrid.tsx`)
**Props:** `actions: { key, label, icon, color, iconBackgroundColor?, onPress }[]`, `columns?: 2|3 = 2`
**مثال حقيقي:** `src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx:172` — `<QuickActionGrid actions={infoActions} columns={2} />`
**عدد الشاشات:** 2

### QuickReportFab (`QuickReportFab.tsx`)
**Props:** `onPress: () => void`, `accessibilityLabel?: string = "إنشاء بلاغ جديد"`
**مثال حقيقي:** `src/features/reports/screens/ReportsScreen.tsx:90` — `<QuickReportFab onPress={createReport} />`
**عدد الشاشات:** 1

### RatingStars (`RatingStars.tsx`)
**Props:** `rating: number`, `ratingsCount?: number`, `size?: number = 16`, `color?: string = COLORS.rating`, `showValue?: boolean = true`
**مثال حقيقي:** `src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx:167` — `<RatingStars rating={point.rating} ratingsCount={point.ratingsCount} />`
**عدد الشاشات:** 1

### ReadingSection (`ReadingSection.tsx`)
**Props:** `title: string`, `subtitle?: string`, `children: ReactNode`, `actionLabel?: string`, `onActionPress?: () => void`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionDetailsScreen.tsx:44` — `<ReadingSection title="عن الحالة">`
**عدد الشاشات:** 3

### RefreshStatus (`RefreshStatus.tsx`)
**Props:** `refreshing?: boolean = false`, `error?: string|null`, `stale?: boolean = false`, `lastUpdatedAt?: number|null`, `onRetry?: () => void`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionScreen.tsx:51` — `<RefreshStatus refreshing={refreshing} error={refreshError} stale={isStale} lastUpdatedAt={lastUpdatedAt} onRetry={() => void reload()} />`
**عدد الشاشات:** 5

### RtlRow (`RtlRow.tsx`)
**Props:** `ViewProps &` `children: ReactNode`, `gap?: number = SPACING.sm`, `align?: ViewStyle["alignItems"] = "center"`, `justify?: ViewStyle["justifyContent"] = "flex-start"`, `wrap?: boolean = false`, `style?`
**مثال حقيقي:** لا يوجد — لا استخدام خارج ملف تعريفه (تم التحقق عبر بحث `\bRtlRow\b`).
**عدد الشاشات:** 0

### Screen (`Screen.tsx`)
**Props:** `children`, `scroll?: boolean = false`, `keyboardAware?: boolean = true`, `padded?: boolean = true`, `horizontalPadding?: number`, `surface?: ScreenSurface = "app"`, `backgroundColor?: string`, `centered?: boolean = false`, `constrainWidth?: boolean = true`, `safeAreaEdges?: Edge[] = ["top","right","bottom","left"]`, `style?`, `contentContainerStyle?`, `scrollProps?`, `footer?: ReactNode`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:52` — `<Screen><LoadingState label="جاري تجهيز طلب التبني..." /></Screen>`
**عدد الشاشات:** 51

### ScreenHeader (`ScreenHeader.tsx`)
**Props:** `title: string`, `subtitle?: string`, `onBack?: () => void`, `right?: ReactNode`, `backAccessibilityLabel?: string = "العودة"`, `style?`, `horizontalPadding?: number = LAYOUT.screenPadding`, `tone?: "surface"|"transparent" = "surface"`, `titleAlignment?: "start"|"center" = "start"`, `elevated?: boolean = false`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationScreen.tsx:84` — `<ScreenHeader title="طلب تبني" subtitle={...} onBack={() => router.back()} />`
**عدد الشاشات:** 59

### ScreenSection (`ScreenSection.tsx`)
**Props:** `children`, `title?: string`, `subtitle?: string`, `actionLabel?: string`, `onActionPress?: () => void`, `gap?: number = LAYOUT.cardGap`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/MyAdoptionListingsScreen.tsx:96` — `<ScreenSection title="الإعلانات" subtitle="الأحدث تحديثًا مع حالة المراجعة الحالية">`
**عدد الشاشات:** 4

### ScreenStack (`ScreenStack.tsx`)
**Props:** `children`, `gap?: number = DENSITY.sectionGap`, `style?`
**مثال حقيقي:** لا يوجد — لا استخدام خارج ملف تعريفه (تم التحقق عبر بحث `\bScreenStack\b`).
**عدد الشاشات:** 0

### SectionHeader (`SectionHeader.tsx`)
**Props:** `title: string`, `subtitle?: string`, `actionLabel?: string`, `onActionPress?: () => void`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx:179` — `<SectionHeader title="لوحة إدارة الإعلان" />`
**عدد الشاشات:** 11

### SelectionSheet (`SelectionSheet.tsx`)
**Props:** `visible: boolean`, `title: string`, `options: { value, label, description? }[]`, `selectedValue?: string`, `onSelect: (value: string) => void`, `onClose: () => void`
**مثال حقيقي:** `src/features/reports/components/CreateReportForm.tsx:637` (ملف components وليس screens) — `<SelectionSheet visible={animalTypeSheetVisible} title="نوع الحيوان" .../>`
**عدد الشاشات:** 0

### ShellAwareScrollView (`ShellAwareScrollView.tsx`)
**Props:** `ScrollViewProps` (forwardRef، بدون props إضافية بخلاف `contentContainerStyle` القياسي)
**مثال حقيقي:** `src/features/organizations/screens/OrganizationsScreen.tsx:24` — `<ShellAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>`
**عدد الشاشات:** 6

### SkeletonBlock / SkeletonCard / SkeletonList (`Skeleton.tsx`)
**Props SkeletonBlock:** `width?, height: number, radius? = RADIUS.md, style?`. **SkeletonCard:** `image? = true, lines? = 3, compact? = false, style?`. **SkeletonList:** `count? = 3, image? = true, compact? = false, style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionScreen.tsx:52` — `<SkeletonList count={3} />`
**عدد الشاشات:** 5 (كلها عبر `SkeletonList`)

### StatusBadge (`StatusBadge.tsx`)
**Props:** `label: string`, `color?: string = COLORS.text`, `background?: string`, `icon?: Ionicons glyph`, `dot?: boolean = false`, `size?: "sm"|"md" = "md"`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/AdoptionApplicationStatusScreen.tsx:49` — `<StatusBadge label={copy.label} color={copy.color} />`
**عدد الشاشات:** 19

### StickyActionBar (`StickyActionBar.tsx`)
**Props:** `children: ReactNode`, `style?`
**مثال حقيقي:** `src/features/adoption/screens/CreateAdoptionListingScreen.tsx:306` — `<StickyActionBar>`
**عدد الشاشات:** 5

### ToggleField (`ToggleField.tsx`)
**Props:** `label: string`, `description?: string`, `value: boolean`, `onValueChange: (value: boolean) => void`, `disabled?: boolean = false`
**مثال حقيقي:** `src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx:39` — `<ToggleField label="استقبال حالات مجانية" description="..." value={acceptsFreeCases} onValueChange={setAcceptsFreeCases}/>`
**عدد الشاشات:** 2

### TopBar (`TopBar.tsx`)
**Props:** `onNotificationsPress?: () => void`, `onSearchPress?: () => void`, `avatarUri?: string`, `avatarLabel?: string = "فتح الحساب الشخصي"`, `onAvatarPress?: () => void`, `style?`
**مثال حقيقي:** `app/(user)/(tabs)/(home)/_layout.tsx:20` (تخطيط Router وليس ملف screens) — `<TopBar onSearchPress={...} onNotificationsPress={...} avatarUri={...} .../>`
**عدد الشاشات:** 0

### UnsavedChangesDecisionProvider / useUnsavedChangesDecision (`UnsavedChangesDecisionProvider.tsx`)
**Props Provider:** `{ children }`. **Hook يُرجع:** `{ requestUnsavedChangesDecision(request) }` حيث `request: { title?, message?, saveDraftLabel?, onDiscard, onSaveDraft? }`
**مثال حقيقي:** Provider في `app/_layout.tsx:64`. استدعاء الـ hook في `src/hooks/useUnsavedChangesGuard.ts:21` — `const { requestUnsavedChangesDecision } = useUnsavedChangesDecision();`
**عدد الشاشات:** 0

### UnsavedChangesDialog (`UnsavedChangesDialog.tsx`)
**Props:** `visible: boolean`, `title?: string = "لديك تغييرات غير محفوظة"`, `message?: string`, `saveDraftLabel?: string`, `showSaveDraft?: boolean = false`, `loading?: boolean = false`, `onContinue: () => void`, `onDiscard: () => void`, `onSaveDraft?: () => void`
**مثال حقيقي:** استخدام داخلي فقط، من `UnsavedChangesDecisionProvider.tsx:64-74` — لا استدعاء خارج ذلك الملف.
**عدد الشاشات:** 0

### useResponsiveLayout (`useResponsiveLayout.ts`)
**يُرجع:** `{ width, height, isNarrow, isCompact, isShort }` (بدون props، hook)
**مثال حقيقي:** `src/features/donations/screens/DonationsScreen.tsx:87` — `const { isNarrow } = useResponsiveLayout();`
**عدد الشاشات:** 1

### WorkspaceMetricGrid (`WorkspaceMetricGrid.tsx`)
**Props:** `metrics: { key, label, value, icon?, color?, backgroundColor? }[]`, `columns?: 2|3 = 2`
**مثال حقيقي:** `src/features/home/screens/HomeScreen.tsx:50` — `<WorkspaceMetricGrid metrics={USER_HOME_METRICS} />`
**عدد الشاشات:** 5

---

## 2. محتوى `src/theme/index.ts` بالكامل (أسماء وقيم حرفية)

### PALETTE (الألوان الخام)
```
orange50: #FFF7F2   orange100: #FFF0E8   orange200: #FFD8C2   orange300: #FFB68D   orange400: #FF9B63
orange500: #FF8849   orange600: #E66F30   orange700: #B64E00   orange800: #8B3B00   orange900: #603016
green50: #EFF9EF     green100: #E7FAE9    green200: #B9D7C1    green300: #94F990    green500: #48B857
green600: #18833B    green700: #16833A    green800: #006E1C
blue50: #EAF7FD      blue100: #E4F5FC     blue300: #A9DDF1     blue500: #2BB5F6     blue800: #00658D
blue900: #004360
red50: #FFF5F5       red500: #C92335      red600: #D32F2F      red700: #BA1A1A
amber50: #FFF2D9     amber300: #FFD08C    amber500: #FFB020    amber700: #C2410C
neutral0: #FFFFFF    neutral25: #FFFFFF   neutral50: #F9F8FC   neutral75: #FFFFFF   neutral100: #F3F3F6
neutral150: #EFEFF1  neutral200: #E8E8EA  neutral250: #E4E1DF  neutral300: #E2E2E5  neutral400: #BDBDBD
neutral500: #9E9E9E  neutral550: #7C8A80  neutral600: #777B75  neutral650: #646A64  neutral700: #4D514A
neutral800: #332D2A  neutral900: #1A1A1A  neutral950: #000000
```

### COLORS (رموز دلالية → تُشتق من PALETTE)
```
primary: orange500 (#FF8849)         primaryPressed: orange600 (#E66F30)   primaryStrong: orange700 (#B64E00)
primarySoft: orange100 (#FFF0E8)     secondary: green500 (#48B857)         secondaryStrong: green600 (#18833B)
secondarySoft: green50 (#EFF9EF)     accent: blue500 (#2BB5F6)
background: neutral0 (#FFFFFF)       surface: neutral0 (#FFFFFF)           surfaceSubtle: neutral0 (#FFFFFF)
surfaceMuted: neutral100 (#F3F3F6)   surfaceElevated: neutral0 (#FFFFFF)
text: neutral900 (#1A1A1A)           textSecondary: neutral700 (#4D514A)   textMuted: neutral650 (#646A64)
textInverse: neutral0 (#FFFFFF)      icon: neutral800 (#332D2A)            iconMuted: neutral600 (#777B75)
placeholder: neutral500 (#9E9E9E)
border: neutral300 (#E2E2E5)         borderStrong: neutral400 (#BDBDBD)    divider: neutral200 (#E8E8EA)
disabled: neutral400 (#BDBDBD)       disabledSurface: neutral150 (#EFEFF1)
success: green600 (#18833B)          successSoft: green50 (#EFF9EF)        danger: red600 (#D32F2F)
dangerSoft: red50 (#FFF5F5)          warning: amber700 (#C2410C)           warningSoft: amber50 (#FFF2D9)
info: blue500 (#2BB5F6)              infoSoft: blue50 (#EAF7FD)
white: neutral0 (#FFFFFF)            black: neutral950 (#000000)           transparent: "transparent"
backdrop: #00000066                  glassSurface: rgba(248,249,248,0.54)  glassSurfaceIos: rgba(248,249,248,0.58)
glassSurfaceAndroid: rgba(248,249,248,0.70)   glassBorder: rgba(255,255,255,0.72)   glassActive: rgba(255,136,73,0.16)
shadow: neutral950 (#000000)         onColor: neutral0 (#FFFFFF)

-- Compatibility aliases (وصف الكود نفسه: "migrate feature code gradually to semantic tokens") --
neutral: neutral300 (#E2E2E5)        lightgray: neutral100 (#F3F3F6)       darkgray: neutral200 (#E8E8EA)
brown: orange700 (#B64E00)           brownDark: orange900 (#603016)        bgblue: blue800 (#00658D)
textblue: blue500 (#2BB5F6)          bggreen: green800 (#006E1C)           textgreen: green800 (#006E1C)
strengthStrong: green600 (#18833B)   strengthMedium: #E38A2E               strengthWeak: red500 (#C92335)
statusPending: orange500 (#FF8849)   statusPendingLight: #FFE7A8
orgStatOrangeBg: orange100 (#FFF0E8) orgStatOrangeBorder: #FFC9AE          orgStatGreenBg: green100 (#E7FAE9)
orgStatGreenBorder: #A6E7AE          orgStatBlueBg: blue100 (#E4F5FC)      orgStatBlueBorder: blue300 (#A9DDF1)
orgStatYellowBg: amber50 (#FFF2D9)   orgStatYellowBorder: amber300 (#FFD08C)
contactPhoneBg: orange100 (#FFF0E8)  contactEmailBg: #E9F7FD
orgDashboardHeroBg: #FFF2EA          orgDashboardHeroBorder: #F3CDB8       orgDashboardHeroMark: #F3E4DD
orgAchievementGreenBg: green50 (#EFF9EF)      orgAchievementGreenBorder: #B8E3BC
orgAchievementOrangeBg: #FFF3EA      orgAchievementOrangeBorder: #FFD0B5
orgAchievementBlueBg: blue50 (#EAF7FD)        orgAchievementBlueBorder: #B3E2F6
orgAchievementLockedBg: #F3F1F1      orgAchievementLockedBorder: #DCC7BA
statusApproved: blue500 (#2BB5F6)    statusClosed: green500 (#48B857)
rescueSoft: #FFF5F0                  rescueBorder: #EFCFBE                 rescueDangerSoft: red50 (#FFF5F5)
rescueMapOverlay: #FFF8F3            rescueSuccess: green500 (#48B857)     rescueSuccessSoft: #E9F8EB
rescueInput: #F4F4F7                 rating: amber500 (#FFB020)            urgent: red700 (#BA1A1A)
peach: orange300 (#FFB68D)           brownMuted: #564338                   ink: #1A1C1E
navy: blue900 (#004360)              tan: #DDC1B3                          offwhite: #EEEEF0
successDark: #00731E                 successLight: green300 (#94F990)
```
**عدد مفاتيح COLORS الكلي:** 98 مفتاحًا (منها 54 مفتاح "Compatibility alias" موسومة صراحة في تعليق الكود كطبقة توافق مؤقتة، أسطر 122–176 من `src/theme/index.ts`، ضمن قسم يبدأ بالتعليق `// Compatibility aliases - migrate feature code gradually to semantic tokens.` عند السطر 122).

### SCREEN_SURFACES
```
app: COLORS.background      plain: COLORS.background     elevated: COLORS.background     subtle: COLORS.background
```
(كل القيم الأربع تُساوي حاليًا `COLORS.background` = `#FFFFFF`.)

### ACCESSIBILITY
```
textMaxFontSizeMultiplier: 1.8
controlTextMaxFontSizeMultiplier: 1.6
```

### ARABIC_LAYOUT
```
direction: "rtl"
textAlign: "right"
start: "right"
end: "left"
```

### FONTS
```
regular: "IBMPlexSansArabic_400Regular"
medium: "IBMPlexSansArabic_500Medium"
bold: "IBMPlexSansArabic_700Bold"
```

### FONT_SIZES (معلّق عليها في الكود: "Backwards-compatible raw font sizes. Prefer TYPOGRAPHY in new code.")
```
displayLarge: 30   headline: 21   title: 17   body: 14   label: 12   caption: 11
```

### TYPOGRAPHY (fontSize / lineHeight / fontFamily)
```
display:    fontSize 30, lineHeight 39, fontFamily FONTS.bold
h1:         fontSize 22, lineHeight 31, fontFamily FONTS.bold
h2:         fontSize 19, lineHeight 28, fontFamily FONTS.bold
h3:         fontSize 17, lineHeight 25, fontFamily FONTS.medium
bodyLarge:  fontSize 15, lineHeight 23, fontFamily FONTS.regular
body:       fontSize 14, lineHeight 22, fontFamily FONTS.regular
bodySmall:  fontSize 13, lineHeight 20, fontFamily FONTS.regular
label:      fontSize 12, lineHeight 18, fontFamily FONTS.medium
caption:    fontSize 11, lineHeight 17, fontFamily FONTS.regular
```

### SPACING (مقياس المرجع لقسم 4)
```
none: 0   xxs: 2   xs: 4   sm: 8   md: 12   lg: 16   xl: 24   "2xl": 32   "3xl": 40
```

### RADIUS
```
xs: 6   sm: 8   md: 12   lg: 16   xl: 20   "2xl": 24   full: 999
```

### CONTROL_SIZES
```
buttonSmall: 44   buttonMedium: 46   buttonLarge: 50   input: 50   inputMultiline: 104
iconButton: 44    topBar: 58        tabBar: 68
```

### NAVIGATION
```
horizontalInset: 16   bottomInsetMin: 8   maxWidth: 720   barRadius: 24   barHorizontalPadding: 8
barVerticalPadding: 6 itemMinHeight: 56   iconSlotSize: 30  activeIndicatorWidth: 24
activeIndicatorHeight: 3   quickActionGap: 12
```

### DENSITY
```
narrowScreenBreakpoint: 360     compactScreenBreakpoint: 380     shortScreenBreakpoint: 700
compactScreenPadding: 12        screenVerticalPadding: 12        compactScreenVerticalPadding: 8
cardPadding: 14                 compactCardPadding: 12           sectionGap: 20
itemGap: 10                     controlGap: 8                    touchTargetMin: 44
quickActionMinHeight: 96        quickActionIcon: 44               readingMaxWidth: 620
```

### ICON_SIZES
```
xs: 14   sm: 18   md: 20   lg: 24   xl: 28
```

### LAYOUT
```
screenPadding: 16   contentMaxWidth: 720   sectionGap: DENSITY.sectionGap (20)   cardGap: DENSITY.itemGap (10)
```

### MOTION
```
duration:   instant 120, fast 180, standard 280, expressive 420, slow 650
launch:     minimumVisible 2400, exit 320, progress 2100
onboarding: initialEnter 420, slideOut 180, slideIn 320, completionExit 300
```

### SHADOWS
```
none: {}
sm: shadowColor COLORS.shadow, shadowOffset {0,1}, shadowOpacity 0.06, shadowRadius 3, elevation 1
md: shadowColor COLORS.shadow, shadowOffset {0,3}, shadowOpacity 0.08, shadowRadius 8, elevation 3
lg: shadowColor COLORS.shadow, shadowOffset {0,6}, shadowOpacity 0.10, shadowRadius 16, elevation 5
```

---

## 3. جدول كل الشاشات (72 ملف — `src/features/*/screens/*.tsx`)

عمود "Screen wrapper" = هل الملف يستورد `Screen` من `src/components/ui/Screen` (بأي اسم محلي). عمود "الاستيراد" = طريقة استيراد الوحدات المشتركة (`src/components/ui`, `src/theme`, `src/navigation`...): إمّا بأسلوب `@/` أو بمسار نسبي متعدد المستويات (`../../../`) يتجاوز مجلد الميزة نفسها. (لا يُحتسب هنا استيراد ملف مجاور داخل نفس مجلد الميزة مثل `../hooks/x` كـ"نسبي" بمعنى المخالفة.)

| المسار | Screen wrapper | الاستيراد |
|---|---|---|
| src/features/adoption/screens/AdoptionApplicationScreen.tsx | نعم | @/ |
| src/features/adoption/screens/AdoptionApplicationStatusScreen.tsx | نعم | @/ |
| src/features/adoption/screens/AdoptionDetailsScreen.tsx | نعم | @/ |
| src/features/adoption/screens/AdoptionListingApplicationsScreen.tsx | نعم | @/ |
| src/features/adoption/screens/AdoptionScreen.tsx | نعم | @/ |
| src/features/adoption/screens/CreateAdoptionListingScreen.tsx | نعم | @/ |
| src/features/adoption/screens/MyAdoptionApplicationsScreen.tsx | نعم | @/ |
| src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx | نعم | @/ |
| src/features/adoption/screens/MyAdoptionListingsScreen.tsx | نعم | @/ |
| src/features/adoption/screens/OwnerAdoptionApplicationDetailsScreen.tsx | نعم | @/ |
| src/features/auth/screens/ChooseAccountScreen.tsx | لا | @/ |
| src/features/auth/screens/CreateNewPasswordScreen.tsx | لا | @/ |
| src/features/auth/screens/ForgotPasswordScreen.tsx | لا | @/ |
| src/features/auth/screens/LoginScreen.tsx | لا | @/ |
| src/features/auth/screens/PasswordResetSuccessScreen.tsx | لا | @/ |
| src/features/auth/screens/RegisterEntityScreen.tsx | لا | @/ |
| src/features/auth/screens/RegisterUserScreen.tsx | لا | @/ |
| src/features/auth/screens/RegistrationPendingScreen.tsx | لا | @/ |
| src/features/auth/screens/RegistrationSuccessScreen.tsx | لا | @/ |
| src/features/auth/screens/VerifyRegistrationPhoneScreen.tsx | لا | @/ |
| src/features/auth/screens/VerifyResetCodeScreen.tsx | لا | @/ |
| src/features/donations/screens/CreateDonationCampaignScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationCampaignDetailsScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationCampaignOwnerScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationCheckoutEntryScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationTransferDetailsScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationTransferSubmittedScreen.tsx | نعم | @/ |
| src/features/donations/screens/DonationsScreen.tsx | نعم | @/ |
| src/features/donations/screens/MyDonationCampaignsScreen.tsx | نعم | @/ |
| src/features/donations/screens/MyDonationsScreen.tsx | نعم | @/ |
| src/features/donations/screens/OwnedDonationCampaignStatusScreen.tsx | نعم | @/ |
| src/features/explore/screens/ExploreScreen.tsx | نعم | @/ |
| src/features/feeding-points/screens/CreateFeedingPointScreen.tsx | نعم | @/ |
| src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx | نعم | نسبي (../../../) |
| src/features/feeding-points/screens/FeedingPointSubmissionDetailsScreen.tsx | نعم | @/ |
| src/features/feeding-points/screens/FeedingPointSubmissionsScreen.tsx | نعم | @/ |
| src/features/feeding-points/screens/FeedingPointsScreen.tsx | نعم | نسبي (../../../) |
| src/features/home/screens/HomeScreen.tsx | نعم | @/ |
| src/features/launch/screens/LaunchScreen.tsx | لا | @/ |
| src/features/map-places/screens/EditMapPlaceApplicationScreen.tsx | نعم | @/ |
| src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx | نعم | @/ |
| src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx | نعم | @/ |
| src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx | نعم | @/ |
| src/features/map-places/screens/MapPlaceChangeRequestScreen.tsx | نعم | @/ |
| src/features/map-places/screens/MyMapPlacesScreen.tsx | نعم | @/ |
| src/features/map/screens/MapScreen.tsx | نعم | @/ |
| src/features/map/screens/ServicePlaceDetailsScreen.tsx | نعم | @/ |
| src/features/notifications/screens/NotificationsScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationProfileScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationReportDetailsScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationTaskCompletedScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx | نعم | @/ |
| src/features/organization-dashboard/screens/OrganizationTasksScreen.tsx | نعم | @/ |
| src/features/organizations/screens/OrganizationDetailsScreen.tsx | نعم | @/ |
| src/features/organizations/screens/OrganizationsScreen.tsx | نعم | @/ |
| src/features/profile/screens/EditProfileScreen.tsx | نعم | @/ |
| src/features/profile/screens/ProfileScreen.tsx | نعم | @/ |
| src/features/public/screens/AboutScreen.tsx | لا | @/ |
| src/features/public/screens/ContactUsScreen.tsx | لا | @/ |
| src/features/public/screens/HelpCenterScreen.tsx | لا | @/ |
| src/features/public/screens/OnboardingScreen.tsx | لا | @/ |
| src/features/public/screens/PrivacyPolicyScreen.tsx | لا | @/ |
| src/features/public/screens/TermsAndConditionsScreen.tsx | لا | @/ |
| src/features/public/screens/WelcomeScreen.tsx | لا | @/ |
| src/features/reports/screens/CreateReportScreen.tsx | لا | @/ |
| src/features/reports/screens/ReportsScreen.tsx | نعم | @/ |
| src/features/search/screens/SearchResultDetailsScreen.tsx | نعم | @/ |
| src/features/search/screens/SearchScreen.tsx | لا | @/ |
| src/features/vets/screens/VeterinaryClinicDetailsScreen.tsx | نعم | @/ |
| src/features/vets/screens/VeterinaryClinicsScreen.tsx | نعم | @/ |

**الإجمالي:** 72 شاشة. تستخدم `Screen` wrapper: 51. لا تستخدمه: 21 (11 شاشات `auth`، 7 شاشات `public`، بالإضافة إلى `LaunchScreen.tsx`، `CreateReportScreen.tsx`، `SearchScreen.tsx`). تستورد بمسار نسبي متعدد المستويات بدل `@/` لوحدات مشتركة (`components/ui`, `theme`, `navigation`): 2 فقط — كلاهما في `src/features/feeding-points/screens/`.

---

## 4. قيم `padding` / `margin` المكتوبة يدويًا ولا تطابق أي قيمة في `SPACING`

قيم `SPACING` المرجعية: `0, 2, 4, 8, 12, 16, 24, 32, 40` (انظر قسم 2). كل قيمة رقمية أدناه مكتوبة حرفيًا (وليست `SPACING.xxx`) في أحد خصائص: `padding`, `paddingTop/Bottom/Left/Right/Horizontal/Vertical/Start/End`, `margin`, `marginTop/Bottom/Left/Right/Horizontal/Vertical/Start/End`، ولا تساوي أيًا من قيم `SPACING` أعلاه. تم استثناء `src/theme/index.ts` نفسه (مصدر القيم). العدد الإجمالي: **390 حالة** موزعة على **32 ملفًا**.

**ملخص عدد الحالات لكل ملف:**
| الملف | عدد الحالات |
|---|---|
| src/features/auth/screens/RegisterEntity.styles.ts | 49 |
| src/features/public/screens/About.styles.ts | 46 |
| src/features/public/screens/ContactUs.styles.ts | 31 |
| src/features/public/screens/PrivacyPolicy.styles.ts | 28 |
| src/features/public/screens/HelpCenter.styles.ts | 28 |
| src/features/reports/components/CreateReportForm.tsx | 27 |
| src/features/public/screens/TermsAndConditions.styles.ts | 23 |
| src/features/auth/screens/ChooseAccountScreen.tsx | 20 |
| src/features/auth/screens/VerifyRegistrationPhoneScreen.tsx | 19 |
| src/features/auth/screens/RegistrationSuccess.styles.ts | 18 |
| src/features/auth/screens/RegisterUser.styles.ts | 18 |
| src/features/auth/screens/VerifyResetCode.styles.ts | 17 |
| src/features/auth/screens/ForgotPassword.styles.ts | 10 |
| src/features/auth/screens/RegistrationPendingScreen.tsx | 9 |
| src/features/auth/screens/CreateNewPassword.styles.ts | 9 |
| src/features/auth/screens/Login.styles.ts | 8 |
| src/features/auth/screens/PasswordResetSuccess.styles.ts | 7 |
| src/features/auth/components/registrationShared.styles.ts | 4 |
| src/features/reports/components/ReportSuccessView.tsx | 3 |
| src/features/launch/screens/Launch.styles.ts | 3 |
| src/features/feeding-points/components/UrgentRefillCard.tsx | 2 |
| src/features/search/screens/Search.styles.ts | 1 |
| src/features/public/screens/Welcome.styles.ts | 1 |
| src/features/public/screens/Onboarding.styles.ts | 1 |
| src/features/organizations/screens/OrganizationDetailsScreen.tsx | 1 |
| src/features/organizations/components/OrganizationCard.tsx | 1 |
| src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx | 1 |
| src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx | 1 |
| src/features/organization-dashboard/components/EmergencyCasesSection.tsx | 1 |
| src/features/map-places/components/OpeningHoursEditor.tsx | 1 |
| src/features/auth/components/password-reset/PasswordRequirementsCard.tsx | 1 |
| src/features/adoption/screens/CreateAdoptionListingScreen.tsx | 1 |

**التفصيل الكامل (ملف ← رقم السطر ← الخاصية والقيمة):**

**src/features/adoption/screens/CreateAdoptionListingScreen.tsx**
- L429: `paddingVertical: 3`

**src/features/auth/components/password-reset/PasswordRequirementsCard.tsx**
- L61: `marginBottom: 14`

**src/features/auth/components/registrationShared.styles.ts**
- L6: `marginTop: 28`
- L9: `paddingHorizontal: 20`
- L10: `marginBottom: 10`
- L15: `marginTop: 6`

**src/features/auth/screens/ChooseAccountScreen.tsx**
- L375: `paddingHorizontal: 18`
- L377: `paddingBottom: 14`
- L450: `marginTop: 10`
- L462: `marginTop: 11`
- L464: `paddingVertical: 6`
- L485: `marginTop: 17`
- L506: `marginBottom: 22`
- L518: `marginBottom: 11`
- L532: `paddingHorizontal: 15`
- L533: `paddingVertical: 14`
- L595: `marginStart: 10`
- L596: `paddingHorizontal: 10`
- L597: `paddingVertical: 5`
- L636: `marginTop: 10`
- L639: `paddingHorizontal: 9`
- L640: `paddingVertical: 5`
- L656: `paddingVertical: 15`
- L669: `marginBottom: 10`
- L701: `marginTop: 15`
- L702: `paddingHorizontal: 10`

**src/features/auth/screens/CreateNewPassword.styles.ts**
- L59: `marginBottom: 18`
- L93: `marginBottom: 26`
- L102: `marginTop: 6`
- L123: `paddingHorizontal: 13`
- L124: `paddingVertical: 11`
- L141: `paddingHorizontal: 18`
- L142: `paddingVertical: 18`
- L162: `marginBottom: 14`
- L205: `marginTop: 30`

**src/features/auth/screens/ForgotPassword.styles.ts**
- L44: `marginBottom: 22`
- L80: `marginTop: -3`
- L124: `marginBottom: 26`
- L133: `marginTop: 7`
- L142: `marginBottom: 6`
- L150: `marginBottom: 14`
- L151: `paddingHorizontal: 13`
- L152: `paddingVertical: 11`
- L169: `marginTop: 6`
- L194: `marginTop: 72`

**src/features/auth/screens/Login.styles.ts**
- L47: `marginBottom: 14`
- L75: `marginTop: 6`
- L85: `marginBottom: 10`
- L94: `marginBottom: 20`
- L108: `marginBottom: 14`
- L109: `paddingHorizontal: 13`
- L110: `paddingVertical: 11`
- L153: `marginVertical: 26`

**src/features/auth/screens/PasswordResetSuccess.styles.ts**
- L162: `marginBottom: 28`
- L179: `paddingHorizontal: 20`
- L180: `paddingVertical: 18`
- L219: `marginVertical: 14`
- L224: `marginTop: 46`
- L252: `marginTop: 18`
- L253: `paddingHorizontal: 14`

**src/features/auth/screens/RegisterEntity.styles.ts**
- L34: `paddingBottom: 18`
- L71: `paddingBottom: 38`
- L79: `marginBottom: 14`
- L80: `paddingHorizontal: 14`
- L81: `paddingVertical: 13`
- L98: `marginTop: 3`
- L108: `marginBottom: 22`
- L109: `paddingHorizontal: 17`
- L122: `marginBottom: 7`
- L146: `marginBottom: 18`
- L148: `marginTop: 25`
- L170: `paddingHorizontal: 14`
- L218: `paddingHorizontal: 14`
- L236: `marginTop: 5`
- L259: `paddingHorizontal: 14`
- L278: `marginBottom: 10`
- L332: `marginBottom: 7`
- L350: `marginBottom: 11`
- L357: `marginTop: 17`
- L374: `paddingHorizontal: 13`
- L390: `marginTop: 18`
- L391: `paddingHorizontal: 14`
- L392: `paddingVertical: 13`
- L419: `paddingHorizontal: 18`
- L420: `paddingVertical: 18`
- L429: `marginTop: 5`
- L443: `marginBottom: 13`
- L444: `paddingHorizontal: 13`
- L472: `paddingHorizontal: 11`
- L473: `paddingVertical: 7`
- L490: `marginTop: -2`
- L491: `marginBottom: 7`
- L511: `marginBottom: 15`
- L523: `marginBottom: 22`
- L540: `marginTop: 5`
- L541: `paddingHorizontal: 14`
- L542: `paddingTop: 15`
- L553: `marginBottom: 15`
- L561: `marginTop: 1`
- L583: `marginTop: 6`
- L591: `marginTop: 20`
- L608: `marginTop: 18`
- L609: `paddingHorizontal: 10`
- L675: `paddingHorizontal: 13`
- L676: `paddingVertical: 11`
- L699: `paddingHorizontal: 14`
- L700: `paddingVertical: 11`
- L719: `paddingHorizontal: 17`
- L748: `paddingHorizontal: 14`

**src/features/auth/screens/RegisterUser.styles.ts**
- L50: `paddingBottom: 18`
- L92: `paddingBottom: 36`
- L104: `marginBottom: 18`
- L107: `marginTop: 26`
- L133: `paddingHorizontal: 14`
- L222: `paddingHorizontal: 14`
- L240: `marginTop: 6`
- L254: `marginTop: -4`
- L274: `marginBottom: 18`
- L286: `marginBottom: 22`
- L316: `marginTop: 1`
- L345: `marginTop: 6`
- L346: `marginBottom: 28`
- L347: `paddingHorizontal: 15`
- L348: `paddingVertical: 15`
- L381: `paddingHorizontal: 14`
- L427: `marginTop: 18`
- L428: `paddingHorizontal: 10`

**src/features/auth/screens/RegistrationPendingScreen.tsx**
- L112: `marginBottom: 28`
- L136: `marginTop: 10`
- L150: `marginTop: 28`
- L152: `paddingVertical: 15`
- L177: `marginTop: 3`
- L190: `marginTop: 14`
- L192: `paddingVertical: 15`
- L211: `marginTop: 28`
- L219: `marginTop: 17`

**src/features/auth/screens/RegistrationSuccess.styles.ts**
- L18: `paddingBottom: 28`
- L46: `paddingHorizontal: 22`
- L47: `paddingTop: 22`
- L48: `paddingBottom: 21`
- L105: `marginTop: 13`
- L107: `paddingVertical: 5`
- L128: `marginTop: 7`
- L142: `marginTop: 14`
- L143: `paddingHorizontal: 15`
- L144: `paddingVertical: 14`
- L197: `marginTop: 3`
- L253: `paddingHorizontal: 15`
- L254: `paddingVertical: 14`
- L301: `marginTop: 18`
- L302: `paddingHorizontal: 14`
- L303: `paddingVertical: 13`
- L365: `marginTop: 22`
- L384: `marginTop: 10`

**src/features/auth/screens/VerifyRegistrationPhoneScreen.tsx**
- L663: `marginBottom: 18`
- L671: `paddingTop: 7`
- L672: `paddingHorizontal: 6`
- L673: `paddingBottom: 7`
- L681: `marginBottom: 6`
- L699: `marginTop: 6`
- L728: `marginTop: 7`
- L741: `paddingHorizontal: 15`
- L758: `marginHorizontal: 10`
- L784: `marginTop: 13`
- L785: `paddingHorizontal: 13`
- L786: `paddingVertical: 10`
- L804: `marginTop: 25`
- L881: `marginBottom: 14`
- L882: `paddingHorizontal: 13`
- L883: `paddingVertical: 11`
- L900: `marginTop: 10`
- L911: `marginTop: 25`
- L919: `marginTop: 7`

**src/features/auth/screens/VerifyResetCode.styles.ts**
- L71: `marginBottom: 18`
- L79: `paddingTop: 7`
- L80: `paddingHorizontal: 6`
- L81: `paddingBottom: 7`
- L99: `marginBottom: 6`
- L119: `marginTop: 6`
- L153: `marginTop: 7`
- L166: `paddingHorizontal: 15`
- L183: `marginHorizontal: 10`
- L210: `marginTop: 30`
- L285: `marginBottom: 14`
- L286: `paddingHorizontal: 13`
- L287: `paddingVertical: 11`
- L304: `marginTop: 10`
- L327: `marginTop: 25`
- L336: `marginTop: 7`
- L362: `marginTop: 18`

**src/features/feeding-points/components/UrgentRefillCard.tsx**
- L79: `paddingHorizontal: 18`
- L103: `paddingVertical: 3`

**src/features/launch/screens/Launch.styles.ts**
- L124: `marginTop: 5`
- L135: `marginTop: 7`
- L177: `marginTop: 10`

**src/features/map-places/components/OpeningHoursEditor.tsx**
- L16: `paddingVertical: 6`

**src/features/organization-dashboard/components/EmergencyCasesSection.tsx**
- L50: `paddingHorizontal: 1`

**src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx**
- L137: `marginLeft: -8`

**src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx**
- L59: `paddingBottom: 110`

**src/features/organizations/components/OrganizationCard.tsx**
- L50: `paddingVertical: 6`

**src/features/organizations/screens/OrganizationDetailsScreen.tsx**
- L60: `marginTop: -55`

**src/features/public/screens/About.styles.ts**
- L51: `paddingTop: 20`
- L52: `paddingBottom: 30`
- L83: `marginTop: 14`
- L94: `marginStart: 1`
- L99: `marginTop: 5`
- L109: `paddingVertical: 5`
- L122: `marginTop: 18`
- L123: `paddingHorizontal: 18`
- L124: `paddingVertical: 18`
- L148: `marginTop: 10`
- L158: `marginTop: 18`
- L159: `paddingHorizontal: 18`
- L160: `paddingTop: 18`
- L161: `paddingBottom: 20`
- L195: `marginTop: 7`
- L205: `marginTop: 18`
- L216: `paddingVertical: 15`
- L244: `marginTop: 18`
- L245: `paddingHorizontal: 18`
- L246: `paddingVertical: 18`
- L274: `marginTop: 15`
- L290: `marginTop: 18`
- L298: `paddingVertical: 15`
- L329: `marginTop: 18`
- L330: `paddingHorizontal: 18`
- L331: `paddingVertical: 18`
- L348: `marginTop: 6`
- L364: `paddingVertical: 6`
- L378: `marginTop: 18`
- L379: `paddingHorizontal: 18`
- L380: `paddingVertical: 19`
- L396: `marginTop: 6`
- L410: `marginTop: 13`
- L412: `paddingVertical: 10`
- L425: `marginTop: 30`
- L426: `paddingBottom: 10`
- L462: `marginTop: 10`
- L463: `paddingHorizontal: 10`
- L464: `paddingVertical: 6`
- L476: `paddingHorizontal: 18`
- L481: `paddingHorizontal: 18`
- L482: `paddingVertical: 18`
- L510: `marginTop: 14`
- L519: `marginTop: 14`
- L525: `paddingVertical: 10`
- L537: `marginTop: 18`

**src/features/public/screens/ContactUs.styles.ts**
- L44: `paddingTop: 18`
- L45: `paddingBottom: 34`
- L63: `marginTop: 20`
- L76: `marginTop: 7`
- L89: `paddingHorizontal: 18`
- L90: `paddingVertical: 20`
- L100: `marginBottom: 18`
- L109: `marginBottom: 7`
- L119: `paddingHorizontal: 15`
- L142: `paddingHorizontal: 15`
- L179: `paddingHorizontal: 15`
- L180: `paddingVertical: 14`
- L198: `marginTop: 5`
- L218: `marginTop: 7`
- L226: `marginTop: 3`
- L244: `paddingVertical: 5`
- L257: `marginTop: 20`
- L258: `paddingHorizontal: 18`
- L259: `paddingVertical: 18`
- L276: `marginTop: 6`
- L292: `paddingVertical: 6`
- L307: `marginTop: 20`
- L308: `paddingHorizontal: 18`
- L309: `paddingVertical: 18`
- L331: `paddingVertical: 10`
- L395: `marginTop: 20`
- L396: `paddingHorizontal: 18`
- L397: `paddingTop: 18`
- L424: `marginTop: 7`
- L466: `paddingHorizontal: 18`
- L481: `paddingVertical: 14`

**src/features/public/screens/HelpCenter.styles.ts**
- L44: `paddingTop: 18`
- L58: `marginTop: 15`
- L67: `marginTop: 5`
- L81: `marginTop: 20`
- L82: `paddingHorizontal: 17`
- L102: `marginTop: 34`
- L109: `paddingHorizontal: 10`
- L137: `marginTop: 28`
- L153: `paddingHorizontal: 17`
- L154: `paddingVertical: 15`
- L200: `paddingHorizontal: 13`
- L201: `paddingVertical: 10`
- L246: `paddingHorizontal: 20`
- L247: `paddingVertical: 22`
- L266: `marginTop: 7`
- L281: `marginTop: 18`
- L298: `marginTop: 9`
- L313: `marginTop: 28`
- L345: `paddingTop: 25`
- L356: `marginTop: 13`
- L380: `marginTop: 28`
- L381: `paddingHorizontal: 20`
- L382: `paddingVertical: 25`
- L387: `marginTop: 10`
- L395: `marginTop: 6`
- L404: `marginTop: 15`
- L405: `paddingHorizontal: 18`
- L406: `paddingVertical: 10`

**src/features/public/screens/Onboarding.styles.ts**
- L35: `paddingHorizontal: 14`

**src/features/public/screens/PrivacyPolicy.styles.ts**
- L48: `paddingTop: 15`
- L49: `paddingBottom: 28`
- L58: `marginBottom: 18`
- L88: `paddingHorizontal: 17`
- L89: `paddingVertical: 17`
- L100: `marginBottom: 13`
- L130: `marginTop: 22`
- L137: `paddingHorizontal: 15`
- L138: `paddingVertical: 14`
- L151: `paddingHorizontal: 15`
- L171: `marginTop: 20`
- L172: `paddingHorizontal: 17`
- L173: `paddingVertical: 18`
- L197: `marginTop: 13`
- L210: `paddingTop: 1`
- L223: `marginTop: 3`
- L258: `marginTop: 14`
- L259: `paddingHorizontal: 14`
- L260: `paddingVertical: 13`
- L279: `marginTop: 13`
- L300: `marginTop: 14`
- L309: `paddingHorizontal: 13`
- L310: `paddingVertical: 9`
- L327: `marginTop: 20`
- L328: `paddingHorizontal: 18`
- L329: `paddingVertical: 18`
- L346: `marginTop: 6`
- L362: `paddingVertical: 6`

**src/features/public/screens/TermsAndConditions.styles.ts**
- L48: `paddingTop: 15`
- L49: `paddingBottom: 28`
- L60: `marginBottom: 18`
- L96: `paddingHorizontal: 17`
- L97: `paddingVertical: 17`
- L139: `marginTop: 22`
- L147: `paddingHorizontal: 15`
- L148: `paddingVertical: 14`
- L159: `paddingHorizontal: 15`
- L187: `marginTop: 20`
- L188: `paddingHorizontal: 17`
- L189: `paddingVertical: 18`
- L220: `marginTop: 14`
- L222: `paddingVertical: 11`
- L237: `marginTop: 14`
- L269: `marginTop: 14`
- L270: `paddingHorizontal: 10`
- L271: `paddingVertical: 7`
- L288: `marginTop: 20`
- L289: `paddingHorizontal: 18`
- L290: `paddingVertical: 18`
- L307: `marginTop: 6`
- L323: `paddingVertical: 6`

**src/features/public/screens/Welcome.styles.ts**
- L205: `marginTop: 30`

**src/features/reports/components/CreateReportForm.tsx**
- L366: `marginTop: 6`
- L504: `marginStart: 6`
- L512: `marginStart: 6`
- L555: `marginTop: 10`
- L580: `marginStart: 6`
- L669: `paddingHorizontal: 10`
- L714: `paddingHorizontal: 18`
- L717: `marginTop: 6`
- L735: `paddingHorizontal: 14`
- L747: `paddingHorizontal: 14`
- L748: `paddingVertical: 10`
- L763: `paddingVertical: 18`
- L788: `marginStart: 10`
- L789: `marginEnd: 6`
- L807: `marginTop: 6`
- L813: `padding: 10`
- L820: `marginBottom: 10`
- L825: `marginTop: 6`
- L834: `marginBottom: 10`
- L850: `marginTop: 10`
- L858: `paddingHorizontal: 14`
- L859: `paddingVertical: 10`
- L866: `padding: 14`
- L867: `marginTop: 20`
- L870: `marginTop: 6`
- L877: `paddingVertical: 14`
- L878: `marginTop: 20`

**src/features/reports/components/ReportSuccessView.tsx**
- L273: `paddingVertical: 6`
- L326: `marginBottom: 36`
- L435: `paddingVertical: 14`

**src/features/search/screens/Search.styles.ts**
- L9: `paddingBottom: 120`

---

## 5. استخدام `left` / `right` / `marginLeft` / `marginRight` / `textAlign: 'left'` بدل `start` / `end`

تم استثناء `src/theme/index.ts` و `src/i18n/rtl.ts` من هذا القسم لأنهما ملفا تعريف نظام الاتجاه نفسه (مصدر `ARABIC_LAYOUT.start/end` و`RTL_TEXT`/`LTR_TEXT`)، وليسا استهلاكًا له. `src/i18n/rtl.ts:12` يحتوي `textAlign: "left"` كجزء من تعريف `LTR_TEXT` الأساسي.

### 5.أ — خاصيتا `left:` / `right:` (تموضع/إزاحة) — 89 حالة في 41 ملفًا

**src/components/ui/FeedbackProvider.tsx**
- L182: `left: SPACING.md,`
- L183: `right: SPACING.md,`

**src/components/ui/FloatingGlassTabBar.tsx**
- L125: `left: NAVIGATION.horizontalInset,`
- L126: `right: NAVIGATION.horizontalInset,`
- L135: `left: 2,`
- L136: `right: 2,`
- L179: `left: SPACING.lg,`
- L180: `right: SPACING.lg,`

**src/components/ui/QuickReportFab.tsx**
- L42: `left: LAYOUT.screenPadding,`

**src/features/adoption/screens/CreateAdoptionListingScreen.tsx**
- L429: `right: SPACING.sm` (ضمن `primaryBadge`)
- L430: `left: SPACING.sm` (ضمن `imageActions`)

**src/features/auth/screens/ChooseAccountScreen.tsx**
- L475: `left: 18,`
- L480: `right: 22,`

**src/features/auth/screens/ForgotPasswordScreen.tsx**
- L82: `right: -width * 0.3,`
- L98: `left: -width * 0.4,`
- L193: `left: illustrationSize * 0.02,`
- L205: `right: illustrationSize * 0.01,`
- L222: `right: illustrationSize * 0.02,`
- L234: `left: illustrationSize * 0.02,`

**src/features/auth/screens/LoginScreen.tsx**
- L25: `right: -width * 0.26` (ضمن `styles.topGlow` مضمّن في JSX)
- L26: `left: -width * 0.35` (ضمن `styles.bottomGlow` مضمّن في JSX)

**src/features/auth/screens/PasswordResetSuccess.styles.ts**
- L90: `left: 0,`
- L98: `right: 0,`
- L152: `left: "10%",`
- L156: `right: "7%",`

**src/features/auth/screens/PasswordResetSuccessScreen.tsx**
- L68: `right: -width * 0.3,`
- L84: `left: -width * 0.4,`
- L184: `right: illustrationSize * 0.06,`

**src/features/auth/screens/RegisterEntity.styles.ts**
- L307: `left: 12,`
- L669: `left: 14,`
- L670: `right: 14,`
- L693: `right: 14,`

**src/features/auth/screens/RegistrationSuccess.styles.ts**
- L57: `right: -35,`
- L66: `left: -45,`
- L93: `right: 2,`

**src/features/auth/screens/VerifyRegistrationPhoneScreen.tsx**
- L705: `right: "15%",`

**src/features/auth/screens/VerifyResetCode.styles.ts**
- L125: `right: "15%",`
- L138: `left: "12%",`

**src/features/auth/screens/VerifyResetCodeScreen.tsx**
- L64: `right: -width * 0.3,`
- L79: `left: -width * 0.4,`

**src/features/donations/screens/CreateDonationCampaignScreen.tsx**
- L555: `right: SPACING.xs` (ضمن `coverBadge`)
- L556: `left: SPACING.xs` (ضمن `imageActions`)

**src/features/donations/screens/DonationCampaignDetailsScreen.tsx**
- L298: `right: SPACING.md` (ضمن `urgentPill`)
- L299: `right: SPACING.md` (ضمن `heroDonationPill`)

**src/features/donations/screens/DonationsScreen.tsx**
- L437: `right: SPACING.md` (ضمن `urgentBadge`)

**src/features/feeding-points/components/FeedingPointsMap.tsx**
- L23: `left: `${left}%`` (قيمة محسوبة)
- L86: `left: -20,`
- L87: `right: -20,`
- L97: `left: "68%",`
- L125: `left: SPACING.sm,`

**src/features/feeding-points/components/MapPinPreviewCard.tsx**
- L83: `left: SPACING.sm,`
- L84: `right: SPACING.sm,`

**src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx**
- L290: `left: SPACING.sm,`
- L291: `right: SPACING.sm,`

**src/features/home/components/NearbyReportCard.tsx**
- L123: `right: SPACING.sm,`

**src/features/launch/components/LaunchSections.tsx**
- L16: `left: -width * 0.68` (ضمن `styles.leftGlow` مضمّن في JSX)
- L17: `right: -width * 0.5` (ضمن `styles.topGlow` مضمّن في JSX)

**src/features/launch/screens/Launch.styles.ts**
- L48: `right: "20%",`
- L55: `left: "18%",`
- L62: `right: "13%",`
- L172: `right: 0,`

**src/features/map/components/ServicePlacesMap.tsx**
- L30: `left: `${...}%`` (قيمة محسوبة)
- L58: `left: -20, right: -20` (ضمن `roadA`)
- L59: `left: "62%"` (ضمن `roadB`)
- L63: `left: SPACING.sm` (ضمن `webBadge`)

**src/features/organization-dashboard/components/EmergencyCaseCard.tsx**
- L61: `right: SPACING.sm,`

**src/features/organization-dashboard/components/OrganizationDashboardHeader.tsx**
- L69: `right: 10,`
- L103: `left: -2,`

**src/features/organization-dashboard/components/OrganizationMapPreview.tsx**
- L64: `right: SPACING.md, left: SPACING.md` (ضمن `buttonWrap`)

**src/features/organization-dashboard/components/OrganizationSummaryCard.tsx**
- L51: `right: 4` (ضمن `mark`)

**src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx**
- L96: `left: SPACING.md` (ضمن `counter`)
- L98: `left: SPACING.md, right: SPACING.md` (ضمن `mapButton`)

**src/features/organizations/screens/OrganizationsScreen.tsx**
- L53: `right: SPACING.sm` (ضمن `verifiedPill`)

**src/features/profile/components/ProfileHeader.tsx**
- L83: `left: -1` (ضمن `verified`)

**src/features/profile/screens/EditProfileScreen.tsx**
- L176: `right: -2,`

**src/features/public/components/welcome/WelcomeSections.tsx**
- L17: `left: -width * 0.03` (ضمن `styles.topGlow` مضمّن في JSX)
- L18: `right: -width * 0.58` (ضمن `styles.sideGlow` مضمّن في JSX)

**src/features/public/screens/Onboarding.styles.ts**
- L69: `left: "-15%",`

**src/features/public/screens/OnboardingScreen.tsx**
- L183: `right: -width * 0.28` (ضمن `styles.topGlow` مضمّن في JSX)
- L184: `left: -width * 0.44` (ضمن `styles.bottomGlow` مضمّن في JSX)

**src/features/reports/components/ReportDetailsScreen.tsx**
- L361: `left: SPACING.md,`

**src/features/reports/components/ReportSuccessView.tsx**
- L46: `left: 5, right: 5` (ضمن `hitSlop` مضمّن في JSX)
- L315: `right: 13,`

**src/features/search/components/SearchMapPreview.tsx**
- L91: `left: -30,`
- L101: `left: -20,`
- L111: `left: "48%",`
- L124: `right: 50,`
- L128: `left: 45,`

**src/features/search/components/SearchResultCard.tsx**
- L180: `right: SPACING.md,`

### 5.ب — `marginLeft` / `marginRight` — حالة واحدة

**src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx**
- L137: `marginLeft: -8` (ضمن `face`)

### 5.ج — `textAlign: 'left'` — 7 حالات (بخلاف تعريف `LTR_TEXT` في `src/i18n/rtl.ts:12`)

**src/features/public/screens/ContactUs.styles.ts**
- L132: `textAlign: "left",`
- L170: `textAlign: "left",`
- L299: `textAlign: "left",`
- L361: `textAlign: "left",`

**src/features/public/screens/PrivacyPolicy.styles.ts**
- L372: `textAlign: "left",`

**src/features/public/screens/TermsAndConditions.styles.ts**
- L333: `textAlign: "left",`

**src/features/reports/components/ReportDetailsScreen.tsx**
- L520: `textAlign: "left",`

---

## 6. أيقونات سهم/chevron مكتوبة يدويًا بدل `directionalIcon()`

ملاحظتان بنيويتان قبل القائمة:
- دالة `directionalIcon(rtlIcon, ltrIcon)` معرّفة في `src/i18n/rtl.ts:60-65`. البحث في كامل `src/` عن الاستدعاء `directionalIcon(` لا يُظهر أي استدعاء خارج ملف تعريفها — **الدالة غير مستخدمة إطلاقًا في المشروع.**
- مكوّن `DirectionalIcon` (`src/components/ui/DirectionalIcon.tsx`) يبني خريطته الداخلية من نفس الأسماء (`arrow-forward-outline`, `arrow-back-outline`, `chevron-forward-outline`, `chevron-back-outline` — الأسطر 14-17)، ومُستخدم في مكانين فقط: داخليًا في `src/components/ui/ScreenHeader.tsx:83`، وفي `src/features/profile/components/ProfileMenuSection.tsx:21`.

**القائمة الكاملة لأسماء أيقونات `chevron-*` / `arrow-*` الاتجاهية المكتوبة حرفيًا خارج `DirectionalIcon.tsx` — 23 حالة في 15 ملفًا:**

**src/features/adoption/screens/AdoptionListingApplicationsScreen.tsx**
- L86: `<Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />`

**src/features/auth/components/registration-success/RegistrationSuccessSections.tsx**
- L51: `<Ionicons name="arrow-back-outline" size={21} color={PALETTE.neutral0} />`

**src/features/donations/screens/DonationsScreen.tsx**
- L182: `<Ionicons name="chevron-back" size={18} color={COLORS.primaryStrong} />`

**src/features/donations/screens/DonationTransferDetailsScreen.tsx**
- L204: `<Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />`

**src/features/donations/screens/MyDonationCampaignsScreen.tsx**
- L113: `<Ionicons name="chevron-back" size={17} color={COLORS.primaryStrong} />`

**src/features/donations/screens/MyDonationsScreen.tsx**
- L83: `<Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />`

**src/features/feeding-points/components/MapPinPreviewCard.tsx**
- L36: `icon="chevron-back"`
- L68: `icon="chevron-forward"`

**src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx**
- L135: `icon="chevron-forward"`

**src/features/home/components/SuggestedActionCard.tsx**
- L31: `<Ionicons name="chevron-back" size={ICON_SIZES.sm} color={COLORS.textSecondary} />`

**src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx**
- L45: `<Ionicons name="chevron-back" size={20} color={COLORS.textMuted} />`

**src/features/public/components/onboarding/OnboardingFooter.tsx**
- L34: `icon={isLastSlide ? "paw-outline" : "arrow-forward"}`

**src/features/public/components/welcome/WelcomeSections.tsx**
- L71: `icon="arrow-forward-outline"`

**src/features/public/screens/HelpCenterScreen.tsx**
- L377: `name="chevron-back-outline"`
- L399: `name="chevron-back-outline"`
- L421: `name="chevron-back-outline"`
- L445: `name="chevron-back-outline"`

**src/features/public/screens/PrivacyPolicyScreen.tsx**
- L195: `name="chevron-back-outline"`

**src/features/public/screens/TermsAndConditionsScreen.tsx**
- L151: `name="chevron-back-outline"`

**src/features/reports/components/CreateReportForm.tsx**
- L196: `<Ionicons name="arrow-forward" size={22} color={COLORS.text} />`

**src/features/reports/components/ReportSuccessView.tsx**
- L155: `<Ionicons name="chevron-back" size={18} color={COLORS.white} />`

**src/features/vets/screens/VeterinaryClinicDetailsScreen.tsx**
- L146: `<Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />`

**src/features/vets/screens/VeterinaryClinicsScreen.tsx**
- L244: `icon="chevron-back-outline"`

(بحث تكميلي عن `caret-back/forward`, `chevron-left/right`, `arrow-left/right` لم يُظهر أي نتائج إضافية.)
