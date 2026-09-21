# Contract: Furniture Catalog API (future)

**Feature**: [spec.md](../../../specs/004-home-page/spec.md) | **Date**: 2026-09-15

**Status**: NOT IMPLEMENTED — contract for the future furniture catalog. The first release of the Home Page uses the curated static `FurnitureItem` list in `src/data/staticData.js` (per clarification Q3) and does not depend on this endpoint.

## Endpoint

`GET /api/furniture?category=<id>&limit=<n>` — Public

## Request

| Part | Value |
|------|-------|
| Method | `GET` |
| Path | `/api/furniture` |
| Query | `category` (optional; e.g., `sofa`, `bed`, `table`, `chair`), `limit` (optional, default 12) |
| Auth | None (public catalog) |

## Responses

### 200 OK

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "category": "sofa",
      "price": 849.0,
      "description": "string",
      "imageUrl": "string"
    }
  ]
}
```

### 4xx / 5xx

Client shows a graceful empty/error state without breaking the page (existing `FurniturePreview` behavior).

## Migration Path

- v1: `FurniturePreview` renders `staticData.js` entries.
- v2+: swap the data source to this endpoint while keeping the `FurnitureItem` shape identical so component markup and shared styles do not change.