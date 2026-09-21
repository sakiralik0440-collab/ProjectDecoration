---

description: "Task list for the Home Page feature implementation"

---

# Tasks: Home Page

**Input**: Design documents from `/specs/004-home-page/`

**Prerequisites**: plan.md (required), spec.md (user stories: US1 P1 browse/navigate, US2 P2 start-a-design, US3 P3 personalized recent designs), research.md, data-model.md, contracts/ (routing-auth.md, recent-designs-api.md, furniture-catalog-api.md), quickstart.md

**Tests**: No automated test runner exists in this repo (see research.md D12). "Testing and verification" is delivered as manual browser verification tasks in Phase 6 against `quickstart.md`; no TDD test-writing tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Foundations cover the route/auth changes every story depends on.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app layout: `frontend/src/` (this feature touches the frontend only; `backend/` is NOT modified)

<!--
  ============================================================================
  USER STORIES (from spec.md, in priority order):

  US1 (P1) Browse the Public Home Page and Navigate - Navbar, Hero,
          How It Works, AI Features, Footer, auth-aware nav, route resolution
  US2 (P2) Start a Design from the Home Page - Room Categories, Interior Styles,
          Before/After, Furniture Preview, Final CTA, design handoff params
  US3 (P3) View Personalized Content - My Recent Designs (auth-gated,
          loading/error/empty states, zero protected calls when logged out)
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the feature

