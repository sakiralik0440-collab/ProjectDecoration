---

description: "Task list for the Room Image Input feature implementation"
---

# Tasks: Room Image Input

**Input**: Design documents from `/specs/005-room-image-input/`

**Prerequisites**: plan.md, spec.md (user stories), research.md, data-model.md, contracts/ (routing-auth.md, room-image-upload-api.md), quickstart.md

**Tests**: No test runner is configured in the repo and the spec does not request TDD; verification is scenario-based manual QA via quickstart.md plus the existing `npm run build` gate. No test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Frontend-only feature (React + Vite SPA); backend is NOT touched.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions (all paths under `frontend/`)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature structure so later edits are localized and build-safe

- [X] T001 [P] Create the feature component folder `frontend/src/components/RoomImageInput/`
- [X] T002 [P] Create minimal build-safe stubs `frontend/src/pages/RoomImageInput.jsx` and `frontend/src/pages/DesignNext.jsx` (simple placeholder bodies) so routing edits never break the build

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create `DesignContext` in `frontend/src/context/DesignContext.jsx` — exposes `roomImage`, `setRoomImage`, `clearRoomImage`; hydrates initial state from `sessionStorage` key `designSession` on mount; wraps `setItem` in try/catch with in-memory fallback on `QuotaExceededError`/`SecurityError` (research R2, data-model RoomImageSession)
- [X] T004 Wire `DesignProvider` into the app tree in `frontend/src/main.jsx` (beside the existing `AuthProvider`; `DesignProvider` must sit inside `React.StrictMode` but its context does not depend on auth)
- [X] T005 Create `frontend/src/services/roomImage.js` — `ALLOWED_IMAGE_TYPES` (image/jpeg, image/png, image/webp), `MAX_ROOM_IMAGE_BYTES = 10 * 1024 * 1024`, `validateRoomImageFile(file)` (type + extension + size), `fileToDataUrl(file)`, `decodeImageDimensions(dataUrl)` (rejects undecodable with natural size 0), `captureFrameToDataUrl(video)` (canvas draw → JPEG ~0.9), `formatBytes(bytes)`
- [X] T006 Add the room-input feature styles to `frontend/src/index.css` — step page layout, two option cards, preview card (object-fit, fixed-aspect frame), camera viewport/controls, error states, disabled Continue, and responsive rules at the existing 1024/768/480 breakpoints (research R9)
- [X] T007 Add routes in `frontend/src/App.jsx` — `/design` renders `RoomImageInput` and `/design/next` renders `DesignNext`; both public, all other routes unchanged

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload a Room Image (Priority: P1) **MVP**

**Goal**: The user picks a valid JPEG/PNG/WEBP room photo via the native picker, gets a responsive preview with filename/size, can Change or Remove it, and Continue carries the image to the next step.

**Independent Test**: Open `/design`, upload one valid photo ≤10 MB → preview + filename/size appear, Continue enables; pick a `.pdf` → "Please select a valid image file."; pick an image >10 MB → "The image is too large. Please choose a smaller image."; Remove returns to the two-option state; Continue lands on `/design/next` with the image retained.

### Implementation for User Story 1

- [X] T011 [P] [US1] Build `ImageUploader` component in `frontend/src/components/RoomImageInput/ImageUploader.jsx` — hidden `<input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp">`, single image, runs `validateRoomImageFile` → `fileToDataUrl` + `decodeImageDimensions`, emits the valid `roomImage` or a user-friendly error ("Please select a valid image file." / "The image is too large. Please choose a smaller image."), shows the 10 MB limit
- [X] T012 [P] [US1] Build `ImagePreview` component in `frontend/src/components/RoomImageInput/ImagePreview.jsx` — responsive non-distorted preview, filename where available (upload source), formatted size, plus "Change Image" and "Remove Image" actions
- [X] T013 [US1] Compose the step-1 page in `frontend/src/pages/RoomImageInput.jsx` — heading "Let's Start With Your Room", description "Upload a photo of your room or capture one using your camera.", the two option cards (Upload Room / Capture Room placeholder), composing `ImageUploader` + `ImagePreview`, wiring image state through `DesignContext`, and a "Continue" button disabled until the image is ready
- [X] T014 [US1] Implement Continue → `/design/next` in `frontend/src/pages/RoomImageInput.jsx` (navigate via `Link`/`useNavigate`, preserving `?room=`/`?style=`) and create the stub `frontend/src/pages/DesignNext.jsx` body ("Style & Generate — coming soon" via the existing `ComingSoon` component + a "Back to Step 1" link)
- [X] T015 [US1] Surface the room/style handoff from `?room=`/`?style=` as context text on the step-1 page in `frontend/src/pages/RoomImageInput.jsx` (read `ROOM_CATEGORIES`/`INTERIOR_STYLES` from `frontend/src/data/staticData.js`, reuse the FEAT-004 lookup pattern) — no regression for Home CTAs

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (quickstart S1–S9)

---

## Phase 4: User Story 2 - Capture a Room Image with the Camera (Priority: P2)

**Goal**: The user grants camera permission, sees a live preview, captures a photo, can Retake or Use it, and the camera stream always stops on cancel/leave/use.

**Independent Test**: On a camera-equipped device run quickstart S10–S14 — permission prompt → live preview; Capture → Retake/Use; Use This Photo → active image preview; deny permission → "Camera permission is required to capture a room photo." with Upload still working; no camera → availability message; camera light/indicator stops in every exit path.

