-- ====================================================================
-- CAREREACH NIGERIA DATABASE SCHEMA & ROW LEVEL SECURITY (POSTGRESQL)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'MODERATOR', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OUTREACHES TABLE
CREATE TABLE IF NOT EXISTS outreaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer_name TEXT NOT NULL,
    
    state TEXT NOT NULL,
    lga TEXT NOT NULL,
    venue TEXT NOT NULL,
    address TEXT NOT NULL,
    
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE,
    
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    eligibility TEXT,
    what_to_bring TEXT,
    
    contact_phone TEXT,
    contact_email TEXT,
    organizer_url TEXT,
    source_url TEXT,
    
    verification_status TEXT NOT NULL DEFAULT 'PENDING' 
        CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
    
    rejection_reason TEXT,
    moderator_notes TEXT,
    
    contributor_name TEXT NOT NULL,
    contributor_email TEXT NOT NULL,
    contributor_phone TEXT,
    
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for rapid discovery & search
CREATE INDEX IF NOT EXISTS idx_outreaches_status_start ON outreaches(verification_status, start_datetime);
CREATE INDEX IF NOT EXISTS idx_outreaches_state_lga ON outreaches(state, lga);
CREATE INDEX IF NOT EXISTS idx_outreaches_slug ON outreaches(slug);
CREATE INDEX IF NOT EXISTS idx_outreaches_services ON outreaches USING GIN (services);

-- 4. OUTREACH EVIDENCE (Flyers, images)
CREATE TABLE IF NOT EXISTS outreach_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outreach_id UUID NOT NULL REFERENCES outreaches(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_name TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_outreach_id ON outreach_evidence(outreach_id);

-- 5. MODERATION ACTIONS (Immutable audit log)
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outreach_id UUID NOT NULL REFERENCES outreaches(id) ON DELETE CASCADE,
    outreach_title TEXT NOT NULL,
    moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    moderator_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'REQUESTED_CORRECTION', 'CANCELLED', 'MARKED_EXPIRED', 'EDITED')),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_outreach_id ON moderation_actions(outreach_id);

-- 6. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outreach_id UUID NOT NULL REFERENCES outreaches(id) ON DELETE CASCADE,
    outreach_title TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('INCORRECT_INFORMATION', 'EVENT_CANCELLED', 'DUPLICATE', 'SUSPICIOUS', 'OTHER')),
    description TEXT NOT NULL,
    reporter_name TEXT,
    reporter_email TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 7. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    states JSONB DEFAULT '[]'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    email_notifications BOOLEAN DEFAULT false,
    whatsapp_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE outreaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Rule 1: Anyone (public) can read VERIFIED outreaches
CREATE POLICY "Public users can view verified outreaches"
    ON outreaches FOR SELECT
    USING (verification_status = 'VERIFIED' OR auth.role() = 'service_role');

-- Rule 2: Anyone can insert a PENDING outreach
CREATE POLICY "Public can submit pending outreach"
    ON outreaches FOR INSERT
    WITH CHECK (verification_status = 'PENDING');

-- Rule 3: Only authenticated moderators/admins can update or delete outreaches
CREATE POLICY "Moderators can update outreaches"
    ON outreaches FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('MODERATOR', 'ADMIN')
        )
    );

-- Rule 4: Public can view evidence for verified outreaches
CREATE POLICY "Public can view evidence for verified outreaches"
    ON outreach_evidence FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM outreaches
            WHERE outreaches.id = outreach_evidence.outreach_id
              AND outreaches.verification_status = 'VERIFIED'
        )
    );

-- Rule 5: Anyone can submit a report
CREATE POLICY "Anyone can submit a report"
    ON reports FOR INSERT
    WITH CHECK (true);

-- Rule 6: Only moderators can view reports and audit logs
CREATE POLICY "Moderators can view reports"
    ON reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('MODERATOR', 'ADMIN')
        )
    );

CREATE POLICY "Moderators can view moderation actions"
    ON moderation_actions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('MODERATOR', 'ADMIN')
        )
    );

-- Trigger: Update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_outreaches_updated_at
    BEFORE UPDATE ON outreaches
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
