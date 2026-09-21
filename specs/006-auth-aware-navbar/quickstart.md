# Quickstart: Authentication-Aware Navigation Bar

**Feature**: 006-auth-aware-navbar | **Date**: 2026-09-15

Prerequisites: Node + npm present (Vite project). Backend at `http://localhost:5001` needed only for the live acceptance cases. No test framework exists in this project; verification is build gate + SSR smoke + manual acceptance.

## S1 - Build Gate

```powershell
cd frontend
npm run build
```

**Expected**: Build completes; no errors.

## S2 - SSR Smoke (headless, no backend required)

The one-off smoke (esbuild-bundled entry, `renderToStaticMarkup`, fabricated `AuthContext.Provider` for Navbar view states; see `research.md` R9) was run during implementation and removed. To rerun, recreate it in `frontend\` from the technique described in R9 and run:

```powershell
node nav-smoke.mjs
```

**Expected**: All 8 scenarios print OK. Matrix: the Navbar's three view states (logged-out, logged-in with name+Logout, restoring) are rendered directly under a fabricated `AuthContext.Provider` for deterministic needle checks; full-App renders cover route regressions (Home logged-out, `/design`, `/designs` logged-out → protected redirect, `/designs` with token, `/login`).

Delete `note`: remove `frontend\nav-smoke.mjs` when done.

## S3 - Manual Acceptance (live backend required)

Start backend, then `cd frontend; npm run dev` and open `http://localhost:5173`.

| # | Case | Steps | Expected |
|---|------|-------|----------|
| S3 | Case 1 — logged-out Home | Open `/` with no logged-in session (clear token first if needed) | Navbar shows Home, Design My Room, Furniture, Login, Register. No My Designs, Profile, Logout. |
| S4 | Case 2 — login | Register-free: use an existing account (ask backend owner) → `/login` | After submit: lands on Home; Navbar shows Design My Room, Furniture, My Designs, Profile, `<name> ·` Logout. Login/Register absent everywhere (open mobile menu too). |
| S5 | Case 3 — refresh after login | While logged in, press F5 on Home | Navbar keeps authenticated set; no Login/Register flash during restore; name resolves after a moment. |
| S6 | Case 4 — logout | Click Logout | Redirect to `/login`; Navbar shows Home, Design My Room, Furniture, Login, Register; authenticated items gone. |
| S7 | Case 5 — register OTP flow | `/register` → request OTP → `/otp-verify` with the 6-digit code shown in the backend terminal → verify | Lands on `/login` (unchanged flow). User must then log in (Case 2). Navbar logged-out state throughout. |
| S8 | Case 6 — protected route logged out | Logged-out, enter `/designs` directly in the address bar | `ProtectedRoute` redirects to `/login`; no bypass; Navbar logged-out set. |
| S9 | Case 7 — loading (no flash) | While logged in, refresh Home and watch the Navbar | During restore the auth area shows a neutral placeholder — never Login/Register — then the authenticated set settles. |

## S10 - Mobile

| # | Case | Steps | Expected |
|---|------|-------|----------|
| S10 | Mobile menu | Narrow the browser (<768px), open the toggle logged-out and logged-in | Both states show exactly the desktop option sets; menu closes after picking a destination. |

## Regressions

| # | Check | Expected |
|---|-------|----------|
| R1 | Login / Register / OTP pages still function | No changes to auth pages or flows. |
| R2 | Home page sections render (Hero, Room Categories, How It Works, Interior Styles, AI Features, Recent Designs, Final CTA) | Unaffected. |
| R3 | Design My Room flow (`/design` → `/design/next`) and Furniture page reachable from Navbar | Links navigate correctly in both auth states. |
| R4 | Build gate | `npm run build` passes (S1). |

## Reference

- UI contract: `contracts/navbar-session-ui.md`
- View-state table: `data-model.md` (logged-out / restoring / logged-in)