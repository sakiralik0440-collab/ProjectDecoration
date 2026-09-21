# Feature Specification: Room Image Input

**Feature Branch**: `005-room-image-input`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "Create a Room Image Input feature for ProjectDecoration that allows users to provide a room image via Upload Room Image or Capture Room Image using the device camera, as the first step of the existing Design My Room workflow."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload a Room Image (Priority: P1)

A user visits the Design My Room workflow and wants to supply a photo of the room they want redesigned. They tap "Upload Room", a file picker opens restricted to images, they choose a JPG/PNG/WEBP photo, and immediately see a responsive preview with the filename and size. If they pick the wrong file, they can Change Image or Remove Image. Once satisfied they press Continue and the photo stays with the workflow as it moves to the next step.

**Why this priority**: Upload is the primary path on desktop and laptop devices, works on every device class, and unblocks every downstream design step. It is the minimal viable slice of the feature.

**Independent Test**: Can be fully tested by opening Design My Room, uploading one photo, and confirming the preview, validation messages, removal, and Continue all work without a camera.

**Acceptance Scenarios**:

1. **Given** a user on the room input step, **When** they click "Upload Room" and pick a valid JPG/PNG/WEBP under 10 MB, **Then** a non-distorted responsive preview appears along with the filename and size.
2. **Given** a user who picked an invalid file type (e.g. PDF or HEIC), **When** they try to use it, **Then** they see "Please select a valid image file." and no preview is set.
3. **Given** a user who picked an image over 10 MB, **When** they try to use it, **Then** they see "The image is too large. Please choose a smaller image."
4. **Given** an image already previewed, **When** the user clicks "Change Image", **Then** the picker reopens and a new valid image replaces the old one.
5. **Given** an image already previewed, **When** the user clicks "Remove Image", **Then** the image is cleared and the flow returns to the two-option state.
6. **Given** a valid image ready, **When** the user clicks "Continue", **Then** the image remains available as the workflow advances to the next step.

---

### User Story 2 - Capture a Room Image with the Camera (Priority: P2)

On a phone or laptop with a camera, a user chooses "Capture Room". The app asks for camera permission, shows a live camera preview, and the user can Capture Photo, Retake, or Cancel. After a capture they tap "Use This Photo" and the result appears as the same preview used for uploads. Granting or denying permission is handled gracefully and the camera never keeps running after the user is done.

**Why this priority**: Capture is essential on mobile where uploading photos is still possible but photographing the room is the app's core AI promise. It is a distinct, independently testable flow but is secondary to upload for desktop users.

**Independent Test**: Can be fully tested on any device with a camera by granting permission, capturing, retaking, using the photo, and confirming the stream stops in every exit path.

**Acceptance Scenarios**:

1. **Given** a user on the room input step, **When** they click "Capture Room" (permission already granted), **Then** a live camera preview is shown with Capture and Cancel controls.
2. **Given** the camera is live, **When** the user taps "Capture Photo", **Then** the current frame is captured and Retake / Use This Photo controls appear.
3. **Given** a captured frame, **When** the user taps "Retake", **Then** the live preview resumes and a fresh capture can be taken.
4. **Given** a captured frame, **When** the user taps "Use This Photo", **Then** the photo becomes the active image preview with the same options as an uploaded image.
5. **Given** the user denies camera permission, **When** capture is attempted, **Then** they see "Camera permission is required to capture a room photo." and both upload and retry-camera options remain.
6. **Given** no camera hardware or a failing camera, **When** capture is attempted, **Then** a friendly availability message is shown and upload remains available.
7. **Given** the camera is active, **When** the user cancels, navigates away, the component unmounts, or uses the photo, **Then** the camera stream is fully stopped with nothing left running in the background.

---

### User Story 3 - Image Persists Across Workflow Steps (Priority: P3)

After an image is uploaded or captured, the user moves to the next step of the Design My Room workflow. The photo they provided is still present — they do not have to re-upload or re-capture.

**Why this priority**: Continuity is a quality requirement of the whole flow, but it cannot be meaningfully demonstrated on its own until at least one downstream step exists. It is the glue that makes Continue trustworthy.

**Independent Test**: Can be demonstrated in the same session by reaching the next step and confirming the image is still available without re-selection.

**Acceptance Scenarios**:

1. **Given** a valid image ready, **When** the user advances to the next step, **Then** the active image is still available for that step in the same session.
2. **Given** the user goes back from the next step to the input step, **When** the input screen returns, **Then** it restores the previously provided image instead of starting empty.
3. **Given** a valid image ready, **When** the user refreshes the page in the same tab, **Then** the active image is restored rather than lost.

---

### Edge Cases