- [X] T001 Create `frontend/src/pages/` directory and `frontend/src/data/staticData.js` with the static content arrays defined in data-model.md: `ROOM_CATEGORIES` (4: living-room, bedroom, kitchen, office), `INTERIOR_STYLES` (5: modern, classic, luxury, minimal, rustic), `HOW_IT_WORKS_STEPS` (4: Upload Room, Choose Style, Generate with AI, Save & Download), `AI_FEATURES` (6: AI Room Analysis, AI Interior Design Generation, Smart Furniture Suggestions, Multiple Design Variations, Save Designs, Download Designs), and `FURNITURE_ITEMS` (6-8 curated items with id, name, category, price, description, gradient per data-model.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented — all routes resolve, auth landing updated, placeholder destinations exist

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extend `frontend/src/index.css` with reusable design tokens (CSS custom properties for colors, radii, shadows, spacing, breakpoints), a max-width centered `.container`, and shared `.section`, `.section-title`, `.btn`, `.btn-primary`, `.card-grid`, `.card` utility classes that preserve the existing glass-morphism, Inter-font, `#4a90e2`-primary theme (research.md D9)
- [X] T003 [P] Update `frontend/src/App.jsx` route table per `contracts/routing-auth.md`: render `pages/Home.jsx` at `/`; add `/design`, `/furniture`, `/designs`, `/profile`; wrap `/designs` and `/profile` in the existing `ProtectedRoute`; change catch-all `*` from `/register` redirect to Home; remove the `/dashboard` route
- [X] T004 [P] Update `frontend/src/context/AuthContext.jsx` so the post-login redirect changes from `/dashboard` to `/` (research.md D2)
- [X] T005 [P] Create `frontend/src/components/ComingSoon.jsx` shared placeholder-body component (title, message, optional "Back to Home" link) used by placeholder pages
- [X] T006 [P] Create `frontend/src/pages/DesignMyRoom.jsx` placeholder that reads `?room=` and `?style=` via `useSearchParams()` and displays the preselected Room Category / Interior Style (contract `routing-auth.md` section "Design-Workflow Handoff", specs FR-020)
- [X] T007 [P] Create `frontend/src/pages/Furniture.jsx` placeholder for the future furniture catalog (ComingSoon body)
- [X] T008 [P] Create `frontend/src/pages/MyDesigns.jsx` placeholder (ComingSoon body) - protected via `ProtectedRoute` at route definition in App.jsx
- [X] T009 [P] Create `frontend/src/pages/Profile.jsx` showing the current user's name and email from `AuthContext` plus a Logout button (supersedes the retired `components/Auth/Dashboard.jsx` purpose)
- [X] T010 Remove `frontend/src/components/Auth/Dashboard.jsx` (no longer routed; superseded by Home and Profile)

**Checkpoint**: On `npm run dev`, `/` renders (or a clear placeholder), `/login` + OTP + register flows still work, post-login lands on `/`, and `/design`, `/furniture`, `/designs`, `/profile` resolve (the latter two redirect to `/login` when logged out).

---

## Phase 3: User Story 1 - Browse the Public Home Page and Navigate (Priority: P1)

**Goal**: A visitor sees a complete public Home Page shell - auth-aware Navbar, Hero, How It Works, AI Features, Footer - and can navigate everywhere without error.

**Independent Test**: Open `/` logged out and logged in; all five US1 sections render; every navbar link resolves; Login/Register shown when logged out, Logout/Profile when logged in; no horizontal scrolling from 320 px to 1920 px (quickstart Scenarios 1-2).

### Implementation for User Story 1

- [X] T011 [P] [US1] Create `frontend/src/components/Navbar.jsx` - sticky, auth-aware via `AuthContext` (`user`/`token`/`logout`): brand/logo link, links Home (`/`), Design My Room (`/design`), Furniture (`/furniture`), My Designs (`/designs`), Profile (`/profile`); right side shows Login (`/login`) and Register (`/register`) when logged out, or the user's name + Logout when logged in; mobile hamburger toggle that expands/collapses the menu (spec FR-001, FR-002)
- [X] T012 [P] [US1] Create `frontend/src/components/Hero.jsx` - heading "Transform Your Room with AI", short description of the AI room-decoration service, primary button "Design My Room" routing to `/design`, secondary button "Explore Furniture" routing to `/furniture`, and a CSS-gradient interior-design visual (no remote images, research.md D10; spec FR-003)
- [X] T013 [P] [US1] Create `frontend/src/components/HowItWorks.jsx` rendering the 4 steps from `staticData.js` `HOW_IT_WORKS_STEPS` (spec FR-005)
- [X] T014 [P] [US1] Create `frontend/src/components/AiFeatures.jsx` rendering the 6 features from `staticData.js` `AI_FEATURES` (spec FR-008)
- [X] T015 [P] [US1] Create `frontend/src/components/Footer.jsx` - ProjectDecoration info, quick links, main feature links, and a copyright notice (spec FR-013)
- [X] T016 [P] [US1] Add responsive section styles for Navbar (incl. hamburger at breakpoint), Hero, HowItWorks, AiFeatures, and Footer in `frontend/src/index.css` (research.md D9 breakpoints 1024/768/480)
- [X] T017 [US1] Create `frontend/src/pages/Home.jsx` composing the P1 sections in order: Navbar, Hero, HowItWorks, AiFeatures, Footer (depends on T011-T016)

**Checkpoint**: User Story 1 independently testable - full public page shell, all nav resolves, auth-aware controls.

---

## Phase 4: User Story 2 - Start a Design from the Home Page (Priority: P2)

**Goal**: Every design/product entry point on the Home Page routes the user into the corresponding workflow with preselects carried along.

**Independent Test**: Clicking the 4 room category cards, 5 interior style cards, "Try It Yourself", and "Start Designing" opens `/design` with the correct `?room=`/`?style=` params (survive refresh); clicking "Explore Furniture"/"View All Furniture" opens `/furniture`; no link falls through to the catch-all (quickstart Scenarios 3-4).

### Implementation for User Story 2

- [X] T018 [P] [US2] Create `frontend/src/components/RoomCategories.jsx` - 4 interactive cards from `staticData.js` `ROOM_CATEGORIES`; each links to `/design?room=<id>` (spec FR-004, FR-020)
- [X] T019 [P] [US2] Create `frontend/src/components/InteriorStyles.jsx` - 5 selectable style cards from `staticData.js` `INTERIOR_STYLES`; each links to `/design?style=<id>` (spec FR-006, FR-020)
- [X] T020 [P] [US2] Create `frontend/src/components/BeforeAfter.jsx` - "before" (original room) and "after" (AI-designed room) gradient visuals with a "Try It Yourself" button linking to `/design` (spec FR-007)
- [X] T021 [P] [US2] Create `frontend/src/components/FurniturePreview.jsx` - renders the curated `FURNITURE_ITEMS` (name, category, price, description) with a "View All Furniture" link to `/furniture` (spec FR-009)
- [X] T022 [P] [US2] Create `frontend/src/components/FinalCta.jsx` - "Ready to Redesign Your Room?" heading with a "Start Designing" button linking to `/design` (spec FR-012)
- [X] T023 [P] [US2] Add responsive section styles for RoomCategories, InteriorStyles, BeforeAfter, FurniturePreview, and FinalCta in `frontend/src/index.css`
- [X] T024 [US2] Integrate the P2 sections into `frontend/src/pages/Home.jsx` in spec order: Hero, RoomCategories, HowItWorks, InteriorStyles, BeforeAfter, AiFeatures, FurniturePreview, (RecentDesigns next phase), FinalCta, Footer (depends on T018-T023)
- [X] T025 [US2] Verify design handoff: from each card/button confirm the `/design` placeholder displays the selected room/style and refresh keeps `?room=`/`?style=` (contract `routing-auth.md`; spec FR-020, FR-019)

**Checkpoint**: User Stories 1 AND 2 independently testable - every CTA resolves and carries preselects.

---

## Phase 5: User Story 3 - View Personalized Content (Priority: P3)

**Goal**: Logged-in users see their recent designs (or a clear empty state); logged-out visitors see a prompt and trigger zero protected requests.

**Independent Test**: Logged out - "My Recent Designs" shows a login prompt and the network tab shows no designs request. Logged in (API flag off, default) - empty state with "Start Designing". Toggle `DESIGNS_API_AVAILABLE = true` in `services/designs.js` - spinner, then grid/empty/error-with-retry as applicable (quickstart Scenario 5).

### Implementation for User Story 3

- [X] T026 [P] [US3] Create `frontend/src/services/designs.js` per `contracts/recent-designs-api.md` - `DESIGNS_API_AVAILABLE` constant (default `false`), `isDesignsApiAvailable()`, and `fetchRecentDesigns({ limit = 4 })` that call `GET /api/designs` through the shared `frontend/src/services/api.js` axios instance when enabled (never invoked when logged out)
- [X] T027 [US3] Create `frontend/src/components/RecentDesigns.jsx` with the 4-state machine from `contracts/recent-designs-api.md`: (1) no token -> login/promotional prompt with zero API calls, (2) authenticated + API disabled -> empty state with "Start Designing" CTA, (3) authenticated + API enabled -> loading spinner, then (a) data grid, (b) empty state, or (c) error state with retry (spec FR-010, FR-011, FR-014)
- [X] T028 [US3] Add RecentDesigns styles in `frontend/src/index.css` and integrate `RecentDesigns.jsx` into `frontend/src/pages/Home.jsx` at its spec position (between FurniturePreview and FinalCta) (depends on T027)
- [X] T029 [US3] Verify zero designs network requests while logged out and empty-state behavior while logged in (spec SC-005; quickstart Scenario 5)

**Checkpoint**: All three user stories independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive/acceptance hardening and regression verification across all stories (covers the requested "Responsive design", "API integration", and "Testing and verification" items end-to-end)

- [X] T030 Responsive audit across breakpoints (1024 px/768 px/480 px): verify section reflow, hamburger nav, tap targets, and no horizontal scrolling from 320 px to 1920 px in `frontend/src/index.css` (spec SC-003; quickstart Scenario 1 step 3-4)
- [X] T031 Accessibility pass on `frontend/src/components/Navbar.jsx`, sections, and placeholder pages: semantic landmarks, aria labels/menu state on the hamburger, visible focus states, descriptive links
- [X] T032 API integration confirmation: verify the only live APIs used are the existing auth endpoints consumed via `AuthContext` (`/api/auth/login`, `/register`, `/register/request-otp`, `/register/verify-otp`, `/me`); no new backend dependency introduced (quickstart Scenario 7)
- [X] T033 Run every scenario in `specs/004-home-page/quickstart.md` (1-7) in a browser: public render, auth-aware nav, all links resolve, design handoff params, Recent Designs states, furniture preview, and the login/register/JWT regression guard; fix any failures (spec SC-007)
- [X] T034 Update `specs/004-home-page/plan.md` and error/empty-state docs in `contracts/` if implementation diverges from plan (keep artifacts in sync)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 for staticData imports) - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Phase 3) then US2 (Phase 4) then US3 (Phase 5) sequentially, or in parallel once Foundation is ready
- **Polish (Phase 6)**: Depends on US1, US2, US3 being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational - no story dependencies; Home.jsx (T017) is the shared composition file
- **US2 (P2)**: After Foundational - a single-file dependency on Home.jsx integration (T024); must not conflict with T017
- **US3 (P3)**: After Foundational - depends on Home.jsx integration position (T028)

