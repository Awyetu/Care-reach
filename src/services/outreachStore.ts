import { Outreach, ModerationAction, OutreachReport, OutreachFilters, VerificationStatus, ReportType } from '../types';
import { SEED_OUTREACHES } from '../data/seedData';

const STORAGE_KEY_OUTREACHES = 'carereach_outreaches_v1';
const STORAGE_KEY_AUDIT = 'carereach_audit_v1';
const STORAGE_KEY_REPORTS = 'carereach_reports_v1';

// Initial audit logs for demo
const INITIAL_AUDIT_LOGS: ModerationAction[] = [
  {
    id: 'audit-demo-1',
    outreach_id: 'demo-outreach-1',
    outreach_title: 'Ikeja Community Free Medical Screening & Health Fair',
    moderator_id: 'mod-1',
    moderator_name: 'Dr. Amina Bello (Lead Moderator)',
    action: 'APPROVED',
    notes: 'Organizer credentials verified. Local council hall booking confirmed.',
    created_at: '2026-10-04T10:15:00'
  },
  {
    id: 'audit-demo-2',
    outreach_id: 'demo-outreach-4',
    outreach_title: 'Port Harcourt Free Dental Clinic & Oral Hygiene Outreach',
    moderator_id: 'mod-1',
    moderator_name: 'Dr. Amina Bello (Lead Moderator)',
    action: 'APPROVED',
    notes: 'Dentists guild cross-verified with Rivers State MMA chapter.',
    created_at: '2026-10-06T15:40:00'
  },
  {
    id: 'audit-demo-3',
    outreach_id: 'demo-outreach-12',
    outreach_title: 'Jos North Peace & Free General Health Outreach',
    moderator_id: 'mod-2',
    moderator_name: 'Pharm. Emeka Okoye',
    action: 'CANCELLED',
    reason: 'Cancelled by organizers due to unforeseen stadium facility maintenance.',
    created_at: '2026-10-07T15:00:00'
  }
];

// Initial reports for demo
const INITIAL_REPORTS: OutreachReport[] = [
  {
    id: 'rep-demo-1',
    outreach_id: 'demo-outreach-2',
    outreach_title: 'Alimosho Free Eye Clinic, Visual Acuity & Reading Glasses Drive',
    report_type: 'INCORRECT_INFORMATION',
    description: 'The school gate opens at 8:00 AM instead of 8:30 AM according to the updated PTA notice board.',
    reporter_name: 'Pastor Johnson',
    reporter_email: 'p.johnson@example.com',
    status: 'PENDING',
    created_at: '2026-10-07T17:30:00'
  }
];

