-- ===============================================================
-- NCC CENTRAL - RLS POLICIES FOR CADET MANAGEMENT & FULL SYNC
-- ===============================================================

-- 1. PROFILES TABLE RLS POLICY (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow anon and authenticated all access to profiles" ON public.profiles;
CREATE POLICY "Allow anon and authenticated all access to profiles"
ON public.profiles
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 2. CADETS TABLE RLS POLICY (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow anon and authenticated all access to cadets" ON public.cadets;
CREATE POLICY "Allow anon and authenticated all access to cadets"
ON public.cadets
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 3. ATTENDANCE TABLE RLS POLICY
DROP POLICY IF EXISTS "Allow anon and authenticated all access to attendance" ON public.attendance;
CREATE POLICY "Allow anon and authenticated all access to attendance"
ON public.attendance
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. CERTIFICATES TABLE RLS POLICY
DROP POLICY IF EXISTS "Allow anon and authenticated all access to certificates" ON public.certificates;
CREATE POLICY "Allow anon and authenticated all access to certificates"
ON public.certificates
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
