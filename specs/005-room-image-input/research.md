# Research: Room Image Input

**Feature**: specs/005-room-image-input | **Date**: 2026-09-15

Phase 0 output. Each open question from the plan's Technical Context is resolved here with a decision, rationale, and alternatives. Inspected codebase facts are folded in.

## R1 — File validation strategy (type + size)

**Decision**: Accept only `image/jpeg`, `image/png`, `image/webp`. Validate on three layers:
1. Native picker filter: `accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"`.
2. File type check: MIME must be in the allow list **and** the file extension must match.
3. Decodability check: attempt to load the image (natural dimensions > 0); a corrupt/undecodable file is rejected as "Please select a valid image file."

Size limit: **10 MB** (hard cap, `MAX_ROOM_IMAGE_BYTES = 10 * 1024 * 1024`). The limit is displayed in the UI before selection.

**Rationale**: MIME from the file picker can be spoofed or missing (e.g. renamed files, some mobile pickers pass `application/octet-stream`), so extension + decodability add cheap defense without a server. 10 MB comfortably holds a high-quality phone photo and keeps the session-storage persistence viable.

**Alternatives considered**: `accept="image/*"` (too broad — admits HEIC/GIF into a flow that explicitly excludes them); trusting MIME alone (fails on renamed/octet-stream files); server-side-only validation (impossible — this feature is explicitly frontend-only per FR-017).

## R2 — Client-side image storage and cross-step persistence

**Decision**: A dedicated `DesignContext` (React Context, mirroring the existing `AuthContext` provider pattern) holds the active `roomImage`. Within the same tab the image survives step navigation (in-memory). For refresh survival (clarified Q2), the image is serialized to base64 data URL and written to `sessionStorage` under a single key (e.g. `designSession`). Creators: on every write, `sessionStorage.setItem` is wrapped in try/catch:
- `QuotaExceededError` / `SecurityError` (private mode) → stay in-memory only. The feature still works; only refresh-survival is degraded. No crash.
- Success → a full page refresh within the same tab restores the image and the workflow resumes at the step.

**Rationale**: sessionStorage is scoped to the tab (survives F5, cleared on tab close) — exactly the semantics chosen in Q2. React Context is the state-management solution the repository already uses; a second library is unnecessary ("do not create duplicate state management").

**Alternatives considered**: `localStorage` (wrong lifetime — persists across sessions/tabs and leaks the image); URL-encoded image (blows URL limits and pollutes navigation); module-level singleton (survives route nav but NOT refresh, contradicting Q2).

**Size note**: base64 inflates ~33%. A 10 MB file → ~13.3 MB string, which can exceed the nominal ~5 MB sessionStorage quota. Mitigation: for camera captures the canvas pipeline re-encodes to JPEG (~quality 0.9), typically well under quota; large uploads gracefully fall back to in-memory. A future upload API becomes the real persistence layer.

## R3 — Camera capture pipeline (getUserMedia)

**Decision**: Use the standard Web Camera API only (`navigator.mediaDevices.getUserMedia`). Request `video: { facingMode: 'environment' }` (rear camera on phones, default webcam elsewhere), `audio: false`. No third-party service (spec explicitly forbids one; the repo has none).

Capture flow: live `<video>` preview → on "Capture Photo", draw the current frame to a `<canvas>` at the video's intrinsic resolution → `canvas.toBlob('image/jpeg', 0.9)` → convert to data URL for the shared preview + storage.

Stream lifecycle (FR-011): every `MediaStream` track is stopped via `stream.getTracks().forEach(t => t.stop())` on: cancel, Retake-from-captured, Use This Photo, component unmount (page leave via effect cleanup). A mounted-state ref guards against stopping after async unmount.

**Rationale**: getUserMedia + canvas is the standards-based, dependency-free approach; object URL / blob URL previews are rejected in favor of a data URL because blob URLs do not survive a page refresh and would break the Q2 persistence contract.

**Alternatives considered**: WebRTC recorders (overkill — stills only); third-party capture SDKs (explicitly excluded); `<input type=file capture="environment">` as primary (uses the native camera capture UI and returns a File — good as a fallback on iOS, but lacks the in-app live preview, Retake, and permission messaging the spec requires).

