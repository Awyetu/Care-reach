import React, { useState, useEffect } from 'react';
import { Outreach, ModerationAction, OutreachReport, VerificationStatus } from '../types';
import { outreachStore } from '../services/outreachStore';
import { VerificationBadge } from '../components/VerificationBadge';
import { formatOutreachDate, formatOutreachTime } from '../utils/dateFormatter';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { HEALTHCARE_SERVICES } from '../data/healthcareServices';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Search, 
  CalendarOff, 
  ExternalLink, 
  History, 
  RefreshCw, 
  Eye, 
  MapPin, 
  FileText,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (route: string) => void;
  onSelectOutreach: (outreach: Outreach) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, onSelectOutreach }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'all' | 'reports' | 'audit'>('submissions');
  const [outreaches, setOutreaches] = useState<Outreach[]>([]);
  const [auditLogs, setAuditLogs] = useState<ModerationAction[]>([]);
  const [reports, setReports] = useState<OutreachReport[]>([]);
  const [stats, setStats] = useState(outreachStore.getStats());

  // Currently inspecting outreach for review
  const [inspectingOutreach, setInspectingOutreach] = useState<Outreach | null>(null);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Could not verify organizer');
  const [rejectNotes, setRejectNotes] = useState('');

  // Request Correction Modal state
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');

  // Edit Outreach Modal state
  const [editingOutreach, setEditingOutreach] = useState<Outreach | null>(null);

  // Filter in all outreaches tab
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');

  const moderatorName = 'Dr. Amina Bello (Lead Moderator)';

  const refreshData = () => {
    setOutreaches(outreachStore.getAll());
    setAuditLogs(outreachStore.getAuditLogs());
    setReports(outreachStore.getReports());
    setStats(outreachStore.getStats());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = outreachStore.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const pendingSubmissions = outreaches.filter((o) => o.verification_status === 'PENDING');

  // Verify Action
  const handleVerify = (outreach: Outreach) => {
    if (confirm(`Approve and verify "${outreach.title}"? This will publish it to the public directory.`)) {
      outreachStore.verifyOutreach(outreach.id, moderatorName, 'Flyer and organizer authenticity confirmed.');
      setInspectingOutreach(null);
      alert('Outreach verified and published successfully!');
    }
  };

  // Reject Action
  const handleConfirmReject = () => {
    if (!inspectingOutreach) return;
    outreachStore.rejectOutreach(inspectingOutreach.id, moderatorName, rejectReason, rejectNotes);
    setRejectModalOpen(false);
    setInspectingOutreach(null);
    setRejectNotes('');
    alert('Submission marked as REJECTED.');
  };

  // Request Correction Action
  const handleConfirmCorrection = () => {
    if (!inspectingOutreach) return;
    outreachStore.requestCorrection(inspectingOutreach.id, moderatorName, correctionNotes);
    setCorrectionModalOpen(false);
    setInspectingOutreach(null);
    setCorrectionNotes('');
    alert('Correction requested and saved in notes.');
  };

  // Cancel Verified Outreach
  const handleCancelEvent = (outreach: Outreach) => {
    const reason = prompt(`Reason for cancelling "${outreach.title}":`, 'Organizers cancelled due to scheduling conflict.');
    if (reason) {
      outreachStore.cancelOutreach(outreach.id, moderatorName, reason);
      alert('Event status updated to CANCELLED.');
    }
  };

  // Resolve Report
  const handleResolveReport = (report: OutreachReport) => {
    const notes = prompt(`Resolution notes for report #${report.id}:`, 'Verified schedule with organizer. Updated listing.');
    if (notes) {
      outreachStore.resolveReport(report.id, moderatorName, notes);
      alert('Report marked as RESOLVED.');
    }
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutreach) return;

    outreachStore.editOutreach(
      editingOutreach.id,
      moderatorName,
      editingOutreach,
      'Updated by moderator via Admin Outreach Editor.'
    );

    setEditingOutreach(null);
    alert('Outreach details updated.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-900 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Moderation & Verification Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as: <strong>{moderatorName}</strong> • Real-time audit trail enabled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const expiredCount = outreachStore.checkAndExpirePastOutreaches();
              alert(`Expiration check complete. ${expiredCount} past events transitioned to EXPIRED.`);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            title="Run auto-expiration check"
          >
            <CalendarOff className="w-3.5 h-3.5 text-slate-500" />
            Run Auto-Expiration
          </button>

          <button
            onClick={() => {
              if (confirm('Reset to initial sample demo data? All test records will be refreshed.')) {
                outreachStore.resetToSeedData();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS (Spec Item 14 & 29) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div 
          onClick={() => setActiveTab('submissions')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'submissions'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900">{stats.pending}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting review</p>
        </div>

        <div 
          onClick={() => setActiveTab('all')}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-900">{stats.verified}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Published & active</p>
        </div>

        <div 
          onClick={() => setActiveTab('all')}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900">{stats.upcoming}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Scheduled ahead</p>
        </div>

        <div 
          onClick={() => setActiveTab('all')}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
            <CalendarOff className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{stats.expired}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Past dates</p>
        </div>

        <div 
          onClick={() => setActiveTab('reports')}
          className={`p-4 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
            activeTab === 'reports'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Reported</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-rose-900">{stats.reported}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Flagged issues</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Pending Submissions</span>
          {stats.pending > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] rounded-full">
              {stats.pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          All Outreaches ({outreaches.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>User Reports</span>
          {stats.reported > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full">
              {stats.reported}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING SUBMISSIONS (Spec Item 14 & 15) */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {pendingSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                Queue is clear! No pending submissions.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All community outreach submissions have been reviewed and audited by the moderation team.
              </p>
              <button
                onClick={() => navigate('submit')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                + Test submitting a new outreach
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                <strong>{pendingSubmissions.length}</strong> community submission
                {pendingSubmissions.length === 1 ? '' : 's'} waiting for moderator inspection.
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <VerificationBadge status={sub.verification_status} size="sm" />
                        <span className="text-xs text-slate-500">
                          Submitted on {new Date(sub.created_at).toLocaleDateString()} by <strong>{sub.contributor_name}</strong> ({sub.contributor_email})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {sub.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {sub.organizer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {sub.venue}, {sub.lga}, {sub.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatOutreachDate(sub.start_datetime)} ({formatOutreachTime(sub.start_datetime, sub.end_datetime)})
                        </span>
                      </div>

                      {sub.moderator_notes && (
                        <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <strong>Moderator Note:</strong> {sub.moderator_notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setInspectingOutreach(sub)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Verify</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIDE-BY-SIDE MODERATION INSPECTOR MODAL (Spec Item 15) */}
      {inspectingOutreach && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Moderator Evidence Inspection
                </span>
                <h2 className="text-lg font-bold text-white truncate max-w-xl">
                  {inspectingOutreach.title}
                </h2>
              </div>
              <button
                onClick={() => setInspectingOutreach(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800"
              >
                Close ✕
              </button>
            </div>

            {/* Modal Body: Side-by-side Flyer & Submitted Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {/* Left Column: FLYER / EVIDENCE */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    Flyer / Evidence Document
                  </span>
                  {inspectingOutreach.evidence?.[0] && (
                    <a
                      href={inspectingOutreach.evidence[0].file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Open full size <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {inspectingOutreach.evidence?.[0]?.file_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[440px]">
                    <img
                      src={inspectingOutreach.evidence[0].file_url}
                      alt="Submitted Outreach Flyer"
                      className="w-full h-full object-contain max-h-[440px]"
                    />
                  </div>
                ) : (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-8 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                    <p className="text-xs font-bold text-amber-900">
                      No flyer image uploaded with this submission.
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Verify through organizer public URL or phone contact below before approving.
                    </p>
                  </div>
                )}

                {/* Source Link */}
                {inspectingOutreach.source_url && (
                  <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">Contributor Source URL:</span>
                    <a
                      href={inspectingOutreach.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline break-all flex items-center gap-1"
                    >
                      {inspectingOutreach.source_url}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: SUBMITTED DETAILS */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Submitted Details Form
                  </span>
                  <VerificationBadge status={inspectingOutreach.verification_status} size="sm" />
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Title:</span>
                    <span className="text-sm font-bold text-slate-900">{inspectingOutreach.title}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Organizer:</span>
                    <span className="font-semibold text-slate-800">{inspectingOutreach.organizer_name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold text-slate-500 block uppercase text-[10px]">Date:</span>
                      <span className="font-semibold text-slate-800">{formatOutreachDate(inspectingOutreach.start_datetime)}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block uppercase text-[10px]">Time:</span>
                      <span className="font-semibold text-slate-800">{formatOutreachTime(inspectingOutreach.start_datetime, inspectingOutreach.end_datetime)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Venue & Address:</span>
                    <span className="font-medium text-slate-800">{inspectingOutreach.venue}, {inspectingOutreach.address}</span>
                    <span className="block text-emerald-800 font-semibold">{inspectingOutreach.lga} LGA, {inspectingOutreach.state} State</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Services:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inspectingOutreach.services.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Description:</span>
                    <p className="text-slate-700 leading-relaxed max-h-28 overflow-y-auto bg-slate-50 p-2 rounded border border-slate-100">
                      {inspectingOutreach.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Contributor:</span>
                    <p className="text-slate-700">
                      {inspectingOutreach.contributor_name} • {inspectingOutreach.contributor_email} {inspectingOutreach.contributor_phone ? `• ${inspectingOutreach.contributor_phone}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Action will be permanently recorded in the audit trail.
              </div>

              <div className="flex items-center gap-2">
                {/* Reject */}
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200"
                >
                  ✕ Reject Submission
                </button>

                {/* Request Correction */}
                <button
                  onClick={() => setCorrectionModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200"
                >
                  Request Correction
                </button>

                {/* Verify */}
                <button
                  onClick={() => handleVerify(inspectingOutreach)}
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
                >
                  ✓ Verify & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL (Spec Item 14: Require rejection reason) */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Reject Outreach Submission
            </h3>
            <p className="text-xs text-slate-500">
              Select the official reason for rejecting this community submission.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Could not verify organizer">Could not verify organizer</option>
                <option value="Event already happened">Event already happened</option>
                <option value="Duplicate listing">Duplicate</option>
                <option value="Insufficient information">Insufficient information</option>
                <option value="Suspicious / fraudulent listing">Suspicious / fraudulent</option>
                <option value="Incorrect date or location">Incorrect date / location</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Internal Moderator Notes (Optional)
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={3}
                placeholder="Details of verification failure (e.g., organizer phone unreachable)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CORRECTION MODAL */}
      {correctionModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Request Submission Correction
            </h3>
            <p className="text-xs text-slate-500">
              The outreach will remain PENDING with notes saved for contributor or moderator follow-up.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Notes / Required Corrections
              </label>
              <textarea
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                rows={4}
                placeholder="e.g. Please clarify exact venue hall inside the council complex..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCorrection}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL OUTREACHES TABLE (Spec Item 29 & 30: Edit, Cancel, Search) */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search by title, state, organizer..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500">Status:</span>
              <select
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-[10px] text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Title & Organizer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outreaches
                  .filter((o) => {
                    if (adminStatusFilter !== 'all' && o.verification_status !== adminStatusFilter) {
                      return false;
                    }
                    if (adminSearch.trim() !== '') {
                      const q = adminSearch.toLowerCase();
                      return (
                        o.title.toLowerCase().includes(q) ||
                        o.organizer_name.toLowerCase().includes(q) ||
                        o.state.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{o.title}</span>
                        <span className="text-[11px] text-slate-500 truncate block">{o.organizer_name}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{o.lga}, {o.state}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span>{formatOutreachDate(o.start_datetime)}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <VerificationBadge status={o.verification_status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onSelectOutreach(o)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                          title="View public page"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingOutreach(o)}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px]"
                          title="Edit outreach details"
                        >
                          Edit
                        </button>
                        {o.verification_status === 'VERIFIED' && (
                          <button
                            onClick={() => handleCancelEvent(o)}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-[11px]"
                            title="Cancel event"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT OUTREACH MODAL (Spec Item 30: Admin Editor) */}
      {editingOutreach && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                Edit Outreach Details
              </h3>
              <button
                onClick={() => setEditingOutreach(null)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingOutreach.title}
                  onChange={(e) => setEditingOutreach({ ...editingOutreach, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organizer</label>
                <input
                  type="text"
                  value={editingOutreach.organizer_name}
                  onChange={(e) => setEditingOutreach({ ...editingOutreach, organizer_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={editingOutreach.venue}
                    onChange={(e) => setEditingOutreach({ ...editingOutreach, venue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingOutreach.address}
                    onChange={(e) => setEditingOutreach({ ...editingOutreach, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editingOutreach.description}
                  onChange={(e) => setEditingOutreach({ ...editingOutreach, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligibility</label>
                  <input
                    type="text"
                    value={editingOutreach.eligibility || ''}
                    onChange={(e) => setEditingOutreach({ ...editingOutreach, eligibility: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">What to Bring</label>
                  <input
                    type="text"
                    value={editingOutreach.what_to_bring || ''}
                    onChange={(e) => setEditingOutreach({ ...editingOutreach, what_to_bring: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOutreach(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Save Changes & Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: USER REPORTS (Spec Item 16 & 29) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
              No reports currently filed.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        {rep.report_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rep.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rep.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      Target Outreach: {rep.outreach_title}
                    </h4>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{rep.description}"
                    </p>

                    <div className="text-[11px] text-slate-500">
                      Reporter: {rep.reporter_name || 'Anonymous'} {rep.reporter_email ? `(${rep.reporter_email})` : ''}
                      {rep.resolution_notes && (
                        <div className="text-emerald-800 font-medium mt-1">
                          Resolution: {rep.resolution_notes} (by {rep.resolved_by})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'PENDING' && (
                      <button
                        onClick={() => handleResolveReport(rep)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
                      >
                        Resolve Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL (Spec Item 16) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            Immutable log of all moderation and administrative decisions.
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-[10px] text-slate-500">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Moderator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Outreach</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('en-GB')}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {log.moderator_name}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        log.action === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                        log.action === 'MARKED_EXPIRED' ? 'bg-slate-100 text-slate-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 max-w-xs truncate font-medium text-slate-800">
                      {log.outreach_title}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 text-xs">
                      {log.reason ? <span className="font-semibold text-rose-800">[{log.reason}] </span> : null}
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
