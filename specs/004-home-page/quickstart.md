# Quickstart: Home Page Validation Guide

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-15

Manual, browser-based validation for the Home Page feature. There is no automated test runner in this repo; every scenario maps to a spec acceptance scenario or success criterion.

## Prerequisites

- Node/npm installed.
- Backend running (for login/register/logout scenarios): from `backend/` run `npm install` once, then `npm run dev` (server on `http://localhost:5001`).
- Frontend running: from `frontend/` run `npm install` once, then `npm run dev` (Vite default port, e.g., `http://localhost:5173`).

## Scenario 1 — Public Home Page renders (P1 story, SC-001/SC-003)

1. Open the app root `/` **logged out**.
2. Verify all sections appear: Navbar, Hero ("Transform Your Room with AI"), Room Categories (Living Room, Bedroom, Kitchen, Office), How It Works (Upload Room / Choose Style / Generate with AI / Save & Download), Interior Styles (Modern, Classic, Luxury, Minimal, Rustic), Before/After, AI Features (6 items), Furniture Preview, Final CTA ("Ready to Redesign Your Room?"), Footer (branding, quick links, feature links, copyright).
3. Resize from 320 px to 1920 px — no horizontal scrolling, no overlapping content (SC-003).
4. On a narrow viewport, the navbar collapses into a hamburger menu; all links remain reachable.

## Scenario 2 — Auth-aware navbar (P1 story, FR-001/FR-002)

1. Logged out: verify Login/Register actions are shown; click each — routes open the existing auth pages unchanged.
2. Log in (existing `/login` flow) — you land back on `/` (post-login redirect change).
3. Logged in: verify Logout + Profile appear; click Logout — token cleared and `/login` shown.

## Scenario 3 — Every link resolves (P2 story, SC-004, FR-021)

1. Click each navbar link: Home (`/`), Design My Room (`/design`), Furniture (`/furniture`), My Designs (`/designs`), Profile (`/profile`).
2. `/designs` and `/profile` **logged out** must redirect to `/login` (ProtectedRoute). After login you should reach the intended page.
3. Click every CTA / card: Hero primary "Design My Room", "Explore Furniture", each of the 4 room categories, each of the 5 interior styles, "Try It Yourself", "Start Designing", "View All Furniture". All must resolve — no link falls through to a catch-all redirect (FR-021).

## Scenario 4 — Design handoff params (FR-020, FR-019)

1. Click "Living Room" card → expect `/design?room=living-room` and the placeholder page shows "Living Room".
2. Click "Modern" style card → expect `/design?style=modern`, page shows "Modern".
3. Older browsers / hard refresh of `/design?room=bedroom&style=minimal` still shows both selections (query params survive).

## Scenario 5 — Recent Designs states (P3 story, FR-010/FR-011, SC-005)

1. Logged out: "My Recent Designs" shows a login/promotional prompt. Network tab shows **zero** `designs` requests during the visit (SC-005).
2. Logged in, API disabled (default): shows the empty state with a "Start Designing" CTA; still zero designs requests.
3. Logged in, `DESIGNS_API_AVAILABLE = true` (temporary toggle in `src/services/designs.js`): verify loading spinner, then data grid (if account has designs), empty state (if none), or error + retry (if endpoint returns a failure).

## Scenario 6 — Furniture preview (FR-009)

1. Logged in or out: Furniture Preview shows the curated static list with category + price + description.
2. "View All Furniture" → `/furniture` placeholder renders.

## Scenario 7 — Regression guard (SC-007)

1. Register → OTP → verify → login still works end-to-end exactly as before.
2. Protected `GET /api/auth/me` still returns the profile with a valid token.
3. Logout still clears the token and redirects to `/login`.

## Expected Outcomes

All labels, links, and state transitions above must match. Any link that 404s, any section that errors when logged out, or any regression in auth flows fails the associated scenario — file as a bug before `/speckit-implement` is considered complete.

## References

- Routing & auth: `contracts/routing-auth.md`
- Recent Designs contract: `contracts/recent-designs-api.md`
- Furniture contract: `contracts/furniture-catalog-api.md`
- Data shapes: `../../data-model.md` (via `data-model.md` in this directory)
- Acceptance scenarios: `spec.md`