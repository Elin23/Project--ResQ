# ResQ Mobile ↔ Dashboard ↔ Backend Compatibility Contract

This package aligns the mobile application with the administration dashboard without removing existing screens or mock flows.

## Approved product decisions

1. Guests can browse public content but **cannot create animal reports**.
2. Reports are created by authenticated users or organizations and are not subject to an admin publish-approval gate.
3. Report assignment is separate from report status. Backend report lifecycle: `OPEN → EN_ROUTE → RECEIVED → CLOSED`.
4. Rescue execution has its own mission lifecycle: `ASSIGNED → ACCEPTED → ON_THE_WAY → ARRIVED → RESCUED → COMPLETED`.
5. Adoption publication has two independent dimensions:
   - moderation: `DRAFT / PENDING_REVIEW / PUBLISHED / REJECTED`
   - lifecycle: `AVAILABLE / RESERVED / ADOPTED / CLOSED`
6. Feeding points are moderated using `PENDING / ACTIVE / INACTIVE / REJECTED`; refill reports and issue reports are separate resources.
7. Location catalogs are dashboard-managed. API payloads use governorate/region IDs; mobile may display names, and precise report coordinates can be resolved by the backend when IDs are unavailable.
8. Donation campaigns are organization-only and require admin approval before publication.
9. Advertisements are created only from the dashboard. Mobile receives a read-only placement-specific DTO and never receives contract/payment fields.
10. Articles, success stories and FAQ content are administered from the dashboard. Mobile only consumes published/active content.
11. API enums use `UPPER_SNAKE_CASE`. Existing mobile UI/domain enums remain stable and are isolated behind DTO mappers.
12. Money is transported by the backend as integer `amountMinor` values with an explicit currency.
13. Dynamic backend media uses a shared `MediaDto`; local URIs remain valid only before upload.

## Package structure

- `src/contracts/backend/*`: canonical API DTOs shared conceptually with the dashboard/backend.
- `src/services/api/mappers/*`: translation between backend DTOs and existing mobile domain/read models.
- `src/domain/lookups/*`: location lookup abstraction.
- `src/data/seeds/locationLookups.seed.ts`: mock-mode lookup catalog only.
- `src/services/api/endpoints.ts`: centralized ASP.NET Core endpoint catalog.

## Guest report rule

The `create-report` capability is not granted to `guest`, `/reports/create` is route-gated, and the report form no longer contains guest contact submission behavior.

## Backend implementation note

The app remains in mock mode. Existing in-memory repositories are intentionally preserved. When ASP.NET Core endpoints are ready, implement API repositories against the DTOs in `src/contracts/backend` and switch repository composition without changing screens.
