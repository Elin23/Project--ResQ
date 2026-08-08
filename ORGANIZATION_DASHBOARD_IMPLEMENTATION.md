# Organization dashboard implementation

## Goal
Convert the provided volunteer dashboard reference into an organization/association dashboard after removing the volunteer-account workflow.

## Added
- `app/organization-dashboard.tsx`
- `src/features/organization-dashboard/` with separate components, constants, hooks, screen and types.
- Central route `ROUTES.organizationDashboard`.
- Theme tokens dedicated to organization dashboard cards and achievements.

## Behavior
- Organization header and verification state.
- Rescue-operation summary and active/completed case metrics.
- Community rating card.
- Incoming-report and rescue-task quick actions.
- Interactive nearby emergency cases; a case can be accepted and opened.
- Active rescue task with progress updates and details navigation.
- Map preview linked to the existing map route.
- Organization achievements.
- Organization-specific bottom navigation linked to reports, map, notifications and the public organization profile.
- Location-update interaction.

## Registration integration
The active organization registration-success flow now opens the organization dashboard instead of the regular user tabs. Organization capabilities no longer mention volunteer management; they describe rescue-case management instead.

## Reuse
The implementation reuses existing `Screen`, `Card`, `Button`, `AppText`, central navigation helpers, theme tokens, existing report details, map, notification and organization-profile routes, and existing local image assets.
