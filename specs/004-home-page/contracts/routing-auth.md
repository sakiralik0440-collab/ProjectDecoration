# Routing & Authorization Contract: Home Page

**Feature**: [spec.md](../../../specs/004-home-page/spec.md) | **Date**: 2026-09-15

Maps every route the Home Page touches, its visibility, and the data handoff contract.

## Route Map

| Route | Page | Visibility | Notes |
|-------|------|------------|-------|
| `/` | `pages/Home.jsx` | Public | Mounts the full Home Page; also the catch-all fallback (replaces the old `/register` redirect). |
| `/register` | `components/Auth/Register.jsx` | Public | Unchanged. |
| `/otp-verify` | `components/OtpVerification.jsx` | Public | Unchanged. |
| `/login` | `components/Auth/Login.jsx` | Public | Unchanged; after login the user returns to `/` (see AuthContext). |
| `/design` | `pages/DesignMyRoom.jsx` | Public | Placeholder for the future design workflow. Reads `?room=` and/or `?style=`. |
| `/furniture` | `pages/Furniture.jsx` | Public | Placeholder for the future furniture catalog. |
| `/designs` | `pages/MyDesigns.jsx` | Protected | Future "My Designs" page; wrapped with `ProtectedRoute` now so unauthorized users are sent to `/login`. |
| `/profile` | `pages/Profile.jsx` | Protected | Shows the current user's name/email + logout (supersedes the retired `/dashboard`). |
| `*` | → `/` (navigate) | Public | Any unknown URL renders the Home Page (no more `/register` fall-through). |

> `/dashboard` is removed. `components/Auth/Dashboard.jsx` is no longer routed.

## Design-Workflow Handoff (FR-019, FR-020)

- Link format: `/design?room=<roomCategoryId>&style=<interiorStyleId>` — both params optional, independent.
- `DesignMyRoom.jsx` (placeholder) MUST read `useSearchParams()` and display the selected room/style; the future workflow uses the same contract.
- When a design action starts from Hero / Room Categories / Interior Styles / Before-After / Final CTA, the value is appended before navigation.
- Logged-out user triggering a design-bearing action: the page is public, so no login gate is imposed by the Home Page; if a future step requires auth, the flow routes through `/login` and back to the same `/design?room=&style=` URL (query params survive the redirect; `location.state` would not).

## Auth-Gating Rules (FR-011, SC-005)

- `Navbar` renders Login/Register when `AuthContext.token` is absent; Logout + Profile link when present.
- `RecentDesigns` issues a data request **only** when `AuthContext.token` exists **and** the designs API is enabled (see `contracts/recent-designs-api.md`). Logged-out visitors always receive the login/promotional prompt with zero network calls.
- `/designs` and `/profile` are wrapped in the existing `ProtectedRoute` (redirects to `/login` without a token).

## Components Consuming This Contract

- `pages/Home.jsx` — owns section composition and passes handlers into sections.
- `components/RoomCategories.jsx`, `components/InteriorStyles.jsx`, `components/Hero.jsx`, `components/BeforeAfter.jsx`, `components/FinalCta.jsx` — navigate to `/design?...`.
- `components/FurniturePreview.jsx` — navigates to `/furniture`.
- `components/Navbar.jsx`, `components/RecentDesigns.jsx` — read `AuthContext`.