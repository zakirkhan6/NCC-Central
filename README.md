# NCC CENTRAL
### Centralized NCC Management & Operations Platform
*"One Platform. Complete NCC Management."*

---

## Project Overview

**NCC Central** is a professional, institutional full-stack management platform designed specifically for National Cadet Corps (NCC) units (1 MAH BATTALION NCC, MUMBAI-B ALPHA COY, Rizvi Unit). It modernizes traditional paper-based workflows into a secure, digital operations hub.

### Core Modules Implemented
- **Cadet Directory & Deep Profiles**: Complete cadet management with regimental numbers, company/platoon distribution, rank tracking, and medical records.
- **Parade Fallin & Attendance**: Daily attendance marking with duplicate safeguards, percentage analytics, and company filters.
- **Parades & Training Modules**: Drill schedules, weapon training, map reading, PT conditioning, and syllabus tracking.
- **Camps & Events**: Thal Sainik Camp (TSC), Republic Day Camp (RDC) selection trials, social service drives, and capacity management.
- **QR-Verified Certificates**: Issuance of 'A', 'B', 'C' certificates with public QR verification endpoint.
- **Circulars & Announcements**: Broadcast notices filtered by priority (Urgent, Important, Normal) and target audience (Cadets, Officers, All).
- **Reports & Analytics**: Visual charts with Recharts, CSV export for cadet rosters and attendance logs.
- **Audit Logs & Security**: Immutable activity tracking, JWT authentication, and strict Role-Based Access Control (`ADMIN`, `ANO`, `CADET`).

---

## Technology Stack

- **Frontend**: React, Vite, JavaScript (JSX), Tailwind CSS, React Router, Axios, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, REST API, JWT Authentication, Helmet, CORS, Rate Limiting, Winston logging.
- **Database / Backend Services**: Supabase PostgreSQL + Auth + Storage migrations, with local persistent fallback engine.

---

## Folder Structure

```
ncc-central/
│
├── frontend/             # React SPA (Vite + JSX + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components (StatCard, Modal, Badge, Button, Navbar, Sidebar)
│   │   ├── contexts/     # AuthContext, NotificationContext
│   │   ├── layouts/      # DashboardLayout, PublicLayout
│   │   ├── pages/        # All module pages & dashboards
│   │   ├── services/     # Axios API client
│   │   ├── App.jsx       # React Router setup
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/              # Node.js Express REST API Server
│   ├── src/
│   │   ├── config/       # Environment & Supabase setup
│   │   ├── controllers/  # Auth, Cadets, Attendance, Parades, Training, Events, Certificates, etc.
│   │   ├── middleware/   # Auth JWT, Role RBAC, Error Handler, Rate Limiter
│   │   ├── routes/       # Express Router definitions
│   │   ├── store/        # Data persistence store with pre-seeded test data
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/            # API test suite
│   ├── package.json
│   └── .env.example
│
├── database/             # Database Schemas & Migrations
│   ├── migrations/       # 001_initial_schema.sql (PostgreSQL + RLS policies)
│   ├── seed/             # seed_data.sql
│   └── README.md
│
├── docs/                 # Production Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── deployment.md
│   └── user-guide.md
│
├── package.json          # Monorepo scripts
├── .gitignore
└── README.md
```

---

## Local Quick Start Instructions

### 1. Installation
Install dependencies for both backend and frontend:
```bash
npm run install:all
```

### 2. Start Local Servers
Run the Express backend (Port 5000) and React Vite frontend (Port 5173):

```bash
# Terminal 1: Start Express Backend
npm run dev:backend

# Terminal 2: Start React Frontend
npm run dev:frontend
```

Open your browser at `http://localhost:5173`.

---

## Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| **ADMIN** (Battalion Commander) | `admin@ncccentral.org` | `password123` |
| **ANO** (Associate NCC Officer) | `ano.roshan@ncccentral.org` | `password123` |
| **CADET** (Senior Under Officer) | `hamza@cadet.ncccentral.org` | `password123` |

---

## Testing & Verification

Run the test suite:
```bash
npm test
```
