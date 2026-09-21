# Data Model: Authentication-Aware Navigation Bar

**Feature**: 006-auth-aware-navbar | **Date**: 2026-09-15

## Scope

This feature introduces **no new persistent data and no new backend entities**. The Navbar is a pure function of the existing authentication session. This document captures the existing state consumed and the derived view presented.

## Single Source of Truth (Existing)

| Field | Type | Origin | Purpose |
|-------|------|--------|---------|
| `token` | `string \| null` | `AuthContext`; initialized synchronously from `localStorage.getItem('token')` | Identifies the authenticated session. `Boolean(token) === isLoggedIn`. |
| `user` | `object \| null` | `AuthContext`; resolved via `GET /auth/me` on mount when a token exists | Profile for the session (contains `name` for the account label). |
| `restoring` | `boolean` (NEW) | `AuthContext`; initialized `Boolean(stored token)` at mount; cleared when the initial `/auth/me` check finishes or no token exists | True while the post-refresh session restore is in flight. |
| `logout()` | `function` | `AuthContext` | Clears token + user and redirects to `/login` (existing). |

**Invariant**: No other component, provider, or local state stores authentication truth; the Navbar reads it via `useContext(AuthContext)` only.

## Derived View Model (Navbar)

Rendered purely from the above — no component-local auth state.

| View State | `token` | `restoring` | Public links | Authed links | Auth actions |
|-----------|---------|-------------|--------------|--------------|--------------|
| **logged-out** | null | false | Home, Design My Room, Furniture | none | Login, Register |
| **restoring** | present | true | Home, Design My Room, Furniture | My Designs, Profile | placeholder (no controls) |
| **logged-in** | present | false | Home, Design My Room, Furniture | My Designs, Profile | name label, Logout |

**Validation rules enforced by rendering:**
- Public links appear in every view state (Home `/`, Design My Room `/design`, Furniture `/furniture`).
- Authenticated links (My Designs `/designs`, Profile `/profile`) appear **if and only if** `Boolean(token) === true`, mirroring `ProtectedRoute`.
- Login/Register appear **if and only if** `Boolean(token) === false` and `restoring === false`.
- Logout appears **if and only if** `Boolean(token) === true`.

## State Transitions

```
[no token]                    ──login()──▶  [token set, user set]  ──window.location.href '/'──▶ logged-in navbar
                                        logout() ◀──────────────────────────────────────────────────┘
                                                      │ window.location.href '/login'
                                                      ▼
                                              logged-out navbar

[refresh, token present]  restoring=true ──/auth/me ok──▶ restoring=false, logged-in navbar (name shown)
                                       └──/auth/me fail──▶ restoring=false, token cleared, logged-out navbar
[refresh, no token]       restoring=false, logged-out navbar (immediate)
```

## OTP Registration (Unchanged)

`requestOtp` → `OtpVerification` (`verify-otp`) → redirect to `/login`. The user is **not** authenticated by this flow; the navbar remains in the logged-out view state until a successful `login()`. No data model changes.