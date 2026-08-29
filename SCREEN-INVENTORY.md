# SCREEN-INVENTORY — جرد شاشات تطبيق ResQ

إجمالي الشاشات: **72** شاشة موزّعة على **17** ميزة، جميعها تحت `src/features/<feature>/screens/`.
عمود «Screen» يبيّن ما إذا كانت الشاشة تستخدم غلاف `<Screen>` المشترك من `src/components/ui`.
الحالة: 51 شاشة تستخدم الغلاف، 21 لا تستخدمه (موثّق كدين مؤجّل في `CLAUDE.md` القسم 8).

> ملاحظة: أسماء الشاشات بالعربية أدناه مشتقّة من أسماء الملفات وتحتاج مراجعة من فريق التصميم لمطابقتها للعناوين الفعلية المعروضة داخل التطبيق.

---

## adoption — التبنّي (10 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| AdoptionScreen.tsx | ✅ | قائمة إعلانات التبنّي |
| AdoptionDetailsScreen.tsx | ✅ | تفاصيل إعلان تبنّي |
| AdoptionApplicationScreen.tsx | ✅ | تقديم طلب تبنّي |
| AdoptionApplicationStatusScreen.tsx | ✅ | حالة طلب التبنّي |
| MyAdoptionApplicationsScreen.tsx | ✅ | طلباتي للتبنّي |
| CreateAdoptionListingScreen.tsx | ✅ | إنشاء إعلان تبنّي |
| MyAdoptionListingsScreen.tsx | ✅ | إعلاناتي |
| MyAdoptionListingDetailsScreen.tsx | ✅ | تفاصيل إعلاني |
| AdoptionListingApplicationsScreen.tsx | ✅ | الطلبات الواردة على إعلاني |
| OwnerAdoptionApplicationDetailsScreen.tsx | ✅ | تفاصيل طلب وارد (للمالك) |

## auth — الحسابات (11 شاشة)

| الملف | Screen | الوصف |
|---|---|---|
| ChooseAccountScreen.tsx | ❌ | اختيار نوع الحساب |
| LoginScreen.tsx | ❌ | تسجيل الدخول |
| RegisterUserScreen.tsx | ❌ | تسجيل مستخدم |
| RegisterEntityScreen.tsx | ❌ | تسجيل جهة (عيادة/جمعية) |
| VerifyRegistrationPhoneScreen.tsx | ❌ | تحقّق رقم الهاتف |
| RegistrationPendingScreen.tsx | ❌ | التسجيل قيد المراجعة |
| RegistrationSuccessScreen.tsx | ❌ | نجاح التسجيل |
| ForgotPasswordScreen.tsx | ❌ | نسيت كلمة المرور |
| VerifyResetCodeScreen.tsx | ❌ | تحقّق رمز الاستعادة |
| CreateNewPasswordScreen.tsx | ❌ | كلمة مرور جديدة |
| PasswordResetSuccessScreen.tsx | ❌ | نجاح استعادة كلمة المرور |

## donations — التبرّعات (10 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| DonationsScreen.tsx | ✅ | استكشاف حملات التبرّع |
| DonationCampaignDetailsScreen.tsx | ✅ | تفاصيل حملة |
| DonationCheckoutEntryScreen.tsx | ✅ | بدء التبرّع |
| DonationTransferDetailsScreen.tsx | ✅ | بيانات التحويل |
| DonationTransferSubmittedScreen.tsx | ✅ | تأكيد إرسال التحويل |
| MyDonationsScreen.tsx | ✅ | تبرّعاتي |
| CreateDonationCampaignScreen.tsx | ✅ | إنشاء حملة |
| MyDonationCampaignsScreen.tsx | ✅ | حملاتي |
| DonationCampaignOwnerScreen.tsx | ✅ | إدارة الحملة |
| OwnedDonationCampaignStatusScreen.tsx | ✅ | حالة حملتي |

## reports — البلاغات (2 شاشة)

| الملف | Screen | الوصف |
|---|---|---|
| ReportsScreen.tsx | ✅ | قائمة البلاغات |
| CreateReportScreen.tsx | ❌ | إنشاء بلاغ إنقاذ |

## feeding-points — نقاط الإطعام (5 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| FeedingPointsScreen.tsx | ✅ | قائمة/خريطة نقاط الإطعام |
| FeedingPointDetailsScreen.tsx | ✅ | تفاصيل نقطة إطعام |
| CreateFeedingPointScreen.tsx | ✅ | إضافة نقطة إطعام |
| FeedingPointSubmissionsScreen.tsx | ✅ | التحديثات المُرسلة |
| FeedingPointSubmissionDetailsScreen.tsx | ✅ | تفاصيل تحديث مُرسل |

