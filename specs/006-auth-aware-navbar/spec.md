# Feature Specification: Authentication-Aware Navigation Bar

**Feature Branch**: `006-auth-aware-navbar`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "Update the existing ProjectDecoration Navbar to make it authentication-aware. Reuse the existing AuthContext/AuthProvider and JWT/localStorage token handling; do not create a new authentication system; keep Login, Register, Logout, JWT, and ProtectedRoute behavior intact. Logged-out users see Home, Design My Room, Furniture, Login, Register. Logged-in users see Home, Design My Room, Furniture, My Designs, Profile, Logout. The navbar must react immediately to auth state changes, survive a page refresh via the existing token-restoration mechanism, show no Login/Register flash while session state is being restored, and mirror the same options in the mobile menu. Registration keeps the existing OTP flow."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logged-Out User Sees Public Navigation (Priority: P1)

A visitor who has not signed in opens the site. The navigation bar shows the ProjectDecoration brand and the public links Home, Design My Room, and Furniture, followed by Login and Register. It does not show Profile, Logout, or My Designs (a protected area that requires authentication to view). The visitor can reach Login or Register to sign in.

**Why this priority**: It is the baseline state every visitor sees and the foundation of the acceptance criteria.

**Independent Test**: Open Home with no token present (fresh browser or after logout) and confirm the nav items and that My Designs/Profile/Logout are absent.

**Acceptance Scenarios**:

1. **Given** a user who is not authenticated, **When** they open Home, **Then** the navbar shows Home, Design My Room, Furniture, Login, and Register.
2. **Given** a user who is not authenticated, **When** they open any page, **Then** the navbar never shows Profile, Logout, or My Designs.
3. **Given** a user who is not authenticated, **When** they open the protected My Designs page directly, **Then** the existing ProtectedRoute redirects to Login without any navbar regression.

---

### User Story 2 - Logged-In User Sees Authenticated Navigation (Priority: P1)

A user who successfully logs in is authenticated. After authentication completes and the user is taken to Home, the navbar automatically switches: Home, Design My Room, Furniture, My Designs, Profile, and Logout appear, and Login and Register are hidden. The change happens in the same moment authentication state changes; the user never has to reload manually.

**Why this priority**: It is the core deliverable of the feature — the navbar must truthfully mirror the authenticated session.

**Independent Test**: Log in with valid credentials and confirm the navbar flips to the authenticated set immediately and Login/Register are gone.

**Acceptance Scenarios**:

1. **Given** a user who logs in successfully, **When** authentication completes and they land on Home, **Then** the navbar shows My Designs, Profile, and Logout.
2. **Given** a logged-in user, **When** the navbar is rendered, **Then** Login and Register are not visible in any viewport or menu.
3. **Given** a logged-in user, **When** authentication state becomes available, **Then** the navbar updates without requiring a manual page reload.

---

### User Story 3 - Session Survives a Page Refresh (Priority: P1)

A logged-in user refreshes the Home page. The browser restores the authenticated session using the existing token and profile-restoration mechanism; the navbar continues to show the authenticated navigation and Login/Register stay hidden. The decision never depends on React component state alone, which would be lost on refresh.

**Why this priority**: Breaks the refresh case is one of the most common reported regressions in auth-sensitive navigation.

**Independent Test**: Log in, refresh the page, and confirm the authenticated navbar persists and the account name resolves from the restored profile.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they refresh Home, **Then** the navbar still shows My Designs, Profile, and Logout.
2. **Given** a logged-in user, **When** they refresh Home, **Then** Login and Register remain hidden during and after the refresh.
3. **Given** a valid stored token with a cleared session state, **When** the app initializes, **Then** the authenticated user is restored from the existing token mechanism, not from in-memory component state.

---

### User Story 4 - Logout Returns to Public Navigation (Priority: P1)

A logged-in user clicks Logout. The existing logout flow clears the token, resets the authentication state, and sends the user to Login (the current application flow). The navbar immediately shows the public navigation again — Login and Register reappear, My Designs, Profile, and Logout disappear.

**Why this priority**: Closes the loop; the navbar must react to the reverse transition just as promptly.

**Independent Test**: Log out and confirm the redirect works and the navbar shows Login/Register with the authenticated items gone.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they click Logout, **Then** the existing logout function runs, the token is cleared, and authentication state resets.
2. **Given** a user who just logged out, **When** they land on Login, **Then** the navbar shows Login and Register and hides My Designs, Profile, and Logout.

---

### User Story 5 - Registration and OTP Flow Are Preserved (Priority: P2)

A new user registers through the existing flow: they request an OTP, verify it, and are sent to Login as the application currently does. No new auto-login is introduced; the navbar behavior during and after this flow matches the existing application flow.

**Why this priority**: The feature must not alter how registration works today.

**Independent Test**: Register a new account through the full OTP flow and confirm each step still navigates as it does today.

**Acceptance Scenarios**:

1. **Given** a user at the Register step, **When** they request an OTP, **Then** the OTP verification step appears exactly as before.
2. **Given** a user who verified their OTP, **When** registration completes, **Then** they are taken to Login to sign in, exactly as today.

