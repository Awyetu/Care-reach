export type VerificationStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ModerationActionType = 
  | 'APPROVED'
  | 'REJECTED'
  | 'REQUESTED_CORRECTION'
  | 'CANCELLED'
  | 'MARKED_EXPIRED'
  | 'EDITED';

export type ReportType = 
  | 'INCORRECT_INFORMATION'
  | 'EVENT_CANCELLED'
  | 'DUPLICATE'
  | 'SUSPICIOUS'
  | 'OTHER';

export interface OutreachEvidence {
  id: string;
  outreach_id: string;
  file_url: string;
  file_name?: string;
  file_type?: string;
  uploaded_at: string;
}

export interface Outreach {
  id: string;
  slug: string;
  title: string;
  description: string;
  organizer_name: string;
  state: string;
  lga: string;
  venue: string;
  address: string;
  latitude?: number;
  longitude?: number;
  start_datetime: string; // ISO date string
  end_datetime?: string; // ISO date string
  services: string[];
  eligibility?: string;
  what_to_bring?: string;
  contact_phone?: string;
  contact_email?: string;
  organizer_url?: string;
  source_url?: string;
  verification_status: VerificationStatus;
  evidence?: OutreachEvidence[];
  contributor_name: string;
  contributor_email: string;
  contributor_phone?: string;
  rejection_reason?: string;
  moderator_notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  isDemo?: boolean;
}

export interface ModerationAction {
  id: string;
  outreach_id: string;
  outreach_title: string;
  moderator_id: string;
  moderator_name: string;
  action: ModerationActionType;
  reason?: string;
  notes?: string;
  created_at: string;
}

export interface OutreachReport {
  id: string;
  outreach_id: string;
  outreach_title: string;
  report_type: ReportType;
  description: string;
  reporter_name?: string;
  reporter_email?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface OutreachFilters {
  searchQuery?: string;
  state?: string;
  lga?: string;
  services?: string[];
  dateRange?: 'all' | 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'custom';
  customDate?: string;
  verificationStatus?: 'all' | 'verified_only' | 'pending_only';
  sortBy?: 'soonest' | 'recently_added' | 'recently_updated';
}
