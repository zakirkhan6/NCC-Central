-- ===============================================================
-- NCC CENTRAL - SYSTEM HEALTHCHECK TABLE (KEEPALIVE)
-- ===============================================================

-- 1. CREATE HEALTHCHECK TABLE
CREATE TABLE IF NOT EXISTS public.system_healthcheck (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    last_ping timestamptz NOT NULL DEFAULT now()
);

-- 2. INSERT INITIAL RECORD
INSERT INTO public.system_healthcheck (last_ping)
VALUES (now());

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.system_healthcheck ENABLE ROW LEVEL SECURITY;

-- 4. READ-ONLY RLS POLICY FOR ANONYMOUS & AUTHENTICATED ROLES
-- Grants SELECT permission ONLY for health-check pings; INSERT, UPDATE, DELETE are forbidden.
CREATE POLICY "Allow public read access for healthcheck"
ON public.system_healthcheck
FOR SELECT
TO anon, authenticated
USING (true);