### Implementation for User Story 2

- [X] T021 [US2] Build `CameraCapture` component in `frontend/src/components/RoomImageInput/CameraCapture.jsx` — permission request via `getUserMedia({ video: { facingMode: "environment" }, audio: false })`, live `<video>` preview (autoplay, playsInline, muted), state machine (requesting → streaming → captured → done), controls: Capture Photo, Cancel, then Retake / Use This Photo after a capture; explicit messages for permission denied ("Try Camera Again" retry action stays available) and camera-unavailable (FR-009/FR-010); captured frame produced via `captureFrameToDataUrl`
- [X] T022 [US2] Implement MediaStream lifecycle in `frontend/src/components/RoomImageInput/CameraCapture.jsx` — stop every track on Cancel, Retake, Use This Photo, and component unmount (effect cleanup) with a mounted-ref guard against post-unmount stops (depends on T021)
- [X] T023 [US2] Integrate the camera option into `frontend/src/pages/RoomImageInput.jsx` — "Capture Room" opens `CameraCapture`; "Use This Photo" commits the captured frame as a camera-source `roomImage` via `DesignContext` (so the shared preview/Change(Retake)/Remove/Continue path applies); when `navigator.mediaDevices?.getUserMedia` is absent the Capture Room card stays visible but disabled with a clear availability note (FR-001/FR-010); retaking from the ready preview reopens the camera (FR-012)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Image Persists Across Workflow Steps (Priority: P3)

**Goal**: The provided image survives step navigation, back-navigation, and an in-tab refresh; a new tab starts empty.

**Independent Test**: quickstart S7–S9 — back from `/design/next` restores the image; refresh in the same tab restores it (sessionStorage); a new tab shows none.

### Implementation for User Story 3

- [X] T031 [US3] Restore the active image on step-1 mount in `frontend/src/pages/RoomImageInput.jsx` — when `DesignContext.roomImage` is set (e.g. returning from `/design/next`), show the ready preview instead of starting at the two-option state
- [X] T032 [US3] Display the retained image summary on `/design/next` in `frontend/src/pages/DesignNext.jsx` — render the active `roomImage` preview (reusing `ImagePreview`) so the user can confirm their photo carried over; show a friendly prompt to go back when no image exists
- [X] T033 [US3] Ensure `clearRoomImage` in `frontend/src/context/DesignContext.jsx` also removes the `designSession` sessionStorage key, and that new-tab/no-payload mounts produce a clean `null` state with no errors

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories + full verification

- [X] T041 [P] Add accessibility/polish styles in `frontend/src/index.css` — disabled button styling, visible `:focus-visible` outlines, touch-friendly camera control sizes at the 480/768 breakpoints
- [X] T042 [P] Add accessibility semantics across the new components — `aria-label`s on camera controls, `aria-live="polite"` for inline validation errors, `alt`/`role="img"` on the preview in `frontend/src/components/RoomImageInput/` and `frontend/src/pages/`
- [X] T043 Run the build gate: `npm run build` from `frontend/` — must complete with no errors
- [X] T044 Execute quickstart.md validation scenarios S1–S17 (manual; camera scenarios on a device with a camera)
- [X] T045 Regression verification — Home Page render, Login/Register/JWT flows, `/designs` + `/profile` protection, `/furniture`, unknown-route catch-all, and the `?room=`/`?style=` handoff still behave as before
- [X] T046 Console-cleanliness pass and doc alignment — no new browser console errors during S1–S17; update plan.md/contracts if implementation diverges

**Checkpoint**: All verification passes; feature ready to hand off

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion; then run sequentially in priority order (US1 → US2 → US3)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other stories (MVP)
- **User Story 2 (P2)**: Can start after Foundational - composes the same `DesignContext`/preview path built for US1 but is independently testable
- **User Story 3 (P3)**: Can start after Foundational - largely carried by `DesignContext` (T003) plus page-level restoration; validates continuity end-to-end

### Within Each User Story

- Story components before page composition
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T001 and T002 are marked [P] and can run in parallel
- Within US1, T011 and T012 are [P] and can run in parallel (distinct files); T013–T015 depend on them and run in sequence
- US2 is a single-file build-up (T021 → T022 → T023, sequential, same file)
- Polish T041 and T042 are [P]
- Different user stories can be worked in parallel by different team members after Phase 2

---

## Parallel Example: User Story 1

```bash
# Launch the two independent components together:
Task: "Build ImageUploader in frontend/src/components/RoomImageInput/ImageUploader.jsx"
Task: "Build ImagePreview in frontend/src/components/RoomImageInput/ImagePreview.jsx"

# Then compose (depends on both):
Task: "Compose the step-1 page in frontend/src/pages/RoomImageInput.jsx"
Task: "Implement Continue and the /design/next stub (RoomImageInput.jsx + DesignNext.jsx)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart S1–S9 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational - Foundation ready
2. Add User Story 1 - Test independently - Deploy/Demo (MVP!)
3. Add User Story 2 - Test independently - Deploy/Demo
4. Add User Story 3 - Test independently - Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- The `/design/next` route and `DesignContext` are shared across stories; treat them as stable infrastructure once Phase 2 + US1 land
- Camera scenarios (S10–S14) require a real device/browser; desktop fallback messages are part of FR-009/FR-010, not failures