# Data Model: Room Image Input

**Feature**: specs/005-room-image-input | **Date**: 2026-09-15

Phase 1 output. Describes the frontend data shapes this feature owns. No backend entities are introduced (the future upload API contract is documented in `contracts/room-image-upload-api.md`).

## Entities

### RoomImage

The single active photo the user provides for the Design My Room workflow. There is always **at most one** per session.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Generated id for the session entry (crypto/random). |
| `source` | enum (`upload`, `camera`) | yes | How the image was obtained; surfaces the correct Change label ("Change Image" vs "Retake"). |
| `originalFilename` | string | optional | Upload path only; may be empty for camera captures. |
| `fileType` | enum (`image/jpeg`, `image/png`, `image/webp`) | yes | Normalized MIME of the accepted image. |
| `sizeBytes` | number | yes | Original file byte size (upload) or encoded capture size (camera). |
| `dataUrl` | string (base64) | yes | The image payload. Single source of truth for preview and cross-refresh persistence. |
| `width`, `height` | number | yes | Intrinsic dimensions after a successful decode; used for the responsive preview frame. |
| `createdAt` | ISO timestamp | yes | For potential future telemetry; not user-visible. |

Validation rules (client-side, per FR-004/FR-005/FR-006):

- `fileType` ∈ { `image/jpeg`, `image/png`, `image/webp` } **and** extension matches.
- `sizeBytes` ≤ 10 MB (`10 * 1024 * 1024`).
- Decodability: the image must load with natural dimensions > 0 (rejects corrupt files and mislabeled HEIC/GIF).
- Rejection resets to `null` (no partial image state).

Lifecycle / state transitions:

```
null ──(valid select/capture)──► previewing ──(decode ok)──► ready
                                  │                            │
                                  └──validation fail──► null   └──(Continue)──► consumed by /design/next
                                                                    │
                                       (back navigation) ──────────◄─┘  (image preserved)
```

- `ready` is the only state in which "Continue" is enabled (FR-013).
- Removal/validation failure always returns to `null` (FR-007).

### RoomImageSession

The tab-scoped persistence envelope that makes the image survive step navigation and a refresh within the same tab (clarified Q2 → FR-014).

| Item | Persistence |
|------|-------------|
| In-app route navigation | React Context (in-memory) |
| Full page refresh (same tab) | `sessionStorage` key `designSession` (JSON: `{ roomImage }`) |
| New tab / tab closed | Not persisted (cleared automatically by the browser) |
| `sessionStorage` quota hit / private mode error | Falls back to in-memory-only (still works across steps; refresh-survival degraded) |

Serialization: `RoomImage` is stored as JSON; the image payload itself is the base64 `dataUrl` string. Large payloads may exceed the nominal ~5 MB sessionStorage quota — handled by the try/catch fallback documented in `research.md` R2.

## Handoff to next step

`/design/next` consumes the active `RoomImage` from `DesignContext` (never from the URL). The room/style handoff params (`?room=`, `?style=`) continue to travel via URL query string (contract: `contracts/routing-auth.md`).

## Future server model (not implemented)

When the backend upload endpoint ships, the client-sent `RoomImage` body must map to a server-side record. Contractually anticipated fields: `id`, `userId`, `storageKey` (server-owned URL), `originalName`, `mimeType`, `sizeBytes`, `status` (pending → ready → generated). See `contracts/room-image-upload-api.md`.