### Within Each Phase

- All `[P]` tasks in a phase can run in parallel (distinct files: individual components, pages, services)
- Component tasks (e.g., T011-T015) before their integration into Home.jsx (T017/T024/T028)
- Integration/verification tasks last within each story
- Phase 6 must be the final gate before implementation is considered complete

### Parallel Opportunities

- Phase 1 + Phase 2 `[P]` infrastructure tasks (T002-T010) can be built simultaneously
- Within US1: T011-T016 are parallel (T016 styles require the components' class names to be agreed, so coordinate class naming with T011-T015)
- Within US2: T018-T023 are parallel
- US3: T026 before T027-T029
- Different user stories can be worked on by different people after Foundational completes

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Create Navbar.jsx (auth-aware, hamburger) in frontend/src/components/Navbar.jsx"
Task: "Create Hero.jsx in frontend/src/components/Hero.jsx"
Task: "Create HowItWorks.jsx from staticData in frontend/src/components/HowItWorks.jsx"
Task: "Create AiFeatures.jsx from staticData in frontend/src/components/AiFeatures.jsx"
Task: "Create Footer.jsx in frontend/src/components/Footer.jsx"
Task: "Add responsive section styles to frontend/src/index.css"

# Then integrate (single file, sequential):
Task: "Compose sections into frontend/src/pages/Home.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (staticData + pages dir)
2. Complete Phase 2: Foundational (routes, auth redirect, placeholders - CRITICAL)
3. Complete Phase 3: User Story 1 (public page shell + navigation)
4. **STOP and VALIDATE**: Run quickstart Scenarios 1-2
5. Deploy/demo a navigable public Home Page (the MVP value slice)

### Incremental Delivery

1. Setup + Foundational -> Foundation ready (routes resolve, no regressions in auth)
2. Add User Story 1 -> test independently (public shell + nav) -> deploy/demo (MVP)
3. Add User Story 2 -> test independently (all design/Furniture entry points route with preselects)
4. Add User Story 3 -> test independently (Recent Designs auth-gated states)
5. Polish (Phase 6) -> full quickstart regression pass

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 components + Home.jsx
   - Developer B: US2 components (hold Home.jsx integration until A's composition merge)
   - Developer C: US3 components (hold Home.jsx integration position)
3. Stories complete and integrate in spec section order

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the spec user story for traceability
- Home.jsx is the ONE shared composition file - all section integrations edit it sequentially (T017, T024, T028) to avoid merge conflicts
- All sections must handle only their own styling additions in `frontend/src/index.css` (single stylesheet per research.md D9)
- No backend changes; no Admin Portal; no new runtime dependencies (research.md findings)
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently