# Research and Design Decisions

## Frontend Stack
- **React** with **Vite** for fast development and hot‑module replacement.
- **React Router** for client‑side navigation between Register, Login, Dashboard, and any protected pages.
- **Axios** for HTTP communication with the backend API, with an interceptor to attach the JWT token.

## Backend Stack
- **Node.js** with **Express** – lightweight and flexible HTTP server.
- **JWT** (jsonwebtokens) for stateless authentication.
- **bcrypt** for password hashing (salted, adaptive hash function).
- **Mongoose** as ODM for MongoDB, providing schema validation.

## Database
- **MongoDB** – document store, suitable for flexible user schema.

## Key Decisions & Rationale
| Decision | Rationale |
|----------|-----------|
| Use JWT for stateless auth | Simplifies scaling – no server‑side session store required.
| Store password hash with bcrypt (12 salt rounds) | Industry‑standard balance between security and performance.
| Separate `Auth` middleware | Keeps route handlers clean and enables reuse across protected endpoints.
| Vite over Create‑React‑App | Faster dev server, modern ES module support, smaller bundle.
| Axios interceptors for token handling | Centralizes auth header injection and error handling.

## Open Questions Resolved
- **Password policy**: Minimum 8 characters, at least one letter and one number.
- **JWT expiration**: 1 hour lifetime; refresh token flow omitted per spec.
- **Email verification**: Not required.
