# Supabase Database Keepalive System

## 1. Overview
Supabase free-tier / inactive projects may automatically pause after periods of inactivity. The **Supabase Keepalive System** performs a daily automated, lightweight database query via GitHub Actions to keep the NCC Central Supabase project active without requiring users or administrators to visit the frontend application.

---

## 2. Why GitHub Actions?
- **Frontend Independence**: The keepalive operates on a cloud runner, completely decoupled from frontend web traffic, browser tabs, or user sessions.
- **Reliability**: GitHub Actions provides a serverless cron scheduler that executes consistently every day.
- **Zero Cost & Secure**: Uses GitHub's built-in scheduled workflows and encrypted repository secrets. No servers or paid services required.
- **Minimum Privilege**: Uses the public/anonymous API key with Row Level Security (RLS) restricted strictly to a read-only table (`system_healthcheck`), eliminating the need to expose sensitive database tables or service role keys.

---

## 3. Workflow File Location
The workflow is defined in:
```text
.github/workflows/supabase-keepalive.yml
```

---

## 4. Required GitHub Secrets
To allow the GitHub Actions workflow to query your Supabase instance, you must configure two repository secrets in GitHub:

| Secret Name | Description | Example / Format |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> [!CAUTION]
> **Security Notice:**
> - Never use the `SUPABASE_SERVICE_ROLE_KEY` for this workflow.
> - Never commit API keys or `.env` files into source control.

### How to Add GitHub Secrets
1. Go to your GitHub repository on [github.com](https://github.com).
2. Click **Settings** (tab at the top).
3. In the left sidebar, expand **Secrets and variables** and select **Actions**.
4. Click the **New repository secret** button.
5. Create `SUPABASE_URL` and enter your project URL as the secret value.
6. Click **Add secret**.
7. Click **New repository secret** again, create `SUPABASE_ANON_KEY`, and enter your anon key.
8. Click **Add secret**.

---

## 5. Database Setup (One-time)
Ensure the `system_healthcheck` table is created with RLS enabled:
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the migration file [`database/migrations/002_system_healthcheck.sql`](../database/migrations/002_system_healthcheck.sql):
   ```sql
   CREATE TABLE IF NOT EXISTS public.system_healthcheck (
       id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       last_ping timestamptz NOT NULL DEFAULT now()
   );

   INSERT INTO public.system_healthcheck (last_ping)
   VALUES (now());

   ALTER TABLE public.system_healthcheck ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow public read access for healthcheck"
   ON public.system_healthcheck
   FOR SELECT
   TO anon, authenticated
   USING (true);
   ```

---

## 6. How to Manually Run the Workflow
1. Navigate to your GitHub repository in your browser.
2. Click the **Actions** tab at the top.
3. In the left sidebar under *All workflows*, click **Supabase Keepalive**.
4. Click the **Run workflow** dropdown button on the right.
5. Select branch `main` and click the green **Run workflow** button.

---

## 7. How to Check Workflow Status & Logs
1. Navigate to **Actions** -> **Supabase Keepalive**.
2. Click on the latest workflow run in the list.
3. Click on the **keepalive** job to view the live execution log.
4. Expand **Ping Supabase Healthcheck Endpoint**:
   - A successful ping will show status code `200` with output `[{"id":1}]`.
   - A green checkmark indicates success.

---

## 8. Troubleshooting Failed Pings
If the workflow run fails (red `X` icon):

| Error / Symptom | Potential Cause | Solution |
| :--- | :--- | :--- |
| `HTTP 401 Unauthorized` | Invalid `SUPABASE_ANON_KEY` or missing header | Verify `SUPABASE_ANON_KEY` in GitHub Secrets. |
| `HTTP 404 Not Found` | Table `system_healthcheck` does not exist | Run `database/migrations/002_system_healthcheck.sql` in Supabase SQL Editor. |
| `HTTP 403 Forbidden` / `[]` | RLS policy missing on `system_healthcheck` | Ensure the `Allow public read access for healthcheck` policy is applied. |
| `Could not resolve host` | Invalid `SUPABASE_URL` | Check `SUPABASE_URL` in GitHub Secrets for typos (e.g. `https://your-id.supabase.co`). |
| `HTTP 503 / 504` | Supabase database paused or undergoing maintenance | Log in to Supabase dashboard to unpause project, then rerun workflow. |
