-- ===============================================================
-- NCC CENTRAL - POSTGRESQL / SUPABASE DATABASE SCHEMA
-- ===============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'ANO', 'CADET')),
    phone VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CADETS TABLE
CREATE TABLE IF NOT EXISTS public.cadets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reg_no VARCHAR(50) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20),
    rank VARCHAR(50) DEFAULT 'Cadet',
    company VARCHAR(50) NOT NULL DEFAULT 'ALPHA COY',
    platoon VARCHAR(50) DEFAULT 'Platoon 1',
    date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
    blood_group VARCHAR(10),
    dob DATE,
    gender VARCHAR(10),
    father_name TEXT,
    college_name TEXT DEFAULT 'Rizvi College of Arts, Science & Commerce',
    course TEXT,
    year_of_study VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cadet_id UUID REFERENCES public.cadets(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    company VARCHAR(50) NOT NULL,
    platoon VARCHAR(50),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE', 'CAMP')),
    session TEXT DEFAULT 'Daily Fallin & Drill',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_cadet_daily_attendance UNIQUE (cadet_id, date, session)
);

-- 4. PARADES TABLE
CREATE TABLE IF NOT EXISTS public.parades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    commander TEXT NOT NULL,
    company VARCHAR(50) DEFAULT 'ALPHA COY',
    platoon VARCHAR(50) DEFAULT 'All Platoons',
    location TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'UPCOMING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TRAINING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    instructor TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    location TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. EVENTS & CAMPS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20),
    location TEXT NOT NULL,
    capacity INT DEFAULT 50,
    eligibility TEXT DEFAULT 'All Cadets',
    description TEXT,
    is_upcoming BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EVENT REGISTRATIONS LINK TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    cadet_id UUID REFERENCES public.cadets(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_event_cadet_registration UNIQUE (event_id, cadet_id)
);

-- 8. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cadet_id UUID REFERENCES public.cadets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    level VARCHAR(50),
    position VARCHAR(50),
    organization TEXT,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_no VARCHAR(100) UNIQUE NOT NULL,
    cadet_id UUID REFERENCES public.cadets(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    grade VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ISSUED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
    audience VARCHAR(50) DEFAULT 'All',
    publish_date DATE DEFAULT CURRENT_DATE,
    author TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR QUERY OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_cadets_reg_no ON public.cadets(reg_no);
CREATE INDEX IF NOT EXISTS idx_cadets_company ON public.cadets(company);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_certificates_no ON public.certificates(certificate_no);

-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policy Examples
CREATE POLICY "Public certificate verification" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Cadets can view own profile" ON public.cadets FOR SELECT USING (auth.uid() = user_id);
