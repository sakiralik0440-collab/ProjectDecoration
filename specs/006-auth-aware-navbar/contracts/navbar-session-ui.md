# Contract: Navbar Session UI

**Feature**: 006-auth-aware-navbar | **Date**: 2026-09-15

## 1. Purpose

Defines the observable contract between the application's session state and the shared Navigation Bar (`frontend/src/components/Navbar.jsx`). The Navbar is the single in-app surface that must truthfully mirror authentication state, on every viewport and every route.

## 2. Source of Truth

The contract binds exclusively to the existing auth provider (`frontend/src/context/AuthContext.jsx`, wired once in `main.jsx`). No other provider, local state, or store may feed the Navbar. `Boolean(token)` is the canonical authenticated predicate (identical to `ProtectedRoute`).

## 3. Rendered Option Sets

### 3.1 Logged Out — `Boolean(token) === false`

```
ProjectDecoration | Home | Design My Room | Furniture | Login | Register
```

MUST NOT render: My Designs, Profile, Logout.

### 3.2 Logged In — `Boolean(token) === true`

```
ProjectDecoration | Home | Design My Room | Furniture | My Designs | Profile | <name> · Logout
```

MUST NOT render: Login, Register.

### 3.3 Restoring — `Boolean(token) === true` while session restore is in flight

Rendered option set equals **3.2** for the nav links; the auth-actions area renders a neutral empty placeholder (no Login, no Register, no Logout). MUST NOT render Login or Register in this state (no flash).

## 4. Route Targets (Unchanged)

| Label | Target | Protection |
|-------|--------|-----------|
| Home | `/` | public |
| Design My Room | `/design` | public |
| Furniture | `/furniture` | public |
| My Designs | `/designs` | protected — `ProtectedRoute` |
| Profile | `/profile` | protected — `ProtectedRoute` |
| Login | `/login` | public |
| Register | `/register` | public |
| Logout | action → redirects to `/login` | existing flow |

## 5. Behavior Requirements

- **Reactivity**: The option set MUST update on the same render cycle as any change to `user`/`token`; no manual reload, no timers.
- **Refresh**: On page refresh, the option set MUST derive from the token restored from browser storage plus the existing profile re-fetch — never from component state that resets on reload.
- **Restore**: While `restoring === true` (only possible when a token is present), the auth-actions area MUST stay neutral; once the `/auth/me` result lands, the settled set renders (name appears on success; Login/Register appear only if the token was cleared).
- **Logout**: Clicking Logout MUST invoke `AuthContext.logout()`; the existing redirect applies and the navbar renders the logged-out set afterward.
- **Mobile**: The mobile navigation MUST present the identical option set, derived from the same single state, with the same hide/show rules.
- **Active state**: Nav links keep the existing active-link styling via `NavLink`; the brand, toggle, and menu close-on-select behaviors are unchanged.
- **Protected routes**: MUST NOT bypass or alter `ProtectedRoute` (`/designs`, `/profile`). Logged-out users never see these links and, if they navigate directly, still get redirected to `/login` exactly as today.

## 6. Out of Scope

- Any change to `AuthContext.login`, `logout`, `register`, `requestOtp`, or the JWT/API layer.
- Any change to `ProtectedRoute`, route definitions, or backend endpoints.
- Any new authentication or session system.
- Any changes to the auth pages themselves.