## organization-dashboard — لوحة الجهة (7 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| OrganizationDashboardScreen.tsx | ✅ | لوحة التحكّم |
| OrganizationReportsScreen.tsx | ✅ | البلاغات الواردة |
| OrganizationReportDetailsScreen.tsx | ✅ | تفاصيل بلاغ وارد |
| OrganizationTasksScreen.tsx | ✅ | المهام |
| OrganizationTaskDetailsScreen.tsx | ✅ | تفاصيل مهمة |
| OrganizationTaskCompletedScreen.tsx | ✅ | إنجاز مهمة |
| OrganizationProfileScreen.tsx | ✅ | ملف الجهة |

## organizations — الجمعيات (2 شاشة)

| الملف | Screen | الوصف |
|---|---|---|
| OrganizationsScreen.tsx | ✅ | قائمة الجمعيات |
| OrganizationDetailsScreen.tsx | ✅ | تفاصيل جمعية |

## vets — العيادات البيطرية (2 شاشة)

| الملف | Screen | الوصف |
|---|---|---|
| VeterinaryClinicsScreen.tsx | ✅ | قائمة العيادات |
| VeterinaryClinicDetailsScreen.tsx | ✅ | تفاصيل عيادة |

## map — الخريطة (2 شاشة)

| الملف | Screen | الوصف |
|---|---|---|
| MapScreen.tsx | ✅ | الخريطة الرئيسية |
| ServicePlaceDetailsScreen.tsx | ✅ | تفاصيل موقع خدمة |

## map-places — إدارة مواقع الخريطة (6 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| MapPlaceApplicationFormScreen.tsx | ✅ | طلب إضافة موقع |
| MapPlaceApplicationDetailsScreen.tsx | ✅ | تفاصيل طلب موقع |
| EditMapPlaceApplicationScreen.tsx | ✅ | تعديل طلب موقع |
| MyMapPlacesScreen.tsx | ✅ | مواقعي |
| EditOwnedMapPlaceScreen.tsx | ✅ | تعديل موقعي |
| MapPlaceChangeRequestScreen.tsx | ✅ | طلب تعديل موقع |

## home / explore / notifications / profile / search (7 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| home/HomeScreen.tsx | ✅ | الشاشة الرئيسية |
| explore/ExploreScreen.tsx | ✅ | الاستكشاف |
| notifications/NotificationsScreen.tsx | ✅ | الإشعارات |
| profile/ProfileScreen.tsx | ✅ | الملف الشخصي |
| profile/EditProfileScreen.tsx | ✅ | تعديل الملف الشخصي |
| search/SearchScreen.tsx | ❌ | البحث |
| search/SearchResultDetailsScreen.tsx | ✅ | تفاصيل نتيجة بحث |

## launch / public — الإطلاق والمحتوى العام (8 شاشات)

| الملف | Screen | الوصف |
|---|---|---|
| launch/LaunchScreen.tsx | ❌ | شاشة الإطلاق |
| public/WelcomeScreen.tsx | ❌ | الترحيب |
| public/OnboardingScreen.tsx | ❌ | التعريف بالتطبيق |
| public/AboutScreen.tsx | ❌ | عن التطبيق |
| public/ContactUsScreen.tsx | ❌ | تواصل معنا |
| public/HelpCenterScreen.tsx | ❌ | مركز المساعدة |
| public/PrivacyPolicyScreen.tsx | ❌ | سياسة الخصوصية |
| public/TermsAndConditionsScreen.tsx | ❌ | الشروط والأحكام |

---

## الشاشات التي لا تستخدم غلاف `<Screen>` (21)

`auth` بالكامل (11)، `public` بالكامل (7)، إضافة إلى `LaunchScreen`, `CreateReportScreen`, `SearchScreen`.
هذه الشاشات تحمل قيم الحشوة والمسافات الخاصة بها يدوياً. توحيدها مؤجّل — انظر `CLAUDE.md` القسم 8.

## مراجع

- `AUDIT-INVENTORY.md` — جرد المكوّنات والتوكنز والقياسات التفصيلية.
- `CLAUDE.md` — قواعد العمل على الكود.
- `src/product/screenCatalog.ts` — كتالوج الشاشات والمسارات.
- `src/navigation/routes.ts` — تعريف المسارات.