---

description: "Task list for the Authentication-Aware Navigation Bar feature"
---

# Tasks: Authentication-Aware Navigation Bar

**Input**: Design documents from `/specs/006-auth-aware-navbar/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test framework exists in this project; the feature specification does not request a test suite. Verification is the established project standard: build gate + SSR smoke + manual acceptance (`quickstart.md`). No test tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (backend is out of scope — do not modify)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish a known-good baseline before any change

- [X] T001 Verify the current build passes: run `npm run build` in `frontend/` and record the bundle output; this is the baseline every subsequent change is measured against

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Session-restoring state required by the Navbar's authenticated/restoring view states

**CRITICAL**: No user story work depending on the restore state can begin until this phase is complete. The Navbar's logged-in rendering can start immediately after this (it already consumes `token`/`user`/`logout`).

- [X] T002 Add a minimal `restoring` flag to the existing `AuthContext` provider in `frontend/src/context/AuthContext.jsx` (research R3, `data-model.md`): initialize synchronously to `Boolean(stored token)` (same localStorage read the token state performs); set to `false` on the no-token early return and after the initial `GET /auth/me` settles (success or failure); expose `restoring` in the `AuthContext.Provider` value. Do NOT touch `loading`, `login`, `logout`, `register`, or `requestOtp`.

**Checkpoint**: `AuthContext` exposes `restoring`; existing auth behavior unchanged.

---

## Phase 3: User Story 1 - Logged-Out User Sees Public Navigation (Priority: P1) MVP

**Goal**: A user who is not authenticated sees Home, Design My Room, Furniture, Login, Register — and never Profile, Logout, or My Designs.

**Independent Test**: Render the app with no token present (fresh browser, or after logout) and confirm the logged-out set on any page, desktop and mobile menu.

- [X] T003 [US1] Restructure the always-public links in `frontend/src/components/Navbar.jsx`: render Home (`/`), Design My Room (`/design`), and Furniture (`/furniture`) using the existing `NavLink` + `linkClass` active styling; these must appear in every auth state.
- [X] T004 [US1] Render the logged-out auth actions in `frontend/src/components/Navbar.jsx`: Login and Register as `Link` buttons reusing the existing `btn btn-ghost` / `btn btn-primary` classes, shown only when `Boolean(token) === false`; ensure My Designs and Profile links are NOT rendered in this state.

**Checkpoint**: User Story 1 is fully functional and independently testable (Case 1, Case 6 log-out-paths).

---

## Phase 4: User Story 2 - Logged-In User Sees Authenticated Navigation (Priority: P1)

**Goal**: After successful authentication the navbar immediately shows Home, Design My Room, Furniture, My Designs, Profile, and Logout while hiding Login and Register.

**Independent Test**: Log in and confirm the navbar flips to the authenticated set with no manual reload and Login/Register gone.

- [X] T005 [US2] Render the authenticated-only links in `frontend/src/components/Navbar.jsx`: My Designs (`/designs`) and Profile (`/profile`) as `NavLink`s shown only when `Boolean(token) === true`; remove the now-duplicate Profile entry from the `.navbar-auth` cluster (Profile appears once, in the links list).
- [X] T006 [US2] Render the logged-in auth actions in `frontend/src/components/Navbar.jsx`: an account-name label from `user.name` (neutral placeholder while `user` is null during restore) plus a Logout `button` (`btn btn-ghost`) that invokes the existing `AuthContext.logout`.

**Checkpoint**: User Story 2 is fully functional and independently testable (Case 2).

---

## Phase 5: User Story 3 - Session Survives a Page Refresh (Priority: P1)

**Goal**: A page refresh restores the authenticated session through the existing token + `/auth/me` mechanism; the navbar never flashes Login/Register to a logged-in user during restoration.

**Independent Test**: Log in, refresh Home, and confirm the authenticated set persists with no Login/Register flash.

- [X] T007 [US3] Implement the restoring view state in `frontend/src/components/Navbar.jsx` (contract §3.3, `data-model.md` view table): while `restoring === true` render the authenticated link set (links gate on `token`) but a neutral empty auth-actions region — never Login, Register, or Logout; Login/Register must only render when `token` is absent AND `restoring === false`; consolidate with the T002 flag.

**Checkpoint**: User Story 3 is fully functional and independently testable (Case 3, Case 7).

---

## Phase 6: User Story 4 - Logout Returns to Public Navigation (Priority: P1)

**Goal**: Clicking Logout clears the session through the existing flow and the navbar returns to the logged-out set.

**Independent Test**: Log out and confirm redirect to `/login` and the logged-out navbar set.

- [X] T008 [US4] Confirm the Logout button in `frontend/src/components/Navbar.jsx` invokes the existing `AuthContext.logout` (no new logout logic) and that after the existing redirect to `/login` the reactive rendering (T003/T004) shows the logged-out set; fix any integration gap found rather than changing logout semantics.

**Checkpoint**: User Story 4 is fully functional and independently testable (Case 4).

---

## Phase 7: User Story 5 - Registration and OTP Flow Are Preserved (Priority: P2)

**Goal**: The existing registration flow (request OTP → verify OTP → go to Login) is untouched and no auto-login is introduced; the navbar shows the logged-out set during and after registration until the user logs in.

**Independent Test**: Run the full OTP registration flow and confirm each step navigates exactly as today.

- [X] T009 [US5] Audit the registration flow for regressions: `frontend/src/components/Auth/Register.jsx`, `frontend/src/components/OtpVerification.jsx`, and `requestOtp`/`register` in `frontend/src/context/AuthContext.jsx`. Confirm the OTP sequence and the post-verify redirect to `/login` are preserved and that this feature introduced no automatic login. Make no code changes unless a regression is found.

**Checkpoint**: User Story 5 verified (Case 5).

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification, documentation alignment, and cleanup affecting the whole feature

- [X] T010 [P] Write and run a temporary SSR smoke `__nav-smoke.mjs` in `frontend/` (mirror the technique used for the 005 `room-smoke.mjs`: compile the app JSX with the repo's tooling, seed localStorage/sessionStorage shims, `renderToStaticMarkup` of `App`) covering: logged-out `/` (Login/Register present, My Designs/Profile absent), seeded-token `/` (authenticated links present, Login/Register absent), seeded-token+user `/` (name label + Logout), `/design` + `/furniture` (public links present), and `/login` regression; then delete the temp file.
- [X] T011 [P] Run the build gate: `npm run build` in `frontend/`; confirm it passes with no CSS/JS errors.
- [X] T012 Update `specs/006-auth-aware-navbar/` documents (plan.md, tasks.md checkboxes, quickstart.md) if this implementation diverged from the plan, and mark all tasks `[X]`; report completion with the manual-acceptance remainder per `quickstart.md` S3–S10.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — baseline only; prerequisite for measuring all changes.
- **Foundational (Phase 2)**: Depends on Setup; T002 must be complete before US3 (Phase 5).
- **User Stories (Phase 3+)**: All except US3 depend only on Foundational for their restore behavior. US1/US2/US3/US4 share `frontend/src/components/Navbar.jsx` and MUST run sequentially in the order above (US1 → US2 → US3 → US4). US5 (Phase 7) touches only *verification* of other files and can be audited any time after Setup.
- **Polish (Phase 8)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on others — same file as later stories, so run first.
- **User Story 2 (P1)**: Depends on US1 (same file) — no relation to Foundational.
- **User Story 3 (P1)**: Depends on US1 + US2 (same file) AND Foundational T002 (`restoring`).
- **User Story 4 (P1)**: Depends on US1 + US2 (same file).
- **User Story 5 (P2)**: Audit only — independent of implementation tasks.

### Within Each User Story

- Link sets before auth-actions.
- Implementation before integration.

### Parallel Opportunities

- T001 (baseline build) and T002 (AuthContext) can run in parallel — different files, no dependencies.
- T010 (smoke) and T011 (build gate) can run in parallel after implementation.
- All other tasks touch `frontend/src/components/Navbar.jsx` sequentially.

---

## Parallel Example: Independent Tasks

```bash
# Baseline + foundational context flag together (different files):
Task: "Verify current build passes (T001)"
Task: "Add `restoring` flag to AuthContext (T002)"

# Verification tasks together (Polish phase):
Task: "Run SSR smoke nav-smoke.mjs (T010)"
Task: "Run npm run build gate (T011)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001 baseline)
2. Complete Phase 2 (T002 — optional for US1, unblocks restore semantics)
3. Complete Phase 3 (US1) → STOP and VALIDATE: logged-out navbar set renders on every page, mobile included.

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate logged-out set (Case 1, Case 6) → MVP
3. US2 → validate logged-in set + immediate reactivity (Case 2)
4. US3 → validate refresh + no-flash restore (Case 3, Case 7)
5. US4 → validate logout round-trip (Case 4)
6. US5 → audit OTP flow (Case 5)
7. Polish → smoke + build gate + doc alignment (quickstart S1–S2, R1–R4)

### Parallel Team Strategy

Small single-component feature: one developer runs T001–T009 sequentially; T010/T011 may be parallelized with final documentation. No team-level split is practical because the Navbar file is shared.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Backend is explicitly out of scope — do not modify any file under `backend/`
- Do NOT modify `AuthContext` login/logout/register/requestOtp, Login/Register/OtpVerification pages, `ProtectedRoute`, routes, or the API layer
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently