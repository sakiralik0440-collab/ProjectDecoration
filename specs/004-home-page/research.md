# Research: Home Page

**Feature**: [spec.md](./spec.md) | **Date**: 2026-09-15

Findings were produced by direct inspection of the `frontend/` and `backend/` trees; no speculative external research was required.

## Resolved Decisions

### D1. Routing & landing flow

- **Decision**: Mount Home at `/`; make it the catch-all destination; retire the `/dashboard` route; keep `/register`, `/login`, `/otp-verify` unchanged.
- **Rationale**: Matches the clarification Q1 (root Home for everyone, Home is post-login landing). `App.jsx` currently redirects `/` and `*` to `/register`; the Home page is public, so `/` can render it directly and `*` falls back to it.
- **Alternatives considered**: Home only at `/home` with `/` still forcing `/register` (rejected — contradicts "public landing"); reusing `/dashboard` as Home (rejected — misleading path semantics, contradicts clarification to retire it).

### D2. Post-login redirect

- **Decision**: Change `AuthContext.login` final redirect from `/dashboard` to `/`.
- **Rationale**: The login flow hard-codes `window.location.href = '/dashboard'` (AuthContext.jsx:101). With Home at `/`, login should land there.
- **Alternatives considered**: Leaving `/dashboard` as the landing (rejected — placeda dashboard route is retired and violated the clarified flow).

### D3. Recent Designs data source

- **Decision**: Frontend-only first release. Add `services/designs.js` with a documented API contract (`GET /api/designs` in `contracts/recent-designs-api.md`) and an `apiAvailable` flag (default `false`). When the flag is false, the section renders the empty state without any network call. When the flag is enabled, the component fetches authenticated data with loading/error/empty states. Never fetch without a token.
- **Rationale**: Backend exposes only `/api/auth/*` (confirmed via `backend/src/routes/authRoutes.js` and `server.js`). Clarification Q2 explicitly deferred backend work. The flag prevents recurring 404 noise on every authenticated visit while keeping the wiring ready.
- **Alternatives considered**: Calling the endpoint and treating 404 as empty (rejected — noisy failures and confusing network logs); local mock designs in storage (rejected — fake data is misleading and contradicts Q2).

### D4. Furniture Preview data source

- **Decision**: Curated static list in `data/staticData.js` (`FurnitureItem` entries with name, category, price, short description), rendered by `FurniturePreview.jsx`. Documented future endpoint `GET /api/furniture` in `contracts/furniture-catalog-api.md`.
- **Rationale**: Clarification Q3 (static frontend list). No furniture backend exists. Static data guarantees the section always renders on first release.
- **Alternatives considered**: New backend endpoint (rejected — out of scope); category tiles only (rejected — spec FR-009 requires popular furniture items).

### D5. Non-existent destination pages

- **Decision**: Create placeholder pages at the intended future routes (`/design`, `/furniture`, `/designs`) using a shared `ComingSoon.jsx` body, wrapped in `ProtectedRoute` where the real page will be private (`/designs`). `/profile` is a real lightweight page (user name/email + logout) replacing the retired dashboard's purpose.
- **Rationale**: Clarification Q4 (route to future paths with placeholder pages) prevents catch-all fall-through to `/` and keeps SC-004 (all links resolve) satisfiable.
- **Alternatives considered**: Pointing links at Home until pages exist (rejected — misleading, fails P2 story's routing tests); omitting missing links (rejected — spec fixes nav contents).

### D6. Room/style handoff into the design workflow

- **Decision**: Navigation to `/design` carries `?room=<roomId>&style=<styleId>` query parameters. `DesignMyRoom.jsx` (placeholder) reads and displays them; the future workflow consumes the same query params.
- **Rationale**: Query params are shareable, deep-linkable, and survive a redirect through login without extra state storage; satisfies FR-019/FR-020 (return to intended flow after login) and FR-006/FR-003 preselection.
- **Alternatives considered**: React Router `location.state` (rejected — lost on hard refresh / login redirect).

### D7. Component architecture

- **Decision**: One page component (`Home.jsx`) composes ~13 section components (`Navbar`, `Hero`, `RoomCategories`, `HowItWorks`, `InteriorStyles`, `BeforeAfter`, `AiFeatures`, `FurniturePreview`, `RecentDesigns`, `FinalCta`, `Footer`, plus `ComingSoon`). All pure-presentation sections read from `data/staticData.js`; only `Navbar` and `RecentDesigns` consume `AuthContext`.
- **Rationale**: Mirrors spec FR-017 (reuse/small reusable components), keeps each section independently styleable and replaceable, matches the existing flat `components/` convention.
- **Alternatives considered**: One giant `Home.jsx` (rejected — violates reuse, hard to test); grouped feature folders (rejected — inconsistent with existing flat layout).

### D8. State management

- **Decision**: Reuse `AuthContext` for auth state (user/token/loading/logout). No new global state. Section-local state via `useState`/`useEffect`; `useNavigate`, `Link`, `useSearchParams` from react-router-dom for navigation and the design handoff.
- **Rationale**: The only stateful data is auth-derived; React Router + AuthContext fully cover it.
- **Alternatives considered**: New context for designs (rejected — no live data yet); Redux/Zustand (rejected — no need, no existing precedent).

### D9. Responsive & styling approach

- **Decision**: Extend the single existing `index.css` (no CSS framework installed; keep the glass-morphism theme, Inter font, `#4a90e2` primary). Add CSS custom properties (tokens), CSS Grid/Flexbox section layouts, a max-width container, responsive breakpoints at 1024 px / 768 px / 480 px, and a mobile hamburger menu in `Navbar`. No JS layout libraries.
- **Rationale**: Reuses the existing design system (SC via FR-017) and existing single-file CSS pattern; plain CSS avoids new dependencies.
- **Alternatives considered**: Tailwind/UI kit (rejected — new dependency, no precedent); CSS modules per component (rejected — existing file is a single sheet).

### D10. Imagery / visuals

- **Decision**: No binary image assets exist in the repo. Use CSS gradient-based placeholder visuals (deterministic, theme-colored) for hero, before/after, furniture items, and design thumbs. `<img>` tags with remote URLs are not used.
- **Rationale**: Keeps the app offline-capable, avoids broken-image states (SC-006), and requires no asset pipeline changes.
- **Alternatives considered**: Remote stock-photo URLs (rejected — external dependency, flaky, could break layout); generated assets committed to repo (rejected — binary churn in a code-only repo).

### D11. Loading / error / empty states

- **Decision**: Static sections need no state. `RecentDesigns` exposes four states:
  1. unauthenticated → login/promotional prompt (never calls the API),
  2. authenticated + API disabled → empty state with "Start Designing" CTA (no network call),
  3. authenticated + API enabled → spinner → data grid, or empty state, or error state with retry.
- **Rationale**: Satisfies FR-011, FR-014, SC-005, SC-006 and the edge cases for failure/empty sessions.
- **Alternatives considered**: Single unconditional fetch (rejected — violates zero-protected-request rule); error-only fallback (rejected — fails empty-state requirement).

### D12. Testing strategy

- **Decision**: No test runner exists in the repo; do not introduce one in this feature. Validation = manual browser QA against the scenarios in `quickstart.md` and the spec's acceptance scenarios.
- **Rationale**: Adding a test harness would expand scope and risk breaking the untouched auth/build workflow; verification criteria are behavioral and can be checked manually.
- **Alternatives considered**: Adding Vitest + Testing Library (deferred — worth a separate infrastructure feature); backend contract tests (N/A — no backend changes).