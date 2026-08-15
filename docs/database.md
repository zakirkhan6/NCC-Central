# Database Schema Documentation - NCC Central

## PostgreSQL / Supabase Tables Overview

1. `profiles` - System user accounts and role definitions (`ADMIN`, `ANO`, `CADET`).
2. `cadets` - Normalized cadet roster, regimental numbers, company, platoon, blood group, emergency contact details.
3. `attendance` - Daily parade fallin records with status (`PRESENT`, `ABSENT`, `LEAVE`, `CAMP`).
4. `parades` - Scheduled parade dates, locations, squad orders, and commanders.
5. `training_sessions` - Syllabus modules (Drill, PT, Map Reading, First Aid, Leadership).
6. `events` - Camps (TSC, RDC) and social service drive registrations.
7. `event_registrations` - Link table mapping cadet enrollments to events.
8. `achievements` - Medals and competition honors.
9. `certificates` - Official qualification certificates with unique verification serials.
10. `announcements` - Circulars with priority and target audience filters.
11. `audit_logs` - Immutable operations logs.