class OutreachStore {
  private outreaches: Outreach[] = [];
  private auditLogs: ModerationAction[] = [];
  private reports: OutreachReport[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedOutreaches = localStorage.getItem(STORAGE_KEY_OUTREACHES);
      if (storedOutreaches) {
        this.outreaches = JSON.parse(storedOutreaches);
      } else {
        this.outreaches = [...SEED_OUTREACHES];
        this.saveOutreaches();
      }

      const storedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (storedAudit) {
        this.auditLogs = JSON.parse(storedAudit);
      } else {
        this.auditLogs = [...INITIAL_AUDIT_LOGS];
        this.saveAudit();
      }

      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else {
        this.reports = [...INITIAL_REPORTS];
        this.saveReports();
      }

      // Check auto-expiration upon init
      this.checkAndExpirePastOutreaches();
    } catch {
      this.outreaches = [...SEED_OUTREACHES];
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
      this.reports = [...INITIAL_REPORTS];
    }
  }

  private saveOutreaches() {
    try {
      localStorage.setItem(STORAGE_KEY_OUTREACHES, JSON.stringify(this.outreaches));
    } catch {
      // ignore storage quota issues
    }
    this.notify();
  }

  private saveAudit() {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLogs));
    } catch {
      // ignore
    }
  }

  private saveReports() {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reports));
    } catch {
      // ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  /**
   * Automatic expiration logic:
   * Rule: If end_datetime < current time (or start_datetime + 12 hours if no end_datetime),
   * transition VERIFIED -> EXPIRED and record audit action.
   */
  public checkAndExpirePastOutreaches(): number {
    const now = new Date();
    let expiredCount = 0;

    this.outreaches = this.outreaches.map(o => {
      if (o.verification_status !== 'VERIFIED') {
        return o;
      }

      const eventEndTime = o.end_datetime 
        ? new Date(o.end_datetime)
        : new Date(new Date(o.start_datetime).getTime() + 12 * 60 * 60 * 1000);

      if (eventEndTime.getTime() < now.getTime()) {
        expiredCount++;
        const updated: Outreach = {
          ...o,
          verification_status: 'EXPIRED',
          updated_at: new Date().toISOString()
        };

        this.auditLogs.unshift({
          id: `audit-exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          outreach_id: o.id,
          outreach_title: o.title,
          moderator_id: 'system',
          moderator_name: 'CareReach Automation Service',
          action: 'MARKED_EXPIRED',
          reason: 'Event end time has elapsed.',
          created_at: new Date().toISOString()
        });

        return updated;
      }
      return o;
    });

    if (expiredCount > 0) {
      this.saveOutreaches();
      this.saveAudit();
    }

    return expiredCount;
  }

  /**
   * Duplicate detection:
   * Compares title, organizer, date, state
   */
  public checkPotentialDuplicates(newOutreach: {
    title: string;
    organizer_name: string;
    state: string;
    start_datetime: string;
  }): { duplicate: boolean; matches: Outreach[] } {
    const newTitleNorm = newOutreach.title.toLowerCase().trim();
    const newOrgNorm = newOutreach.organizer_name.toLowerCase().trim();
    const newDateStr = newOutreach.start_datetime ? newOutreach.start_datetime.substring(0, 10) : '';

    const matches = this.outreaches.filter(existing => {
      if (existing.verification_status === 'REJECTED' || existing.verification_status === 'EXPIRED') {
        return false;
      }

      const existingTitleNorm = existing.title.toLowerCase().trim();
      const existingOrgNorm = existing.organizer_name.toLowerCase().trim();
      const existingDateStr = existing.start_datetime.substring(0, 10);

      // Match 1: Exact state and exact date, plus overlap in title or organizer
      const sameState = existing.state.toLowerCase() === newOutreach.state.toLowerCase();
      const sameDate = newDateStr && existingDateStr === newDateStr;

      if (sameState && sameDate) {
        if (existingOrgNorm === newOrgNorm || existingTitleNorm === newTitleNorm) {
          return true;
        }
        // Word token overlap in title
        const newWords = newTitleNorm.split(/\s+/).filter(w => w.length > 3);
        const matchCount = newWords.filter(w => existingTitleNorm.includes(w)).length;
        if (matchCount >= 2) return true;
      }

      // Match 2: Same organizer and similar title even if date shifted
      if (newOrgNorm.length > 4 && existingOrgNorm.includes(newOrgNorm)) {
        const newWords = newTitleNorm.split(/\s+/).filter(w => w.length > 3);
        const matchCount = newWords.filter(w => existingTitleNorm.includes(w)).length;
        if (matchCount >= 2) return true;
      }

      return false;
    });

    return {
      duplicate: matches.length > 0,
      matches
    };
  }

  public getAll(): Outreach[] {
    return [...this.outreaches];
  }

  public getByIdOrSlug(idOrSlug: string): Outreach | undefined {
    return this.outreaches.find(o => o.id === idOrSlug || o.slug === idOrSlug);
  }

  public getFiltered(filters: OutreachFilters): Outreach[] {
    return this.outreaches.filter(item => {
      // Verification status filter
      if (filters.verificationStatus === 'verified_only') {
        if (item.verification_status !== 'VERIFIED') return false;
      } else if (filters.verificationStatus === 'pending_only') {
        if (item.verification_status !== 'PENDING') return false;
      }

      // Search query (title, organizer, venue, address, LGA, state, services)
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inOrg = item.organizer_name.toLowerCase().includes(q);
        const inVenue = item.venue.toLowerCase().includes(q);
        const inAddress = item.address.toLowerCase().includes(q);
        const inLga = item.lga.toLowerCase().includes(q);
        const inState = item.state.toLowerCase().includes(q);
        const inServices = item.services.some(s => s.toLowerCase().includes(q));
        if (!inTitle && !inOrg && !inVenue && !inAddress && !inLga && !inState && !inServices) {
          return false;
        }
      }

      // State filter
      if (filters.state && filters.state !== 'all') {
        if (item.state.toLowerCase() !== filters.state.toLowerCase()) {
          return false;
        }
      }

      // LGA filter
      if (filters.lga && filters.lga !== 'all') {
        if (item.lga.toLowerCase() !== filters.lga.toLowerCase()) {
          return false;
        }
      }

      // Services multi-select
      if (filters.services && filters.services.length > 0) {
        const hasMatchingService = filters.services.some(targetService =>
          item.services.some(s => s.toLowerCase().includes(targetService.toLowerCase()) || targetService.toLowerCase().includes(s.toLowerCase()))
        );
        if (!hasMatchingService) return false;
      }

      // Date Range Filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const eventDate = new Date(item.start_datetime);
        const now = new Date();
        const todayStr = now.toISOString().substring(0, 10);
        const eventDateStr = item.start_datetime.substring(0, 10);

        if (filters.dateRange === 'today') {
          if (eventDateStr !== todayStr) return false;
        } else if (filters.dateRange === 'tomorrow') {
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().substring(0, 10);
          if (eventDateStr !== tomorrowStr) return false;
        } else if (filters.dateRange === 'this_week') {
          const oneWeek = new Date(now);
          oneWeek.setDate(now.getDate() + 7);
          if (eventDate < now || eventDate > oneWeek) return false;
        } else if (filters.dateRange === 'this_month') {
          const oneMonth = new Date(now);
          oneMonth.setMonth(now.getMonth() + 1);
          if (eventDate < now || eventDate > oneMonth) return false;
        } else if (filters.dateRange === 'custom' && filters.customDate) {
          if (eventDateStr !== filters.customDate) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'recently_added') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (filters.sortBy === 'recently_updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      // default: soonest
      return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
    });
  }

  public getHappeningToday(): Outreach[] {
    const todayStr = new Date().toISOString().substring(0, 10);
    return this.outreaches.filter(o => 
      o.verification_status === 'VERIFIED' && 
      o.start_datetime.substring(0, 10) === todayStr
    );
  }

  public getUpcomingVerified(limit = 6): Outreach[] {
    const now = new Date();
    return this.outreaches
      .filter(o => o.verification_status === 'VERIFIED' && new Date(o.start_datetime) >= now)
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
      .slice(0, limit);
  }

  public getStats() {
    const now = new Date();
    return {
      pending: this.outreaches.filter(o => o.verification_status === 'PENDING').length,
      verified: this.outreaches.filter(o => o.verification_status === 'VERIFIED').length,
      upcoming: this.outreaches.filter(o => o.verification_status === 'VERIFIED' && new Date(o.start_datetime) >= now).length,
      expired: this.outreaches.filter(o => o.verification_status === 'EXPIRED').length,
      rejected: this.outreaches.filter(o => o.verification_status === 'REJECTED').length,
      cancelled: this.outreaches.filter(o => o.verification_status === 'CANCELLED').length,
      reported: this.reports.filter(r => r.status === 'PENDING').length
    };
  }

  /**
   * Submit an outreach (Always enters PENDING!)
   */
  public submitOutreach(data: {
    title: string;
    organizer_name: string;
    description: string;
    services: string[];
    date: string;
    start_time: string;
    end_time?: string;
    state: string;
    lga: string;
    venue: string;
    address: string;
    contact_phone?: string;
    contact_email?: string;
    organizer_url?: string;
    source_url?: string;
    eligibility?: string;
    what_to_bring?: string;
    evidence_url?: string;
    evidence_name?: string;
    contributor_name: string;
    contributor_email: string;
    contributor_phone?: string;
  }): { id: string; slug: string } {
    const id = `cr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Slug generation
    const slugBase = `${data.title}-${data.state}-${data.date}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${slugBase}-${id.substring(0, 5)}`;

    const start_datetime = `${data.date}T${data.start_time || '09:00'}:00`;
    const end_datetime = data.end_time ? `${data.date}T${data.end_time}:00` : undefined;

    const evidenceList = data.evidence_url ? [
      {
        id: `ev-${Date.now()}`,
        outreach_id: id,
        file_url: data.evidence_url,
        file_name: data.evidence_name || 'flyer_evidence.png',
        file_type: 'image/png',
        uploaded_at: new Date().toISOString()
      }
    ] : [];

    const newOutreach: Outreach = {
      id,
      slug,
      title: data.title,
      organizer_name: data.organizer_name,
      description: data.description,
      services: data.services,
      start_datetime,
      end_datetime,
      state: data.state,
      lga: data.lga,
      venue: data.venue,
      address: data.address,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      organizer_url: data.organizer_url,
      source_url: data.source_url,
      eligibility: data.eligibility,
      what_to_bring: data.what_to_bring,
      verification_status: 'PENDING', // NEVER auto verified!
      evidence: evidenceList,
      contributor_name: data.contributor_name,
      contributor_email: data.contributor_email,
      contributor_phone: data.contributor_phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.outreaches.unshift(newOutreach);
    this.saveOutreaches();

    // Log moderation creation event
    this.auditLogs.unshift({
      id: `audit-sub-${Date.now()}`,
      outreach_id: id,
      outreach_title: newOutreach.title,
      moderator_id: 'contributor',
      moderator_name: `${data.contributor_name} (Contributor)`,
      action: 'REQUESTED_CORRECTION',
      notes: 'New community outreach submitted for moderator verification.',
      created_at: new Date().toISOString()
    });
    this.saveAudit();

    return { id, slug };
  }

  /**
   * Moderator: Verify Outreach
   */
  public verifyOutreach(id: string, moderatorName: string, notes?: string): boolean {
    const outreach = this.outreaches.find(o => o.id === id);
    if (!outreach) return false;

    outreach.verification_status = 'VERIFIED';
    outreach.verified_by = moderatorName;
    outreach.verified_at = new Date().toISOString();
    outreach.updated_at = new Date().toISOString();
    if (notes) outreach.moderator_notes = notes;

    this.auditLogs.unshift({
      id: `audit-ver-${Date.now()}`,
      outreach_id: outreach.id,
      outreach_title: outreach.title,
      moderator_id: 'mod',
      moderator_name: moderatorName,
      action: 'APPROVED',
      notes: notes || 'Evidence and organizer details confirmed.',
      created_at: new Date().toISOString()
    });

    this.saveOutreaches();
    this.saveAudit();
    return true;
  }

  /**
   * Moderator: Reject Outreach
   */
  public rejectOutreach(id: string, moderatorName: string, reason: string, notes?: string): boolean {
    const outreach = this.outreaches.find(o => o.id === id);
    if (!outreach) return false;

    outreach.verification_status = 'REJECTED';
    outreach.rejection_reason = reason;
    outreach.moderator_notes = notes;
    outreach.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `audit-rej-${Date.now()}`,
      outreach_id: outreach.id,
      outreach_title: outreach.title,
      moderator_id: 'mod',
      moderator_name: moderatorName,
      action: 'REJECTED',
      reason,
      notes,
      created_at: new Date().toISOString()
    });

    this.saveOutreaches();
    this.saveAudit();
    return true;
  }

  /**
   * Moderator: Request Correction
   */
  public requestCorrection(id: string, moderatorName: string, notes: string): boolean {
    const outreach = this.outreaches.find(o => o.id === id);
    if (!outreach) return false;

    outreach.verification_status = 'PENDING';
    outreach.moderator_notes = notes;
    outreach.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `audit-cor-${Date.now()}`,
      outreach_id: outreach.id,
      outreach_title: outreach.title,
      moderator_id: 'mod',
      moderator_name: moderatorName,
      action: 'REQUESTED_CORRECTION',
      notes,
      created_at: new Date().toISOString()
    });

    this.saveOutreaches();
    this.saveAudit();
    return true;
  }

  /**
   * Moderator: Cancel Outreach
   */
  public cancelOutreach(id: string, moderatorName: string, reason: string): boolean {
    const outreach = this.outreaches.find(o => o.id === id);
    if (!outreach) return false;

    outreach.verification_status = 'CANCELLED';
    outreach.rejection_reason = reason;
    outreach.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `audit-can-${Date.now()}`,
      outreach_id: outreach.id,
      outreach_title: outreach.title,
      moderator_id: 'mod',
      moderator_name: moderatorName,
      action: 'CANCELLED',
      reason,
      created_at: new Date().toISOString()
    });

    this.saveOutreaches();
    this.saveAudit();
    return true;
  }

  /**
   * Moderator: Edit Outreach
   */
  public editOutreach(id: string, moderatorName: string, updates: Partial<Outreach>, editSummary?: string): boolean {
    const outreachIndex = this.outreaches.findIndex(o => o.id === id);
    if (outreachIndex === -1) return false;

    const existing = this.outreaches[outreachIndex];
    this.outreaches[outreachIndex] = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.auditLogs.unshift({
      id: `audit-edit-${Date.now()}`,
      outreach_id: existing.id,
      outreach_title: updates.title || existing.title,
      moderator_id: 'mod',
      moderator_name: moderatorName,
      action: 'EDITED',
      notes: editSummary || 'Outreach details updated by moderator.',
      created_at: new Date().toISOString()
    });

    this.saveOutreaches();
    this.saveAudit();
    return true;
  }

  /**
   * Reports
   */
  public submitReport(data: {
    outreach_id: string;
    outreach_title: string;
    report_type: ReportType;
    description: string;
    reporter_name?: string;
    reporter_email?: string;
  }): OutreachReport {
    const newReport: OutreachReport = {
      id: `rep-${Date.now()}`,
      outreach_id: data.outreach_id,
      outreach_title: data.outreach_title,
      report_type: data.report_type,
      description: data.description,
      reporter_name: data.reporter_name,
      reporter_email: data.reporter_email,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  public resolveReport(reportId: string, moderatorName: string, resolutionNotes: string): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = 'RESOLVED';
    report.resolution_notes = resolutionNotes;
    report.resolved_by = moderatorName;
    report.resolved_at = new Date().toISOString();

    this.saveReports();
    return true;
  }

  public dismissReport(reportId: string, moderatorName: string, notes: string): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return false;

    report.status = 'DISMISSED';
    report.resolution_notes = notes;
    report.resolved_by = moderatorName;
    report.resolved_at = new Date().toISOString();

    this.saveReports();
    return true;
  }

  public getReports(): OutreachReport[] {
    return [...this.reports];
  }

  public getAuditLogs(): ModerationAction[] {
    return [...this.auditLogs];
  }

  public resetToSeedData() {
    this.outreaches = [...SEED_OUTREACHES];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.reports = [...INITIAL_REPORTS];
    this.saveOutreaches();
    this.saveAudit();
    this.saveReports();
  }
}

export const outreachStore = new OutreachStore();
