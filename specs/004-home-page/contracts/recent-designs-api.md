# Contract: Recent Designs API (future)

**Feature**: [spec.md](../../../specs/004-home-page/spec.md) | **Date**: 2026-09-15

**Status**: NOT IMPLEMENTED — contract for the future saved-designs feature. This feature's Home Page renders against an availability flag (see below) and does not depend on this endpoint existing.

## Endpoint

`GET /api/designs?limit=<n>` — Authenticated

## Request

| Part | Value |
|------|-------|
| Method | `GET` |
| Path | `/api/designs` |
| Query | `limit` (number, optional, default 4, max 20) |
| Auth | `Authorization: Bearer <JWT>` (required) |

## Responses

### 200 OK

```json
{
  "designs": [
    {
      "id": "string",
      "title": "string",
      "roomType": "living-room",
      "style": "modern",
      "thumbnailUrl": "string",
      "createdAt": "ISO-8601"
    }
  ]
}
```

- `roomType` ∈ RoomCategory ids (`living-room`, `bedroom`, `kitchen`, `office`).
- `style` ∈ InteriorStyle ids (`modern`, `classic`, `luxury`, `minimal`, `rustic`).
- Array is ordered newest-first; length ≤ `limit`.

### 401 Unauthorized

Missing/invalid/expired JWT. Client treats this as logged-out → show login prompt, never an error state.

### 404 Not Found / 50x

Endpoint not yet deployed or server error. Client may surface a gentle error state with retry only when the API is enabled and the caller is authenticated.

## Frontend Contract (`src/services/designs.js`)

```js
const DESIGNS_API_AVAILABLE = false; // flip to true when the backend endpoint lands

export function isDesignsApiAvailable() { return DESIGNS_API_AVAILABLE; }

// Requires token attached via the shared axios instance; never call when logged out.
export async function fetchRecentDesigns({ limit = 4 } = {}) { ... }
```

## RecentDesigns State Machine

1. No token → **login prompt** (zero network calls).
2. Token + `isDesignsApiAvailable() === false` → **empty state** with "Start Designing" CTA (zero network calls).
3. Token + available → **loading** → **data grid** | **empty** | **error + retry**.