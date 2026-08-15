# Architecture Documentation - NCC Central

## System Architecture

NCC Central uses a decoupled full-stack architecture built with modern JavaScript standards:

- **Frontend**: Single Page Application built with React, Vite, JSX, and Tailwind CSS.
- **Backend**: Express REST API service running on Node.js with JWT authentication, role-based authorization, rate limiting, and structured logging.
- **Database / Backend Services**: PostgreSQL database managed via Supabase with Row Level Security (RLS) policies and local fallback store for local development.

```
                     NCC CENTRAL
                          |
                          v
              REACT FRONTEND (Vite + JSX)
                          |
                       Axios
                          |
                          v
         NODE.JS + EXPRESS BACKEND (JavaScript)
                          |
         +----------------+----------------+
         |                |                |
  Auth Verification  Business Logic    REST APIs
         |                |                |
         +----------------+----------------+
                          |
                          v
             SUPABASE / POSTGRESQL DATABASE
```

## Security Architecture

1. **Authentication**: JWT token verification on backend middleware.
2. **Authorization**: Strict role-based access control (`ADMIN`, `ANO`, `CADET`).
3. **Audit Logging**: Every administrative mutation (attendance marking, certificate generation, user creation) records immutable audit logs.
4. **Data Isolation**: Cadets only have read access to their own records and public unit announcements/events.
