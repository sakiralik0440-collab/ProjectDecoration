# Routing & Auth Contract: Room Image Input

**Feature**: specs/005-room-image-input | **Date**: 2026-09-15

## Route map

| Route | Page | Access | Notes |
|-------|------|--------|-------|
| `/design` | Room Image Input (step 1) | Public (unchanged) | Replaces the ComingSoon placeholder content from FEAT-004. Reads and preserves `?room=` / `?style=` query params. |
| `/design/next` | "Style & Generate — coming soon" stub | Public | New. Receives the active image via `DesignContext`; shows the retained image + ComingSoon-style message. Future home of the AI style/generation step. |

All other routes (`/`, `/register`, `/login`, `/otp-verify`, `/furniture`, `/designs`, `/profile`, catch-all → `/`) are **unchanged** by this feature.

## Authentication

- `/design` is public today and stays public; this feature introduces **no new auth requirement** and touches no `ProtectedRoute` usage (FR-016).
- The design-flow image itself is session-scoped client data; it is never tied to the logged-in user until the future upload API ships (then the existing Bearer-JWT axios interceptor authenticates the multipart upload).

## Navigation and image handoff

- Entry points that target `/design` (Home hero "Design My Room", section CTAs with optional `?room=`/`?style=`) keep working unchanged.
- "Continue" (enabled only when an image is `ready`) navigates to `/design/next` preserving the current `?room=`/`?style=` params and the active image from `DesignContext`.
- "Change"/"Remove" never navigate; they mutate the session image in place.
- Back-navigation from `/design/next` to `/design` restores the previously provided image (session preserved) — no re-upload.

## Lifecycle of session data

- Writes: on select/capture/remove.
- Read/hydration: on `DesignProvider` mount from `sessionStorage` (`designSession`); a cleared entry results in a fresh `null` image.
- Cleanup: automatic — `sessionStorage` is scoped to the tab (cleared on close); camera `MediaStream` tracks are stopped per FR-011 (mirrors the cleanup rules in `data-model.md`).