# Future API Contract: Room Image Upload

**Feature**: specs/005-room-image-input | **Status**: NOT IMPLEMENTED (documented for alignment only)

This endpoint does **not** exist yet. It is the contract the client `RoomImage` payload is shaped to satisfy (spec FR-017/§10, §11 security). Until it ships, the design flow is entirely frontend-only and the image never leaves the user's browser.

## Endpoint

`POST /api/designs/room-image`

- Content-Type: `multipart/form-data`
- Auth: `Authorization: Bearer <JWT>` (the shared axios instance already attaches it via the request interceptor)
- Body field: `image` (file part)

## Server-side acceptance rules (mandatory — never trust client validation alone)

| Rule | Value |
|------|-------|
| Required part | `image` present |
| Sniffed content | magic bytes must indicate JPEG, PNG, or WEBP (ignore client-provided MIME) |
| Size | ≤ 10 MB (`10 * 1024 * 1024`) |
| Count | exactly one image |

## Response

**201 Created**

```json
{
  "image": {
    "id": "img_...",
    "url": "/api/designs/room-image/...",
    "originalName": "living-room.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 2450201,
    "width": 4032,
    "height": 3024
  }
}
```

Client implications: on success the client should swap its local `dataUrl` session payload for the server-owned `url`, keeping the same `RoomImage` shape (`contracts` in `data-model.md`).

## Errors

| Status | Body message | When |
|--------|--------------|------|
| 400 | `No image file provided` | missing/malformed part |
| 401 | auth middleware message | missing/invalid token |
| 413 | `Image too large` | over 10 MB after parse |
| 415 | `Unsupported image type` | sniffed type not JPEG/PNG/WEBP |

These statuses map 1:1 to the client messages already defined in the spec (FR-004, FR-005, FR-009).