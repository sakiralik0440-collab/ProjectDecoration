# Research Notes: Authentication-Aware Navigation Bar

**Feature**: 006-auth-aware-navbar | **Date**: 2026-09-15

## R1 - Single Source of Truth for Auth State

- **Decision**: The Navbar consumes the existing `AuthContext` (`user`, `token`, `logout`) via `useContext` and derives everything from it. `isLoggedIn = Boolean(token)` — the exact rule already used by `ProtectedRoute`.
- **Rationale**: The spec forbids a duplicate authentication system and duplicate auth state. `ProtectedRoute.jsx` already keys on `token` present, so the Navbar must use the identical predicate to stay consistent with route protection.
- **Alternatives considered**: A local `isLoggedIn` state in Navbar seeded from localStorage (rejected — duplicates state, drifts from AuthContext); a second context (rejected — duplicate system).

## R2 - Auth-Dependent Option Sets

- **Decision**: Two derived option sets rendered from the single auth state:
  - **Always public**: Home (`/`), Design My Room (`/design`), Furniture (`/furniture`).
  - **Authenticated only**: My Designs (`/designs`), Profile (`/profile`).
  - **Auth actions**: logged-out → Login (`/login`) + Register (`/register`); logged-in → account-name label + Logout button; while restoring → a neutral placeholder with no auth controls.
- **Rationale**: Matches the spec's two required nav bars exactly. `/designs` and `/profile` are both `ProtectedRoute`-protected in `App.jsx`, and the spec mandates not advertising protected areas to logged-out users.
- **Alternatives considered**: Keep My Designs always visible (rejected — spec forbids advertising protected routes when logged out); keep Profile only in the auth cluster (rejected — spec lists Profile as a nav link in the logged-in set).

## R3 - Existing AuthContext Has No "Session Restoring" State

- **Decision**: Add one minimal `restoring` boolean to the **existing** `AuthContext` (per spec FR-010, which explicitly permits extending the existing context). Semantics:
  - Initialized **synchronously** to `Boolean(stored token)` at provider mount (same localStorage read the token state already performs), so a logged-out user starts with `restoring = false` and never sees a placeholder.
  - Set to `false` when the initial `/auth/me` profile fetch resolves (success or failure) or when no token exists.
  - The existing op-level `loading` flag (register/login/requestOtp in flight) is left untouched — it is unrelated to session restore.
- **Rationale**: Prevents any Login/Register "flash" to a logged-in user during the post-refresh profile fetch, and prevents a wrong "Account" label before the profile resolves. Browser behavior: token is already present synchronously from localStorage, so a logged-in user's Navbar renders authenticated links immediately; the placeholder only occupies the auth-actions area until the profile arrives.
- **Alternatives considered**: Reuse `loading` (rejected — it means an auth operation is running, not that the session is being restored); add a separate system (rejected by spec).

## R4 - Registration/OTP Flow Preserved

- **Decision**: Zero changes to the register flow. Existing flow: `requestOtp` (POST `/auth/register/request-otp`) → `OtpVerification` (POST `/auth/register/verify-otp`) → `navigate('/login')`. The user signs in manually afterward — no auto-login introduced.
- **Rationale**: Spec FR-007 explicitly requires preserving the existing flow including the OTP step.
- **Alternatives considered**: Auto-login after OTP (rejected — prohibited by spec; would change registration behavior).

## R5 - Login/Logout Navigation Kept As-Is

- **Decision**: Keep the existing `AuthContext.login` (store token, set state, `window.location.href = '/'`) and `AuthContext.logout` (remove token, clear state, `window.location.href = '/login'`).
- **Rationale**: These are the existing mechanisms and satisfy "navigate to Home" / "redirect according to existing flow". The Navbar re-renders from the restored state on the destination page with no manual reload needed.
- **Alternatives considered**: Convert to `useNavigate` SPA navigation (rejected — the spec forbids modifying Login/Register/Logout behavior).

## R6 - Reuse Existing Navbar Component & Markup

- **Decision**: Evolve the single existing `Navbar.jsx` (brand, `.navbar-menu` with `ul.navbar-links` + `.navbar-auth`) rather than creating a new component. The mobile full-screen overlay renders the same DOM, so the mobile menu automatically shows identical auth-dependent options.
- **Rationale**: Spec FR-011 + "Use the existing Navbar component if one already exists; do not create a duplicate." Keep the `open` toggle and auto-close-on-select behavior.
- **Alternatives considered**: A separate mobile nav (rejected — duplication; the existing overlay already reuses the link markup).

## R7 - Link Presentation

- **Decision**: `NavLink` with the existing `linkClass` active styling for all nav links (Home, Design My Room, Furniture, and — when logged in — My Designs, Profile). Login/Register stay `Link` buttons (`btn btn-ghost` / `btn btn-primary`). Logout stays a `button` (`btn btn-ghost`). Remove the duplicated Profile entry currently in `.navbar-auth` (Profile appears once, in the links list, logged-in only); the auth cluster keeps a name label + Logout.
- **Rationale**: Preserves existing visual conventions and the requested option set exactly once each.
- **Alternatives considered**: Keep Profile duplicated (rejected — redundant).

## R8 - CSS Impact

- **Decision**: One small placeholder style was added to keep the auth-actions region from collapsing while the session is being restored: `.navbar-restoring` (fixed `6.5rem × 2.75rem`, rounded, with a subtle `navbar-shimmer` animation) in `frontend/src/index.css`. Everything else reuses the existing navbar/button classes.
- **Rationale**: An empty (zero-size) placeholder causes a layout shift the moment the restore settles and the real controls appear; a fixed-size neutral placeholder matches the logged-in control dimensions so the row holds its height. This is the only CSS change and is required by the restoring view state (FR-010).
- **Alternatives considered**: No CSS at all (rejected — layout jump); a full spinner (rejected — heavier than needed).

## R9 - Verification Strategy

- **Decision**: Three gates, mirroring the project's established 005 workflow:
  1. `npm run build` must pass.
  2. SSR smoke matrix (8 scenarios) replicating the 005 `room-smoke.mjs` technique (esbuild-bundled entry, `renderToStaticMarkup`, localStorage + sessionStorage shims). Because the Navbar is rendered only by `Home` and shared components (`Footer`, `RecentDesigns`) also contain auth-related link text, the Navbar render contract is verified **deterministically by rendering the Navbar directly under a fabricated `AuthContext.Provider`** for the three view states (logged-out / logged-in / restoring), while full-App renders serve as coarse route regressions (Home logged-out, `/design`, `/designs` logged-out protected-redirect, `/designs` with token, `/login`).
  3. Manual acceptance per `quickstart.md` (the 7 cases) against the live backend — browser-only behaviors (restore settling, login/logout clicks) covered there.
- **Note on SSR**: the `restoring` flag uses the `typeof window` guard, so in SSR it is always `false` (browser-only behavior); the smoke therefore exercises restoring via the fabricated-provider render, and the real restore path is validated in-browser per `quickstart.md` S5/S9.
- **Alternatives considered**: Unit-test framework (rejected — the project has none; QS + smoke is the established standard here).