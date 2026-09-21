# Tasks for Feature: Login & Register (002-login-and-register)

## Phase 1 – Setup (Project Initialization)

- [ ] T001 Create project scaffold with Node.js, Express, React, and Mongoose (backend & frontend directories)
- [ ] T002 Initialize Git repository and make initial commit
- [ ] T003 Add ESLint, Prettier, and EditorConfig configurations
- [ ] T004 Install core dependencies: express, mongoose, cors, dotenv, bcrypt, nodemailer, jsonwebtoken, react, react-dom, react-router-dom, axios, @reduxjs/toolkit, react-redux
- [ ] T005 Set up basic folder structure:
  - backend/src/models
  - backend/src/services
  - backend/src/middleware
  - backend/src/routes
  - frontend/src/components
  - frontend/src/pages
  - frontend/src/services
- [ ] T006 Create a root docker-compose.yml (optional) to spin up MongoDB locally

## Phase 2 – Foundational (Blocking Prerequisites)

- [ ] T007 Configure MongoDB connection via Mongoose (ackend/src/config/db.js)
- [ ] T008 Create .env file with placeholders for DB_URI, JWT_SECRET, EMAIL_HOST, EMAIL_USER, EMAIL_PASS
- [ ] T009 Implement password hashing utility using bcrypt (ackend/src/utils/hash.js)
- [ ] T010 Implement email service wrapper using nodemailer (ackend/src/utils/email.js)
- [ ] T011 Add global error-handling middleware (ackend/src/middleware/errorHandler.js)
- [ ] T012 Add request validation middleware (Joi or express-validator) (ackend/src/middleware/validate.js)
- [ ] T013 Set up JWT generation & verification utilities (ackend/src/utils/jwt.js)

## Phase 3 – User Story 1: Register New Account (Priority: P1)  **[US1]**

- [ ] T014 [US1] Design Register page UI (rontend/src/pages/Register.jsx) with fields: username, email, OTP, password
- [ ] T015 [US1] Add client-side form validation (password policy, email format) (rontend/src/components/RegisterForm.jsx)
- [ ] T016 [US1] Create API route POST /api/register (ackend/src/routes/auth.js)
- [ ] T017 [US1] Implement registration handler:
  - Validate input
  - Check for existing email
  - Generate 6-digit OTP, store hashed OTP & expiry in user document
  - Send OTP email via email service
- [ ] T018 [US1] Define User Mongoose schema with fields: username, email, passwordHash, otpHash, otpExpires (ackend/src/models/User.js)
- [ ] T019 [US1] Create OTP verification endpoint POST /api/register/verify-otp (ackend/src/routes/auth.js)
- [ ] T020 [US1] Implement OTP verification logic:
  - Compare hashed OTP, check expiry
  - Hash password and save user record
- [ ] T021 [US1] Front-end OTP entry flow after initial registration (rontend/src/pages/VerifyOtp.jsx)
- [ ] T022 [US1] Redirect to login page upon successful verification
- [ ] T023 [US1] Add unit tests for registration & OTP verification (ackend/tests/unit/auth.register.test.js)
- [ ] T024 [US1] Add integration tests for end-to-end registration flow (ackend/tests/integration/register.flow.test.js)
- [ ] T025 [US1] Log registration events (info level) (ackend/src/middleware/logger.js)

## Phase 4 – User Story 2: Login Existing Account (Priority: P1)  **[US2]**

- [ ] T026 [US2] Design Login page UI (rontend/src/pages/Login.jsx) with email & password fields
- [ ] T027 [US2] Add client-side validation for email & password format (rontend/src/components/LoginForm.jsx)
- [ ] T028 [US2] Create API route POST /api/login (ackend/src/routes/auth.js)
- [ ] T029 [US2] Implement login handler:
  - Validate input
  - Find user by email
  - Verify password hash with bcrypt
  - Issue JWT and set HttpOnly cookie
- [ ] T030 [US2] Front-end login flow: call /api/login, store token, redirect to dashboard (rontend/src/pages/Dashboard.jsx)
- [ ] T031 [US2] Add unit tests for login handler (ackend/tests/unit/auth.login.test.js)
- [ ] T032 [US2] Add integration test for successful login (ackend/tests/integration/login.flow.test.js)
- [ ] T033 [US2] Log login attempts (success & failure) (ackend/src/middleware/logger.js)

## Phase 5 – User Story 3: Invalid OTP Handling (Priority: P2)  **[US3]**

- [ ] T034 [US3] Extend OTP verification endpoint to return clear error for wrong OTP
- [ ] T035 [US3] Extend OTP verification endpoint to return clear error for expired OTP
- [ ] T036 [US3] Front-end display of OTP error messages (rontend/src/pages/VerifyOtp.jsx)
- [ ] T037 [US3] Add unit tests for OTP error scenarios (ackend/tests/unit/auth.otpError.test.js)

## Phase 6 – User Story 4: Incorrect Password Handling (Priority: P2)  **[US4]**

- [ ] T038 [US4] Ensure login endpoint returns generic  Invalid credentials for wrong password
- [ ] T039 [US4] Front-end display of login error message (rontend/src/pages/Login.jsx)
- [ ] T040 [US4] Add unit test for login failure due to wrong password (ackend/tests/unit/auth.loginFail.test.js)

## Phase 7 – Polish & Cross-Cutting Concerns

- [ ] T041 Add end-to-end test covering full registration ? OTP verification ? login flow (ackend/tests/e2e/full.flow.test.js)
- [ ] T042 Write README section with setup instructions (MongoDB, env vars, email service)
- [ ] T043 Generate OpenAPI/Swagger documentation for /api/register, /api/register/verify-otp, and /api/login
- [ ] T044 Perform security review:
  - Verify passwords never logged
  - Ensure JWT secret is sourced from env
  - Rate-limit login & OTP endpoints (e.g., express-rate-limit)
- [ ] T045 Optimize OTP email template for clarity and branding (ackend/src/templates/otpEmail.html)
- [ ] T046 Run ESLint & Prettier across codebase and fix violations
- [ ] T047 Deploy a staging build and validate OTP email delivery latency (<?5?s) and registration time (<?3?min)

**Done**
