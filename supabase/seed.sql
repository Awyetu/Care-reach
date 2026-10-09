-- ====================================================================
-- CAREREACH NIGERIA SEED DATA (POSTGRESQL / SUPABASE)
-- ====================================================================

-- 1. Default Moderator User
INSERT INTO users (id, name, email, phone, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Dr. Amina Bello', 'amina.bello@carereach.ng', '+234 803 111 2233', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- 2. Sample Outreaches Across Nigeria
INSERT INTO outreaches (
    id, slug, title, description, organizer_name,
    state, lga, venue, address, latitude, longitude,
    start_datetime, end_datetime, services, eligibility, what_to_bring,
    contact_phone, contact_email, organizer_url, source_url,
    verification_status, contributor_name, contributor_email, is_demo
) VALUES
(
    'a1111111-0000-0000-0000-000000000001',
    'ikeja-community-free-medical-screening-health-fair',
    'Ikeja Community Free Medical Screening & Health Fair',
    'A comprehensive one-day free community health outreach organized for Ikeja residents. Services include doctor consultations, blood pressure, malaria testing, and free basic medications.',
    'Hope Alive Community Healthcare Initiative (Demo Org)',
    'Lagos', 'Ikeja', 'Ikeja Local Government Council Secretariat Hall',
    '2 Obafemi Awolowo Way, Ikeja, Lagos State',
    6.5956, 3.3421,
    NOW() + INTERVAL '1 hour', NOW() + INTERVAL '7 hours',
    '["General Medical Care", "Blood Pressure Screening", "Blood Glucose Screening", "Malaria Screening & Treatment", "Free Medication / Pharmacy"]'::jsonb,
    'Open to all community members, elderly persons, and children.',
    'Any current routine medications or hospital records if available. No ID required.',
    '+234 803 123 4567', 'outreach@hopealive-demo.org', 'https://example.org/hopealive-demo', 'https://example.org/events/ikeja-health-2026',
    'VERIFIED', 'Dr. Kelechi Nwosu', 'k.nwosu@example.com', true
),
(
    'a1111111-0000-0000-0000-000000000002',
    'alimosho-free-eye-clinic-visual-acuity-reading-glasses',
    'Alimosho Free Eye Clinic, Visual Acuity & Reading Glasses Drive',
    'Free eye testing, glaucoma & cataract screening, refraction testing, and distribution of 300 free reading glasses for low-income residents in Alimosho LGA.',
    'ClearSight Foundation & Rotary Club Alimosho (Demo)',
    'Lagos', 'Alimosho', 'St. Peter Primary School Ground, Egbeda',
    '44 Idimu Road, Egbeda, Alimosho, Lagos State',
    6.6018, 3.2842,
    NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 6 hours',
    '["Eye Care & Optometry", "General Medical Care", "Health Education"]'::jsonb,
    'Residents of Alimosho and surrounding areas. Priority given to adults 40+ for reading glasses.',
    'Existing eyeglasses or eye drop prescriptions if using any.',
    '+234 809 555 0192', 'info@clearsight-demo.org', 'https://example.org/clearsight', 'https://facebook.com/events/clearsight-egbeda',
    'VERIFIED', 'Taiwo Adeyemi', 'taiwo.a@example.com', true
),
(
    'a1111111-0000-0000-0000-000000000003',
    'fct-free-maternal-care-child-wellness-clinic',
    'FCT Free Maternal Care & Child Wellness Clinic',
    'Free antenatal checkups, ultrasound scans for expectant mothers, routine childhood immunizations, vitamin A distribution, and pediatric health education.',
    'SafeMother & Child Aid Trust (Demo)',
    'FCT (Abuja)', 'Abuja Municipal (AMAC)', 'Area 2 Primary Healthcare Center Grounds',
    'Festival Road, Garki Area 2, AMAC, Abuja',
    9.0345, 7.4892,
    NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 7 hours',
    '["Maternal Health", "Child Health & Pediatrics", "Vaccination & Immunization", "Health Education"]'::jsonb,
    'Expectant mothers and children under 5 years.',
    'Child immunization card (yellow card) if available.',
    '+234 814 332 8890', 'fctoutreach@safemother-demo.ng', 'https://example.org/safemother', 'https://instagram.com/safemother_abuja',
    'VERIFIED', 'Fatima Sanusi', 'fatima.s@example.org', true
),
(
    'a1111111-0000-0000-0000-000000000004',
    'port-harcourt-free-dental-clinic-oral-hygiene',
    'Port Harcourt Free Dental Clinic & Oral Hygiene Outreach',
    'Professional dental consultation, ultrasonic scaling & polishing, non-surgical tooth extractions, oral cancer checks, and free toothbrushes & toothpaste distribution.',
    'Niger Delta Smile Mission & Medics Guild (Demo)',
    'Rivers', 'Port Harcourt', 'Civic Centre Field, Moscow Road',
    'Moscow Road, Old GRA, Port Harcourt, Rivers State',
    4.7678, 7.0092,
    NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 7 hours',
    '["Dental Care", "General Medical Care", "Free Medication / Pharmacy", "Health Education"]'::jsonb,
    'Everyone. Tokens will be distributed from 7:30 AM to manage queue.',
    'Bring drinking water and arrive early for queue numbering.',
    '+234 803 777 2211', 'smiles@ndmission-demo.org', 'https://example.org/ndmission', 'https://example.org/dental-ph-2026',
    'VERIFIED', 'Tonye Briggs', 'tonye.b@example.com', true
)
ON CONFLICT (slug) DO NOTHING;
