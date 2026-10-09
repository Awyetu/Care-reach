import React, { useState } from 'react';
import { Outreach, ReportType } from '../types';
import { outreachStore } from '../services/outreachStore';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  outreach: Outreach;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ outreach, onClose }) => {
  const [reportType, setReportType] = useState<ReportType>('INCORRECT_INFORMATION');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    outreachStore.submitReport({
      outreach_id: outreach.id,
      outreach_title: outreach.title,
      report_type: reportType,
      description,
      reporter_name: reporterName || undefined,
      reporter_email: reporterEmail || undefined
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Report Submitted
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Thank you for helping keep CareReach Nigeria accurate. Our moderation team has received your report and will investigate immediately.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Report Outreach Information
                </h2>
                <p className="text-xs text-slate-500 truncate max-w-xs">
                  {outreach.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason for Report
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="INCORRECT_INFORMATION">Incorrect Date, Venue, or Time</option>
                <option value="EVENT_CANCELLED">Event has been cancelled by organizer</option>
                <option value="DUPLICATE">Duplicate event already listed</option>
                <option value="SUSPICIOUS">Suspicious or fraudulent listing</option>
                <option value="OTHER">Other issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Please describe the issue <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain what is inaccurate or cancelled. Include links or organizer contacts if known..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
