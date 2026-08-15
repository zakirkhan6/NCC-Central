# REST API Reference Documentation - NCC Central

## Base URL
`/api`

## Response Format
```json
{
  "success": true,
  "message": "Operation response description",
  "data": {}
}
```

## Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Authenticate user & get JWT token
- `POST /api/auth/register` - Cadet self-registration
- `GET /api/auth/me` - Get current session user details

### Cadets (`/api/cadets`)
- `GET /api/cadets` - List cadets (supports search, company filter, pagination)
- `GET /api/cadets/:id` - Deep profile view for cadet
- `POST /api/cadets` - Create new cadet (ADMIN/ANO)
- `PUT /api/cadets/:id` - Update cadet record (ADMIN/ANO)
- `PATCH /api/cadets/:id/status` - Activate/Deactivate cadet (ADMIN/ANO)

### Attendance (`/api/attendance`)
- `GET /api/attendance` - Query attendance records
- `GET /api/attendance/stats` - Battalion attendance statistics
- `POST /api/attendance/bulk` - Mark bulk fallin attendance (ADMIN/ANO)

### Parades & Training (`/api/parades`, `/api/training`)
- `GET /api/parades` - List parade schedules
- `POST /api/parades` - Schedule new parade (ADMIN/ANO)
- `GET /api/training` - Training syllabus modules
- `POST /api/training` - Create training module (ADMIN/ANO)

### Events & Camps (`/api/events`)
- `GET /api/events` - List upcoming camps and social drives
- `POST /api/events` - Create event (ADMIN/ANO)
- `POST /api/events/:id/register` - Enroll cadet in event

### Certificates (`/api/certificates`)
- `GET /api/certificates` - List issued certificates
- `POST /api/certificates` - Issue new certificate (ADMIN/ANO)
- `GET /api/certificates/verify/:certNo` - Public QR verification endpoint

### Reports & Export (`/api/reports`)
- `GET /api/reports/summary` - Aggregate metrics & chart data
- `GET /api/reports/export/cadets` - Download CSV cadet roster
- `GET /api/reports/export/attendance` - Download CSV attendance register
