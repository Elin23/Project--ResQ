# Shared UI components

Keep these components presentation-focused and feature-agnostic.

- `Button`, `IconButton`: actions and icon-only actions.
- `Input`: shared form field behavior.
- `Card` and `Chip`: reusable content surfaces.
- `QuickActionGrid`: grid of icon-circle + label action cells (e.g. "الاتجاهات" / "مشاركة").
- `RatingStars`: read-only 5-star rating display, with optional numeric value and review count.
- `EmptyState`, `ErrorState`, `LoadingState`: consistent asynchronous states.
- `Screen`, `TopBar`, `SectionHeader`: screen structure.

Feature-specific business behavior belongs under `src/features/<feature>`.
