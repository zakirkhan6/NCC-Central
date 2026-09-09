# Database Setup & Migrations - NCC Central

This folder contains PostgreSQL schema migration scripts and development seed data for Supabase / PostgreSQL.

## Instructions

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run `migrations/001_initial_schema.sql` to execute the full table creations, foreign keys, indexes, and Row Level Security (RLS) policies.
3. Run `migrations/002_system_healthcheck.sql` to create the lightweight `system_healthcheck` table with RLS enabled for the GitHub Actions keepalive ping.
4. Run `seed/seed_data.sql` to populate initial development test records.
