# Implementation Plan: Room Image Input

**Branch**: `005-room-image-input` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-room-image-input/spec.md`

## Summary

Build the first step of the Design My Room workflow: a "Room Image Input" experience where a user provides a room photo either by uploading a JPEG/PNG/WEBP file or by capturing one through the device camera. The step lives at `/design` (replacing the current ComingSoon placeholder), validates the image (type, ≤10 MB, decodability), shows a responsive preview with filename/size and Change/Remove actions, and on **Continue** advances to a new stub page `/design/next` ("Style & Generate — coming soon") while retaining the image via a new `DesignContext` persisted to `sessionStorage` (survives step navigation and an in-tab refresh).

Frontend-only: no backend/upload changes, no new runtime dependencies, no new auth gates. The future `POST /api/designs/room-image` contract is documented for alignment. Builds on the existing React + Vite SPA, `AuthContext`-style Context pattern, and the plain-CSS design system (`research.md`, `contracts/`, `data-model.md`).

## Technical Context

**Language/Version**: JavaScript (ECMAScript modules / JSX), React 18.2, Vite 5 (Node.js backend present but untouched)

**Primary Dependencies**: `react-router-dom` ^6.14 (existing), `react-dom` ^18.2 (existing), `axios` ^1.5 (existing — only reused via the future upload contract). No new runtime dependencies. Browser APIs used directly: File API / `<input type="file">`, `navigator.mediaDevices.getUserMedia`, `<canvas>`, `sessionStorage`.

**Storage**: Frontend `sessionStorage` (key `designSession`, base64 data URL JSON) + in-memory React Context; backend MongoDB untouched.

**Testing**: No test runner configured in the repo (no scripts in `frontend/package.json` or `backend/package.json`); validation is `npm run build` + scenario-based manual QA per `quickstart.md` (camera UX is inherently device-dependent).

**Target Platform**: Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on desktop, tablet, mobile. Camera requires a secure context (HTTPS) or `localhost` (we run on localhost in dev).

**Project Type**: Web application — React SPA frontend (`frontend/`); this feature touches the frontend only.

**Performance Goals**: Preview renders immediately after selection (<500 ms, local encode); camera preview starts within ~2 s of permission grant; no layout shift on the step layout (spec SC-001/SC-006).

**Constraints**: Max image 10 MB (FR-005); sessionStorage nominal quota (~5 MB) — try/catch fallback to in-memory (clarified Q2); `getUserMedia` unavailable paths must fall back to upload gracefully (FR-009/FR-010); camera stream stopped on every exit path (FR-011); `?room=`/`?style=` handoff preserved (FR-015 regression); all existing routes/auth intact (SC-008).

**Scale/Scope**: One step-1 page + one stub page, ~4 new reusable components (`RoomImageInput`, `ImageUploader`, `CameraCapture`, `ImagePreview`), one new `DesignContext`, one new `services` helper, CSS additions, and contracts/QA docs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unfilled template — it defines no enforceable principles or gates. No violations. This feature complies with the reasonable defaults the template implies: reuse existing architecture (Context pattern, plain CSS, existing routes), keep components self-contained and simply structured, avoid scope creep (no backend, no AI/furniture generation). Re-checked after Phase 1 design: still compliant.

## Project Structure

### Documentation (this feature)

```text
specs/005-room-image-input/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── routing-auth.md        # Route map, auth, image handoff contract
│   └── room-image-upload-api.md  # Future protected upload endpoint contract
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── pages/
    │   ├── RoomImageInput.jsx        # NEW — step-1 page at /design (replaces DesignMyRoom placeholder content)
    │   └── DesignNext.jsx            # NEW — stub at /design/next ("Style & Generate — coming soon"), shows retained image
    ├── components/
    │   ├── RoomImageInput/            # NEW — feature-owned components under one folder
    │   │   ├── ImageUploader.jsx      # NEW — native picker + validation + error messaging
    │   │   ├── CameraCapture.jsx      # NEW — getUserMedia preview, capture/retake/use/cancel, stream cleanup
    │   │   └── ImagePreview.jsx       # NEW — responsive preview card (filename, size, Change/Remove)
    │   ├── ComingSoon.jsx             # UNCHANGED (reused by /design/next)
    │   ├── Navbar.jsx                 # UNCHANGED
    │   └── Auth/                      # UNCHANGED (Login, Register, ProtectedRoute, OtpVerification)
    ├── context/
    │   ├── AuthContext.jsx            # UNCHANGED
    │   └── DesignContext.jsx          # NEW — room image session state + sessionStorage hydration
    ├── services/
    │   ├── api.js                     # UNCHANGED
    │   └── roomImage.js               # NEW — validation helpers, MAX size const, capture-to-dataUrl helper
    ├── App.jsx                        # MODIFY — point /design at RoomImageInput; add /design/next
    ├── index.css                      # MODIFY — step-1 layout, preview card, camera UI, responsive rules
    └── main.jsx                       # MODIFY — wrap app in DesignProvider (beside AuthProvider)

backend/                                # NOT modified in this feature
```

**Structure Decision**: Follow the existing single-folder frontend layout opened up in FEAT-004 (`pages/`, `components/`, `context/`, `services/`, `data/`). The step components are grouped under `components/RoomImageInput/` (a feature folder) which matches "keep feature code separated from unrelated features" (spec §13) while staying within the established conventions. The stub page reuses the existing `ComingSoon` component. No new state library — `DesignContext` mirrors the `AuthContext` provider pattern (`research.md` R4).

## Complexity Tracking

No Constitution Check violations; Complexity Tracking table intentionally omitted.