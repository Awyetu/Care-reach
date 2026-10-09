import React, { useState } from 'react';
import { Outreach } from '../types';
import { VerificationBadge } from '../components/VerificationBadge';
import { formatOutreachDate, formatOutreachTime, isEventToday } from '../utils/dateFormatter';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  Navigation, 
  Share2, 
  Check, 
  AlertTriangle, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface OutreachDetailPageProps {
  outreach: Outreach;
  onBack: () => void;
  onOpenReport: (outreach: Outreach) => void;
  navigate: (route: string) => void;
}

export const OutreachDetailPage: React.FC<OutreachDetailPageProps> = ({
  outreach,
  onBack,
  onOpenReport,
  navigate
}) => {
  const [copied, setCopied] = useState(false);

  const isToday = isEventToday(outreach.start_datetime);
  const shareUrl = `${window.location.origin}/#outreach-${outreach.slug}`;
  const shareText = `*FREE HEALTHCARE OUTREACH NIGERIA*\n\n*${outreach.title}*\n\n📍 *Venue:* ${outreach.venue}\n📌 *Location:* ${outreach.lga}, ${outreach.state}\n📅 *Date:* ${formatOutreachDate(outreach.start_datetime)}\n⏰ *Time:* ${formatOutreachTime(outreach.start_datetime, outreach.end_datetime)}\n\n🩺 *Services:* ${outreach.services.join(', ')}\n\nℹ️ *Full verified details & directions:* ${shareUrl}\n\nShared via CareReach Nigeria — Find free healthcare near you.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: outreach.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  // Google Maps directions url
  const mapsQuery = `${outreach.venue}, ${outreach.address}, ${outreach.lga}, ${outreach.state}, Nigeria`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back navigation & Quick Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all outreaches
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReport(outreach)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Report issue
          </button>
        </div>
      </div>

      {/* Main Outreach Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Verification Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge status={outreach.verification_status} size="lg" />
            {isToday && (
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 text-white animate-pulse">
                Happening Today
              </span>
            )}
            {outreach.isDemo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Demo Record
              </span>
            )}
          </div>

          <span className="text-xs text-slate-500">
            Updated {new Date(outreach.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Status notice if expired or cancelled */}
        {outreach.verification_status === 'EXPIRED' && (
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">This outreach date has elapsed (Expired).</p>
              <p className="text-slate-600">This event has already taken place. We keep this record archived for community history and health research.</p>
            </div>
          </div>
        )}

        {outreach.verification_status === 'CANCELLED' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">Event Notice: This outreach has been cancelled.</p>
              <p className="text-rose-700">{outreach.rejection_reason || 'Organizers cancelled this event.'}</p>
            </div>
          </div>
        )}

        {outreach.verification_status === 'PENDING' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Community Submitted — Verification Pending</p>
              <p className="text-amber-800">
                This outreach was submitted by a community member and is currently in our moderation queue. Details have not yet been independently verified by the CareReach review team.
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
          {outreach.title}
        </h1>

        {/* Organizer */}
        <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs text-slate-500 block">Organized by:</span>
            <span className="font-bold text-slate-900">{outreach.organizer_name}</span>
          </div>
        </div>

        {/* Quick Date, Time & Venue Highlight Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 rounded-xl p-4 sm:p-5 border border-emerald-100">
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Date</span>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {formatOutreachDate(outreach.start_datetime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Time</span>
                <p className="text-sm font-semibold text-slate-800">
                  {formatOutreachTime(outreach.start_datetime, outreach.end_datetime)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Location</span>
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  {outreach.venue}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {outreach.address}
                </p>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  {outreach.lga} LGA, {outreach.state} State
                </p>
              </div>
            </div>

            {/* Directions Button */}
            <div className="pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition-all shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get directions on Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Healthcare Services Offered at this Outreach
          </h2>
          <div className="flex flex-wrap gap-2">
            {outreach.services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                ✓ {service}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            About This Outreach
          </h2>
          <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-white">
            {outreach.description}
          </div>
        </div>

        {/* Eligibility & What to Bring */}
        {(outreach.eligibility || outreach.what_to_bring) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {outreach.eligibility && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Eligibility
                </span>
                <p className="text-xs sm:text-sm text-slate-700">
                  {outreach.eligibility}
                </p>
              </div>
            )}

            {outreach.what_to_bring && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  What to Bring
                </span>
                <p className="text-xs sm:text-sm text-slate-700">
                  {outreach.what_to_bring}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Organizer Contacts */}
        {(outreach.contact_phone || outreach.contact_email || outreach.organizer_url || outreach.source_url) && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Organizer Contacts & Verification Source
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              {outreach.contact_phone && (
                <a
                  href={`tel:${outreach.contact_phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800"
                >
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{outreach.contact_phone}</span>
                </a>
              )}

              {outreach.contact_email && (
                <a
                  href={`mailto:${outreach.contact_email}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 truncate"
                >
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{outreach.contact_email}</span>
                </a>
              )}

              {outreach.organizer_url && (
                <a
                  href={outreach.organizer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-emerald-800 truncate"
                >
                  <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">Organizer Official Page</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              )}

              {outreach.source_url && (
                <a
                  href={outreach.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 truncate"
                >
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">Public Announcement Source</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Verification Certificate Box */}
        <div className="bg-emerald-950 text-emerald-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-white block">
                {outreach.verification_status === 'VERIFIED'
                  ? 'Information Verified by CareReach Nigeria'
                  : 'Outreach Verification In Review'}
              </span>
              <span className="text-emerald-300/90 text-xs">
                {outreach.verification_status === 'VERIFIED'
                  ? `Reviewed against organizer confirmation ${outreach.verified_at ? `on ${new Date(outreach.verified_at).toLocaleDateString()}` : ''}.`
                  : 'Submitted by community contributor; awaiting review team clearance.'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('how-it-works')}
            className="text-xs text-emerald-300 hover:text-white underline underline-offset-4 whitespace-nowrap self-end sm:self-auto"
          >
            What does verified mean?
          </button>
        </div>

        {/* SHARE BAR (Spec Item 12) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Share this outreach with family & friends
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-xs transition-transform active:scale-98"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Native Share button */}
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs"
            >
              More sharing options
            </button>
          </div>
        </div>
      </div>

      {/* Report Button Card */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice any error, cancelled schedule, or inaccurate information?</span>
        </div>
        <button
          onClick={() => onOpenReport(outreach)}
          className="text-xs font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 ml-2"
        >
          Report incorrect information
        </button>
      </div>
    </div>
  );
};