- What happens when the user cancels the file picker without choosing? → The current state is unchanged and no error is shown.
- How are non-image files like PDF, GIF, or HEIC handled? → Rejected with "Please select a valid image file."; HEIC is explicitly not in the supported set.
- What is the hard file-size boundary and is it visible? → 10 MB; shown in the UI before the user picks a file.
- What happens with a corrupted or unreadable image file? → Treated as an invalid image with a clear error, never a broken preview.
- What happens if the camera button is unavailable on a device with no camera? → A friendly message explains capture is unavailable and upload stays usable.
- What happens if camera permission is permanently denied at the browser level? → The user is told permission is required and how to reconsider, with upload as the fallback.
- What happens if the user navigates to another page mid-capture? → The camera stream is stopped immediately.
- What happens if the user refreshes the page mid-flow? → The active image is restored from the browser tab session and the workflow resumes where it left off.
- What happens on a very small phone screen? → Preview and controls remain usable and unclipped ("Continue" remains reachable).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The room input screen MUST show the heading "Let's Start With Your Room", the description "Upload a photo of your room or capture one using your camera.", and exactly two primary actions: "Upload Room" and "Capture Room".
- **FR-002**: "Upload Room" MUST open the device's native file picker, restricted to image files, and MUST accept only JPG/JPEG, PNG, and WEBP.
- **FR-003**: The system MUST accept one room image at a time; choosing a new image replaces the existing one.
- **FR-004**: The system MUST reject unsupported file types with the message "Please select a valid image file." and no preview.
- **FR-005**: The system MUST reject images larger than 10 MB with the message "The image is too large. Please choose a smaller image.", and MUST display the 10 MB limit in the UI before selection.
- **FR-006**: For any accepted image, the system MUST show a responsive preview that does not stretch or distort, plus the filename where available and the file size where available.
- **FR-007**: The system MUST provide "Change Image" (reopen the picker and replace) and "Remove Image" (clear the image and return to the two-option state).
- **FR-008**: "Capture Room" MUST request camera permission and, once granted, display a live camera preview with "Capture Photo", "Cancel", and after capture "Retake" and "Use This Photo".
- **FR-009**: When permission is denied, the system MUST show "Camera permission is required to capture a room photo." and keep the upload path available.
- **FR-010**: When no camera is available or the camera errors, the system MUST show a clear availability message and keep the upload path available.
- **FR-011**: The camera stream MUST be stopped when the user cancels, navigates away, the component unmounts, or a photo has been captured and is no longer needed; no active camera may remain in the background.
- **FR-012**: A captured photo MUST produce the same preview, Change/Retake, Remove, and Continue behavior as an uploaded photo.
- **FR-013**: The system MUST provide a "Continue" control that is only enabled when a valid image is available, and MUST advance the user to the next Design My Room step, carrying the active image with it.
- **FR-014**: The active image MUST remain available across navigation between Design My Room steps and MUST survive a full page refresh within the same browser tab, so the user never re-provides it once provided.
- **FR-015**: The room input step MUST work on desktop, laptop, tablet, and mobile, with camera controls easy to reach on touch devices.
- **FR-016**: The feature MUST preserve the existing access behavior of the Design My Room workflow: it introduces no new login requirement and no change to the existing authentication system.
- **FR-017**: Since the project has no image upload/storage service, the feature MUST keep the prepared image ready for a future upload step without creating unneeded backend functionality. [See Assumptions]

- **FR-018**: After "Continue", the system MUST take the user to the next step of the Design My Room workflow, implemented as a ComingSoon-style "Style & Generate — coming soon" page that receives and retains the active image for the future AI style/generation step.

### Key Entities *(include if feature involves data)*

- **Room Image**: The single active photo provided by the user (uploaded file or camera capture). Carries format/type, size, filename (where available), a preview representation, and a reference suitable for handoff to later Design My Room steps (style selection, AI generation) and a future upload API.
- **Room Image Session**: The working copy of the Room Image that survives navigation between the input step and downstream steps (and a refresh within the same tab) without requiring the user to re-provide it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can go from opening the Design My Room workflow to a valid image ready for Continue in under 1 minute on the upload path.
- **SC-002**: 100% of attempted invalid file types (non-JPG/PNG/WEBP) are rejected with the "Please select a valid image file." message.
- **SC-003**: 100% of files over 10 MB are rejected with the "The image is too large. Please choose a smaller image." message.
- **SC-004**: 100% of accepted images display a responsive, non-distorted preview before Continue is available.
- **SC-005**: The camera stream is stopped in 100% of exit paths (Cancel, navigate away, unmount, photo used) with no camera left active in the background.
- **SC-006**: On a supported device with permission granted, a user can capture, retake, and use a photo without a page reload or an error.
- **SC-007**: 100% of Continue actions preserve the active image for the next step within the same session.
- **SC-008**: No regressions: Home Page, Login, Register, JWT authentication, and the existing Design My Room entry all continue to work after this feature is added.

## Assumptions

- **No backend upload service exists.** Inspection confirmed the project backend exposes auth endpoints only; therefore this feature is frontend-only and prepares the image data for a future upload step rather than introducing backend functionality now.
- **Image size limit**: 10 MB, displayed to the user before selection.
- **Access behavior preserved**: the Design My Room workflow is currently public (no login wall); this feature keeps that behavior and adds no new authentication mechanism.
- **Session storage persistence**: the active image is retained for the lifetime of the browser tab (survives route navigation between steps and a full page refresh within the same tab) and is cleared when the tab/session ends. It is not persisted to a server.
- **Captured photos are normalized** to the standard image display format for consistent preview across devices.
- **HEIC is out of scope** for capture and upload validation; it is treated as an unsupported type with a clear message.
- **Reuse of existing architecture**: the feature reuses the project's React/Vite structure, design system, routing, and existing context-based state approach rather than introducing a new state-management stack.

## Clarifications

### Session 2026-09-15

- Q: Where should "Continue" take the user after a valid room image is ready, given the Design My Room workflow has no built-out downstream step yet? → A: A new ComingSoon-style "Style & Generate — coming soon" stub page in the workflow that receives and retains the active image.
- Q: How long should the active room image survive, beyond normal in-app navigation between steps? → A: Session storage — the image survives a full browser refresh within the same tab and is cleared when the tab/session ends.