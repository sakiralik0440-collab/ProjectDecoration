# Implementation Plan: Home Page

**Branch**: `004-home-page` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-home-page/spec.md`

## Summary

Build a modern, responsive Home Page for ProjectDecoration that introduces the AI room-design product and funnels every visitor (logged in or not) into its major features. The Home Page mounts at `/`, becomes the post-login landing page, and retires the placeholder dashboard.

Approach (from research.md): extend the existing React + Vite SPA with a componentized Home page and lightweight placeholder pages at the intended future routes (`/design`, `/furniture`, `/designs`, `/profile`). Reuse the existing `AuthContext` for the auth-aware navbar and the personal "My Recent Designs" section. No backend work in this feature — the Recent Designs and Furniture Preview sections are frontend-only for the first release, with future API contracts documented in `contracts/`. All content and design systems reuse the existing plain-CSS glass-morphism styling; no new runtime dependencies.

## Technical Context

**Language/Version**: JavaScript (ECMAScript modules / JSX), React 18.2, Vite 5, Node.js (backend already present but untouched)

**Primary Dependencies**: `react-router-dom` ^6.14 (existing), `axios` ^1.5 (existing, via `frontend/src/services/api.js`), `react-dom` ^18.2 (existing). No new runtime dependencies.

**Storage**: Backend MongoDB via Mongoose (not touched by this feature). Frontend persists the JWT in `localStorage` via the existing `AuthContext` (unchanged).

**Testing**: No test framework is configured in the repo (no scripts, no test runner in `frontend/package.json` or `backend/package.json`). Validation is browser-based manual QA using the scenarios in `quickstart.md`.

**Target Platform**: Modern evergreen browsers on desktop, tablet, and mobile (responsive from 320 px to 1920 px wide).

**Project Type**: Web application — React SPA frontend (`frontend/`) + Express REST backend (`backend/`); this feature touches the frontend only.

**Performance Goals**: Home page static render is immediate; dynamic sections (Recent Designs) must reach a loaded/empty state in under 2 seconds (spec SC-006).

**Constraints**: No horizontal scrolling from 320 px to 1920 px (SC-003); zero protected API requests when the user is logged out (SC-005); Login/Register/JWT flows must pass unchanged (SC-007).

**Scale/Scope**: One Home page plus four placeholder pages, ~13 reusable components, one static content module, one CSS design-system extension.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is still an unfilled template — it defines no enforceable principles or gates. No violations; this feature complies with the reasonable defaults it implies (reuse existing architecture, keep components self-contained and simply structured, avoid scope creep). Re-checked after Phase 1: still compliant.

## Project Structure

### Documentation (this feature)

```text
specs/004-home-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── routing-auth.md  # Route map, auth gating, query-param handoff contract
│   ├── recent-designs-api.md  # Future protected designs endpoint contract
│   └── furniture-catalog-api.md  # Future public furniture catalog contract
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── pages/                          # NEW directory
    │   ├── Home.jsx                    # NEW — main page composing all sections
    │   ├── DesignMyRoom.jsx            # NEW — placeholder at /design, reads ?room=&style=
    │   ├── Furniture.jsx               # NEW — placeholder at /furniture
    │   ├── MyDesigns.jsx               # NEW — protected placeholder at /designs
    │   └── Profile.jsx                 # NEW — protected page at /profile (user info + logout)
    ├── components/
    │   ├── Navbar.jsx                  # NEW — auth-aware responsive navigation
    │   ├── Footer.jsx                  # NEW — branding, quick links, feature links, copyright
    │   ├── Hero.jsx                    # NEW
    │   ├── RoomCategories.jsx          # NEW
    │   ├── HowItWorks.jsx              # NEW
    │   ├── InteriorStyles.jsx          # NEW
    │   ├── BeforeAfter.jsx             # NEW
    │   ├── AiFeatures.jsx              # NEW
    │   ├── FurniturePreview.jsx        # NEW — static curated list
    │   ├── RecentDesigns.jsx           # NEW — auth-gated, loading/empty/error states
    │   ├── FinalCta.jsx                # NEW
    │   ├── ComingSoon.jsx              # NEW — shared placeholder-body component
    │   ├── Auth/                       # EXISTING
    │   │   ├── Register.jsx            # unchanged
    │   │   ├── Login.jsx               # unchanged
    │   │   ├── ProtectedRoute.jsx      # unchanged (reused for /designs, /profile)
    │   │   └── Dashboard.jsx           # MODIFY-retire — removed from routes; superseded by Home/Profile
    │   ├── OtpVerification.jsx         # unchanged
    │   └── Toast.jsx                   # unchanged
    ├── context/
    │   └── AuthContext.jsx             # MODIFY — post-login redirect /dashboard -> /
    ├── services/
    │   ├── api.js                      # MODIFY — attach stored JWT via request interceptor (analysis finding A1)
    │   └── designs.js                  # NEW — future designs API wrapper + availability flag
    ├── data/
    │   └── staticData.js               # NEW — room categories, styles, steps, AI features, furniture list
    ├── App.jsx                         # MODIFY — mount Home at /, placeholder routes, catch-all -> /
    ├── index.css                       # MODIFY — extend design tokens, sections, responsive rules
    └── main.jsx                        # unchanged

backend/                                # NOT modified in this feature
```

**Structure Decision**: Keep the existing single-folder frontend layout (React components under `src/components/`, auth under `src/components/Auth/`, API layer under `src/services/`). Introduce one new `src/pages/` directory for top-level routed views so Home and the placeholder destinations are distinct from reusable sections, and one new `src/data/` module for the static content that drives the presentation sections. No backend changes.

## Complexity Tracking

No Constitution Check violations; Complexity Tracking table intentionally omitted.