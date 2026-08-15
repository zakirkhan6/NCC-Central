-- ===============================================================
-- NCC CENTRAL - DEVELOPMENT SEED DATA
-- ===============================================================

INSERT INTO public.profiles (id, email, full_name, role, phone, status)
VALUES
('00000000-0000-0000-0000-000000000001', 'admin@ncccentral.org', 'Col. Rajesh Verma', 'ADMIN', '+91 98765 43210', 'ACTIVE'),
('00000000-0000-0000-0000-000000000002', 'ano.roshan@ncccentral.org', 'Capt. Roshan Khobragade', 'ANO', '+91 98765 12345', 'ACTIVE'),
('00000000-0000-0000-0000-000000000003', 'hamza@cadet.ncccentral.org', 'Hamza Sayyed', 'CADET', '+91 99305 25095', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cadets (id, user_id, reg_no, full_name, email, phone, rank, company, platoon, date_joined, blood_group)
VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'MH23SDA56785', 'Hamza Sayyed', 'hamza@cadet.ncccentral.org', '+91 99305 25095', 'Senior Under Officer', 'ALPHA COY', 'Platoon 1', '2023-07-15', 'O+')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.announcements (title, content, priority, audience, author)
VALUES
('URGENT: Submission of TSC Camp Application Forms', 'All selected cadets for Thal Sainik Camp must submit hard copies of medical fitness certificates by 18th August 2026.', 'URGENT', 'Cadets', 'Capt. Roshan Khobragade (ANO)');
