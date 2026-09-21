# Data Model: Home Page

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-15

This feature introduces no persistent backend storage. All data is either (a) static frontend content, or (b) a documented future contract that is not yet implemented. Entities captured for consistency across components, contracts, and future features.

## Frontend Static Content (in-memory, from `src/data/staticData.js`)

### RoomCategory

- **Purpose**: Drives the Room Categories section and the `?room=` query parameter.
- **Fields**
  - `id` (string, unique, kebab-case) — e.g., `living-room`, `bedroom`, `kitchen`, `office`
  - `label` (string) — display name, e.g., "Living Room" (FR-004)
  - `description` (string) — one-line summary shown on the card
  - `gradient` (string) — deterministic CSS gradient token for the card visual
- **Cardinality**: fixed set of 4; defined in `data/staticData.js`.
- **Validation**: every `id` must be unique and URL-safe (used in `?room=`); every section link targets `/design?room=<id>` (FR-020).

### InteriorStyle

- **Purpose**: Drives the Interior Styles section and the `?style=` query parameter.
- **Fields**
  - `id` (string, unique, kebab-case) — e.g., `modern`, `classic`, `luxury`, `minimal`, `rustic`
  - `label` (string) — display name (FR-006)
  - `description` (string) — one-line summary
  - `gradient` (string) — CSS gradient token for the style card
- **Cardinality**: fixed set of 5; defined in `data/staticData.js`.
- **Validation**: every `id` URL-safe and unique; every style card links to `/design?style=<id>`.

### HowItWorksStep (FR-005)

- **Fields**: `step` (integer, 1–4), `title` (string from the fixed set: "Upload Room", "Choose Style", "Generate with AI", "Save & Download"), `description` (string).
- **Cardinality**: fixed set of 4; presentation-only.

### AiFeature (FR-008)

- **Fields**: `title` and `description`.
- **Cardinality**: fixed set of 6 (AI Room Analysis; AI Interior Design Generation; Smart Furniture Suggestions; Multiple Design Variations; Save Designs; Download Designs).

### FurnitureItem (FR-009)

- **Purpose**: Popular furniture shown in the Furniture Preview.
- **Fields**
  - `id` (string, unique, kebab-case)
  - `name` (string) — e.g., "Velvet Sofa"
  - `category` (string) — e.g., "Sofa", "Bed", "Table", "Chair"
  - `price` (number) — display price in USD
  - `description` (string) — short detail text
  - `gradient` (string) — CSS gradient token used as the item visual
- **Cardinality**: curated subset (6–8 items) across the main categories; static.
- **Validation**: every item links to `Furniture.jsx` detail context (category filter) or the `/furniture` page via "View All Furniture".

## Documented Future API Contracts (not implemented in this feature)

### SavedDesign (Recent Designs)

- **Purpose**: Represents a design the authenticated user generated/saved, surfaced in "My Recent Designs" (FR-010).
- **Status**: Contract only — see `contracts/recent-designs-api.md`. No storage or endpoint exists yet.
- **Fields (contract)**: `id`, `roomType` (RoomCategory id), `style` (InteriorStyle id), `thumbnailUrl`, `createdAt`, `title`.
- **Cardinality**: zero to N per user; section shows most recent N (contract limit, default 4).
- **Access rule (FR-011)**: read requires the authenticated user's JWT; the frontend never requests it unauthenticated.

### FurnitureCatalogProduct (future, out of scope)

- **Purpose**: Full product list behind the Furniture page; static `FurnitureItem` is the v1 substitute.
- **Status**: Contract only — see `contracts/furniture-catalog-api.md`.

## Relationships

- `RoomCategory` and `InteriorStyle` both feed the `?room=` / `?style=` query params consumed by the Design My Room workflow (FR-020). They are independent selects (a design pairs one room + one style).
- A `SavedDesign` references one `RoomCategory` and one `InteriorStyle` (for future display filtering), and belongs to one authenticated `User` (existing entity).

## Lifecycle / State Transitions

- `RecentDesigns` UI state machine: `unauth → prompt` | `authenticated` → (`api disabled → empty` | `api enabled → loading → data | empty | error → retry`). No persistence at this layer.