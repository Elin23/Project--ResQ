# WP09B — Location Lookup & Guest Copy Verification

This corrective package closes gaps found during manual review of WP09.

## Fixed
- Organization registration no longer accepts governorate/region as free text.
- Organization registration uses the shared LocationLookupRepository and stores governorateId/regionId plus display names.
- Feeding-point creation now requires governorate and region selection from the shared lookup repository; address is limited to street/landmark details.
- Feeding-point submissions include governorateId/governorateName/regionId/regionName.
- Personal user registration governorate now also comes from the shared lookup repository and carries governorateId.
- Mock lookups were expanded so every mock governorate has at least one selectable region. In real API mode, dashboard-managed lookups replace these values.
- Guest CTA copy is verified as exactly "المتابعة كزائر" on both Welcome and Login.
- Guest access policy explicitly excludes report creation.
- Updated stale guest regression check to match the current requirement.

## Verification
- check-location-lookup-alignment-v24: PASS
- check-guest-experience: PASS
- check-source-health-v19: PASS
- check-project-integrity: PASS
- check-mobile-dashboard-contract-v23: PASS
- check-feeding-point-submission-flow: PASS
- check-auth-rtl-copy-v2: PASS

No screens or existing features were removed.
