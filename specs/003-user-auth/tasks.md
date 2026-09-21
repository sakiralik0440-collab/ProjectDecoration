- [X] T001 Setup project monorepo structure (frontend & backend directories, shared .gitignore, root README)
- [X] T002 Initialize Git repository, create initial commit
- [X] T003 Create frontend Vite + React project (npm create vite@latest frontend --template react)
- [X] T004 Install frontend dependencies (react-router-dom, axios, validator)
- [X] T005 Create backend Node.js + Express project (npm init -y; npm install express mongoose dotenv jsonwebtoken bcryptjs)
- [X] T006 Install backend dev dependencies (nodemon)
- [X] T007 Configure environment variables (.env files for both frontend & backend)
- [X] T008 Setup MongoDB connection (src/config/db.js)
- [X] [X] T009 [P] Create shared ESLint + Prettier config (root/.eslintrc.cjs, .prettierrc)
- [X] T010 [P] Add scripts to package.json (dev, start)

--- Phase 2: Foundational ---------------------------------------------------------
- [X] T011 Create Mongoose User schema (src/models/User.js)
- [X] T012 Create authentication middleware (src/middlewares/authMiddleware.js)
- [X] T013 Create auth route file (src/routes/authRoutes.js)
- [X] T014 Implement register controller (src/controllers/authController.js)
- [X] T015 Implement login controller (src/controllers/authController.js)
- [X] T016 Add JWT token generation utility (src/utils/jwt.js)
- [X] T017 Add password hashing utility (src/utils/hash.js)
- [X] T018 [P] Create error handling middleware (src/middlewares/errorHandler.js)

--- Phase 3: User Story 1 – Register (P1) -----------------------------------------
- [X] T019 [US1] Build Register React component (frontend/src/components/Auth/Register.jsx)
- [X] T020 [US1] Add client‑side validation (name, email, password, confirmPassword)
- [X] T021 [US1] Hook Register component to AuthContext (frontend/src/context/AuthContext.jsx)
- [X] T022 [US1] Create API call for registration (frontend/src/services/api.js)
- [X] T023 [US1] Implement server‑side validation in register controller (duplicate email, password policy)
- [X] T024 [US1] Return success response with user info (no token)
- [X] T025 [US1] Display success toast & redirect to login page

--- Phase 4: User Story 2 – Login (P2) --------------------------------------------
- [X] T026 [US2] Build Login React component (frontend/src/components/Auth/Login.jsx)
- [X] T027 [US2] Add client‑side validation (email, password)
- [X] T028 [US2] Hook Login component to AuthContext (frontend/src/context/AuthContext.jsx)
- [X] T029 [US2] Create API call for login (frontend/src/services/api.js)
- [X] T030 [US2] Implement server‑side login validation (email exists, bcrypt compare)
- [X] T031 [US2] Issue JWT (expires in 1 hour) and return to client
- [X] T032 [US2] Store JWT in localStorage and update AuthContext state
- [X] T033 [US2] Redirect authenticated user to Dashboard

--- Phase 5: User Story 3 – Protected Dashboard (P3) ------------------------------
- [X] T034 [US3] Build Dashboard React component (frontend/src/components/Auth/Dashboard.jsx)
- [X] T035 [US3] Create ProtectedRoute wrapper (frontend/src/components/Auth/ProtectedRoute.jsx)
- [X] T036 [US3] Add route protection in App.jsx using React Router
- [X] T037 [US3] Implement GET /api/auth/me endpoint (src/routes/protectedRoutes.js)
- [X] T038 [US3] Fetch current user profile on Dashboard mount
- [X] T039 [US3] Display user name & basic info

--- Phase 6: User Story 4 – Logout (US4) -------------------------------------------
- [X] T040 [US4] Add Logout button to Dashboard
- [X] T041 [US4] Implement logout function in AuthContext (clear token, reset user state)
- [X] T042 [US4] Redirect to login after logout

--- Phase 7: Cross‑Cutting Concerns ----------------------------------------------
- [X] T043 [P] Implement global Axios interceptor for JWT attachment & error handling
- [X] T044 [P] Add responsive CSS (mobile‑first breakpoints) for all auth pages
- [X] T045 [P] Add centralized error toast component (frontend/src/components/Toast.jsx)
- [X] T046 [P] Write API error handling middleware (backend/src/middlewares/errorHandler.js)
- [X] T047 [P] Add input sanitization (validator library) on backend
- [X] T048 [P] Create basic unit tests for User model (backend/tests/user.test.js)
- [X] T049 [P] Create integration tests for auth routes (backend/tests/auth.integration.test.js)

--- Final Phase: Polish & Documentation -----------------------------------------
- [X] T050 Update README with setup instructions for both frontend & backend
- [X] T051 Add .env example files with required variables
- [X] T052 Ensure all linting rules pass (npm run lint)
- [X] T053 Verify tasks.md follows checklist format (checkbox, ID, [P] marker, [USx] label, clear file paths)
