# Implementation Plan: Authentication-Aware Navigation Bar

**Branch**: `006-auth-aware-navbar` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-auth-aware-navbar/spec.md`

## Summary

Update the existing Navbar so it truthfully mirrors the existing authentication session. Logged-out users see Home, Design My Room, Furniture, Login, Register; logged-in users see Home, Design My Room, Furniture, My Designs, Profile, and Logout. The option set is a pure function of the existing `AuthContext` (`Boolean(token)` — the same predicate `ProtectedRoute` uses), reactively updates on session changes, survives refreshes via the existing token + `/auth/me` restoration, never flashes Login/Register during session restore (new minimal `restoring` flag on the existing AuthContext), and renders the identical set on mobile. Registration's OTP flow, login/logout redirects, ProtectedRoute, and all auth/JWT handling are untouched.

## Technical Context

**Language/Version**: React 18.2 (JS), Vite 5 (build), react-router-dom ^6.14, Node.js (dev tooling)

**Primary Dependencies**: react, react-router-dom (NavLink/Link), `AuthContext` (existing), axios-backed `api` (existing)

**Storage**: `localStorage` key `token` (existing, read synchronously by AuthContext at mount); no new storage

**Testing**: No test framework in repo. Established project standard: `npm run build` gate + SSR smoke (`renderToStaticMarkup` needle checks w/ storage shims) + manual acceptance per `quickstart.md`

**Target Platform**: Modern browsers (desktop + mobile, incl. touch)

**Project Type**: Web application (frontend only for this feature; backend untouched)

**Performance Goals**: Navbar updates within the same render cycle as auth-state changes; no timers, no polling

**Constraints**: Do not modify `AuthContext` login/logout/register/requestOtp or JWT/API handling; do not touch Login/Register/OtpVerification pages or `ProtectedRoute`; no duplicate auth state/system; no backend changes

**Scale/Scope**: Shared Navbar component + one flag on the existing auth provider + one small placeholder style (3 files, ~80 lines changed)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project's constitution file (`.specify/memory/constitution.md`) is an unfilled template — it defines no enforceable principles or gates. There are no constitution violations to justify.

Check passed (pre-research and post-design). No complexity table required.

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-aware-navbar/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── navbar-session-ui.md   # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── components/
    │   └── Navbar.jsx          # ONE existing component — restructure link/auth rendering (no new component)
    ├── context/
    │   └── AuthContext.jsx     # Add minimal `restoring` flag to the EXISTING provider only
    └── ...                     # untouched: routes, pages, services, ProtectedRoute, auth pages
```

**Structure Decision**: Single web application. The change is confined to the existing Navbar component, the existing auth context (one `restoring` flag), and one placeholder style in `index.css`. No new directories, no new files in `src/`; all design-system classes and routing already exist.

## Complexity Tracking

Not required — no constitution violations (see Constitution Check). Zero new dependencies, no new services, no new backend surface.