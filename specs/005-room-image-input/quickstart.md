# Quickstart: Room Image Input — Manual Validation Guide

**Feature**: specs/005-room-image-input | **Date**: 2026-09-15

Validation guide for the Room Image Input feature (the first step of the Design My Room workflow). This feature is frontend-only; no backend is required. Covers spec FR-001–FR-018 and the final-verification list, plus regressions.

## Prerequisites

- Node.js + npm installed.
- Dependencies installed: `cd frontend && npm install` (run once).
- Dev server: `cd frontend && npm run dev` → open `http://localhost:5173`.
- Camera checks require a secure context or `localhost` (given — we run on localhost) and a device camera (a phone works best for `facingMode: environment`).

## Scenario map

| Scenario | How to verify | Expected result |
|----------|---------------|-----------------|
| S1 Upload happy path | On `/design` click **Upload Room**, pick a `.jpg` (or `.png`/`.webp`) under 10 MB | File picker opens image-only; responsive, non-distorted preview appears with filename + size; **Continue** becomes enabled |
| S2 Invalid type rejected | Pick a `.pdf`, `.heic`, or `.gif` | Error **"Please select a valid image file."**, no preview, Continue stays disabled |
| S3 Oversized rejected | Pick an image > 10 MB | Error **"The image is too large. Please choose a smaller image."**; the 10 MB limit is visible in the UI before picking |
| S4 Change Image | With a previewed image click **Change Image** | Picker reopens; choosing a valid new file replaces the preview |
| S5 Remove Image | With a previewed image click **Remove Image** | Image cleared; screen returns to the two-option state; Continue disabled |
| S6 Continue → next step | With a ready image click **Continue** | Lands on `/design/next` "Style & Generate — coming soon"; the image is shown/retained there |
| S7 Back preserves image | From `/design/next`, go back to `/design` | The previously provided image is restored (no re-upload) |
| S8 Refresh survival | With a ready image, refresh the page in the same tab | The active image is restored (sessionStorage) |
| S9 New tab isolation | Open `/design` in a new tab | No image is shown there (tab-scoped persistence) |
| S10 Camera permission | Click **Capture Room**; allow the camera prompt | Live preview appears with Capture + Cancel controls; permission messaging shown while requesting |
| S11 Capture + Retake + Use | Tap **Capture Photo**, then **Retake**, then capture again and **Use This Photo** | Captured frame becomes the active image preview with the same Change/Remove/Continue behavior as an upload; camera stream stopped after Use |
| S12 Camera denied | **Capture Room**, then deny permission | **"Camera permission is required to capture a room photo."**; Upload Room still works |
| S13 No camera / error | Open on a device with no camera (or HTTPS-only context) and try Capture | Friendly availability message; Upload Room still works |
| S14 Stream cleanup | Start the camera, then (a) Cancel, (b) navigate away, (c) Use This Photo | In every path the camera light/indicator stops (tracks stopped); nothing runs in the background |
| S15 Headline + copy | View the step-1 screen | Heading "Let's Start With Your Room" and description "Upload a photo of your room or capture one using your camera." exactly |
| S16 Responsive | Resize to mobile (≤480 px), tablet (≤768 px), desktop; re-run S1/S10 | Layout stays usable, controls reachable with touch, preview never distorts or clips |
| S17 Params handoff | Open `/design?room=living-room&style=modern`, then Continue | Room/style context is shown and carried through to `/design/next` (no regression of FEAT-004 handoff) |
| Regression R1 Home | Load `/` | Home sections render as before (Hero, Room Categories, How It Works, Interior Styles, AI Features, Recent Designs, CTA, Footer) |
| Regression R2 Auth | Try `/login`, `/register`, logout/login cycle | Login/Register/JWT flows work unchanged; `/designs`/`/profile` protection unchanged |
| Regression R3 Other routes | `/furniture`, `/designs` (logged out → login), unknown URL | Unchanged behavior |

## Console cleanliness

Run scenarios S1–S17 with the browser console open: no new errors or warnings (camera permission prompts themselves may log informational notices in some browsers; treat those as acceptable). In particular S14 must not leave a `MediaStream`/`getUserMedia` warning.

## Build gate

`cd frontend && npm run build` must complete with no errors before shipping.

## References

- Data shapes & validation rules: `data-model.md`
- Route/auth/handoff rules: `contracts/routing-auth.md`
- Future upload contract: `contracts/room-image-upload-api.md`
- Design decisions (camera pipeline, storage, quota fallback): `research.md` R2–R3