---

### Edge Cases

- What happens while the session is being restored after a refresh? → The navbar waits for the existing restoration to finish before settling; it never shows Login/Register to an already logged-in user (no flash).
- What happens if the stored token is invalid or expired on refresh? → The existing restoration clears it and the navbar settles to the logged-out navigation (Login/Register visible).
- What happens if the user opens the mobile menu? → The same authentication-dependent options appear as in the desktop navigation.
- What happens if the user is on a protected page and logs out? → The existing flow redirects to Login; no lingering authenticated navigation.
- What happens if the authenticated profile has not loaded yet after refresh? → The navbar still renders authenticated navigation; the account label shows a neutral placeholder until the profile resolves.
- What about a user who navigates while logged in on a small phone screen? → Menu items stay reachable and the menu closes after a destination is chosen, as today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The navbar MUST derive its authentication state exclusively from the existing AuthContext (the existing single auth provider); it MUST NOT store a separate or duplicate copy of authentication state.
- **FR-002**: When the user is not authenticated, the navbar MUST show exactly: Home, Design My Room, Furniture, Login, Register — and MUST NOT show Profile, Logout, or My Designs.
- **FR-003**: When the user is authenticated, the navbar MUST show exactly: Home, Design My Room, Furniture, My Designs, Profile, Logout — and MUST NOT show Login or Register.
- **FR-004**: The navbar MUST react immediately to any change in the existing authentication state (login, logout, session restore) without a manual page reload.
- **FR-005**: After a successful login the user MUST be taken to Home and the navbar MUST show the authenticated navigation set.
- **FR-006**: After a page refresh, the active session MUST be restored through the existing token-read and profile-restoration mechanism so the navbar keeps showing the authenticated navigation set and Login/Register stay hidden.
- **FR-007**: The existing registration flow (request OTP → verify OTP → go to Login) MUST be preserved unchanged; the feature MUST NOT introduce automatic login after registration.
- **FR-008**: Logout MUST use the existing logout function, which clears the token and authentication state and redirects according to the current flow; afterward the navbar MUST show Login and Register again.
- **FR-009**: The existing ProtectedRoute behavior MUST be preserved: My Designs and Profile remain protected and MUST NOT be reachable or advertised to logged-out users.
- **FR-010**: While the initial session is being restored, the navbar MUST NOT flash Login/Register to an already logged-in user; it MUST use a minimal session-check state on the existing AuthContext (no separate system).
- **FR-011**: The mobile navigation MUST show the same authentication-dependent option set as the desktop navigation.
- **FR-012**: The feature MUST NOT modify Login, Register, OTP verification, JWT handling, API token handling, or any backend functionality.

### Key Entities

No new data entities are involved; the feature consumes the existing end-user authentication session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of logged-out sessions render Login and Register in the navbar and never render Profile, Logout, or My Designs.
- **SC-002**: 100% of successfully authenticated sessions render My Designs, Profile, and Logout in the navbar and never render Login or Register.
- **SC-003**: 100% of page refreshes on Home by a logged-in user keep the authenticated navigation set visible, including during restoration (no Login/Register flash).
- **SC-004**: 100% of logout actions restore the logged-out navigation set via the existing flow.
- **SC-005**: 100% of registration completions follow the existing OTP flow; the existing post-registration destination is unchanged.
- **SC-006**: The desktop and mobile menus render identical authentication-dependent options for the same session state.
- **SC-007**: No regressions: Login, Register, OTP verification, Logout, JWT/API token handling, ProtectedRoute, and all existing routes continue to work.

## Assumptions

- **Inspection confirmed the existing Navbar already mirrors auth state** (it reads the existing AuthContext and toggles Login/Register against Profile/Logout). The work is therefore an evolution of the existing Navbar, not a replacement: it must add the auth-dependent visibility of My Designs and Profile links and, pending the clarification below, the Design My Room and Furniture links, and add a minimal session-restoring state.
- **Existing redirect flow is preserved**: login and logout currently navigate via the app's existing flow; the feature reuses that behavior rather than introducing new navigation calls.
- **Existing AuthContext has no dedicated session-restoring flag today** (its `loading` flag covers in-progress auth operations only). Per the requirement, a minimal session-restoring state is added to the existing AuthContext; it is not a separate authentication system.
- **A logged-in user is identified by the presence of a valid session token** in the existing AuthContext, consistent with the current ProtectedRoute logic.
- **My Designs and Profile are already protected** routes; showing them only to logged-in users aligns the navbar with that protection.
- **No backend changes** are required or desired for this feature.

## Clarifications

### Session 2026-09-15

- Q: The requested nav bars include "Design My Room" and "Furniture" links in BOTH logged-out and logged-in states; however, earlier today the user explicitly asked to remove those links from the Navbar, and they are currently removed. Should this feature re-add them? → A: Yes — follow this specification literally (Option A). This formal spec supersedes the earlier ad hoc removal; "Design My Room" and "Furniture" are shown in both auth states.