**Environment constraints documented**: getUserMedia requires a secure context (HTTPS) — `localhost` is exempt, so dev works; production must be served over HTTPS. On desktop the environment camera usually is the webcam; if `navigator.mediaDevices` or `getUserMedia` is absent (`http` on some older browsers / in-app webviews), the availability path (FR-010) fires.

## R4 — State management approach (reuse vs. new)

**Decision**: Reuse the repository's React Context pattern with one new `DesignContext`/`DesignProvider` (added beside `AuthProvider` in `main.jsx`). It exposes `roomImage`, `setRoomImage`, `clearRoomImage`, and a `visible` summary of what the current image contains (source, filename, size). It reads initial state from `sessionStorage` on mount (hydration for the refresh case).

**Rationale**: Consistent with the only state store the app has (`AuthContext`); keeps the "image must stay available to the next step" guarantee centralized rather than prop-drilled through `/design` and `/design/next`.

**Alternatives considered**: Prop drilling between the two steps (fragile, breaks on refresh); Redux/Zustand (new dependency + parallel state system — explicitly avoided); URL params (impractical for image payloads).

## R5 — Routing and workflow placement

**Decision**: Step 1 lands at the existing **`/design`** route (the Design My Room entry, replacing its ComingSoon placeholder). Continue navigates to a new stub route **`/design/next`** ("Style & Generate — coming soon") that reads the image from `DesignContext`. Both routes stay **public** — /design is public today and FR-016 forbids adding an auth wall.

**Rationale**: `/design` is already the established Design My Room entry (Home CTAs, `?room=`/`?style=` handoff). Keeping the next step under `/design/next` gives the future AI/style step a real, stable path without disturbing other routes.

**Alternatives considered**: A sibling `/room` route (breaks existing CTA/targeting and the handoff contract); `/design/options` (naming implies a step that doesn't exist yet).

## R6 — Query-param handoff compatibility

**Decision**: The `?room=` / `?style=` params currently read by `DesignMyRoom.jsx` are preserved: the new step-1 page still accepts and displays them as context (header text), and passes them through to `/design/next` via `useSearchParams`/`Link`. No behavior regression for Home CTAs.

**Rationale**: Removing param support would silently break the room/style handoff built in FEAT-004.

## R7 — Backend & future upload contract

**Decision**: No backend work. A future upload endpoint is contract-documented only: `POST /api/designs/room-image` (multipart, Bearer JWT, server-side MIME sniff by magic bytes, size cap, 401/413/415/400 error mapping). Server-side validation is mandatory once the endpoint exists (spec §11 security: never trust client-side validation alone).

**Rationale**: Spec FR-017 / §10 explicitly defer backend work; documenting the contract keeps the frontend payload shape ("ready to be sent") aligned.

## R8 — Testing strategy

**Decision**: No test runner exists in the repo (no test scripts in `frontend/package.json` or `backend/package.json`); do not introduce one for this feature. Verification is scenario-based manual QA documented in `quickstart.md`, plus the existing `npm run build` gate and SSR-style smoke checks where practical.

## R9 — Design system & responsive approach

**Decision**: Extend the existing plain-CSS design system (design tokens, `.btn`, `.card`, `.section`, `.container`) in `frontend/src/index.css`. New block-scoped classes for the input step, preview card, and camera UI. Breakpoints already exist (1024/768/480); camera controls use large touch targets on mobile. Preview uses `object-fit: cover`/contain with a fixed aspect frame to avoid distortion (spec image-preview requirement).

**Rationale**: Mirrors how Features 004 built its UI; consistency with the established glass-morphism look; no CSS framework dependency.

## Consolidated decisions table

| # | Topic | Decision |
|---|-------|----------|
| R1 | Validation | accept={jpeg,png,webp}; MIME + extension + decodability; 10 MB cap shown in UI |
| R2 | Persistence | DesignContext (React Context) + sessionStorage data URL; try/catch quota fallback to memory |
| R3 | Camera | getUserMedia (environment), canvas JPEG 0.9, track stop on all exits |
| R4 | State | New DesignContext beside AuthContext; hydrates from sessionStorage |
| R5 | Routing | /design = step 1 (replaces ComingSoon); /design/next = stub; both public |
| R6 | Handoff | Preserve ?room=/?style= read + pass-through |
| R7 | Backend | None now; future POST /api/designs/room-image contract only |
| R8 | Testing | Manual QA per quickstart.md; no new test framework |
| R9 | Styling | Extend index.css design system; object-fit preview; touch targets |