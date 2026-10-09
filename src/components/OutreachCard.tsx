import React, { useState } from 'react';
import { Outreach } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { formatOutreachDate, formatOutreachTime, isEventToday, isEventTomorrow } from '../utils/dateFormatter';
import { MapPin, Calendar, Clock, Share2, Check, ArrowRight, Building2 } from 'lucide-react';

interface OutreachCardProps {
  outreach: Outreach;
  onSelect: (outreach: Outreach) => void;
  showContributorInfo?: boolean;
}

export const OutreachCard: React.FC<OutreachCardProps> = ({
  outreach,
  onSelect,
  showContributorInfo = false
}) => {
  const [copied, setCopied] = useState(false);
  const isToday = isEventToday(outreach.start_datetime);
  const isTomorrow = isEventTomorrow(outreach.start_datetime);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#outreach-${outreach.slug}`;
    const shareText = `FREE HEALTHCARE OUTREACH: ${outreach.title}\n📍 ${outreach.venue}, ${outreach.lga}, ${outreach.state}\n📅 ${formatOutreachDate(outreach.start_datetime)}\n⏰ ${formatOutreachTime(outreach.start_datetime, outreach.end_datetime)}\n\nDetails: ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: outreach.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // user cancelled or failed, fallback to copy
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const visibleServices = outreach.services.slice(0, 3);
  const extraServicesCount = outreach.services.length - visibleServices.length;

  return (
    <div
      onClick={() => onSelect(outreach)}
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 p-5 cursor-pointer focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(outreach);
        }
      }}
      aria-label={`View details for ${outreach.title}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <VerificationBadge status={outreach.verification_status} size="sm" />
            {isToday && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white animate-pulse">
                Happening Today
              </span>
            )}
            {isTomorrow && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                Tomorrow
              </span>
            )}
            {outreach.isDemo && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                Demo
              </span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Share outreach details"
            aria-label="Share outreach"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mb-2 leading-snug">
          {outreach.title}
        </h3>

        {/* Organizer */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium">{outreach.organizer_name}</span>
        </div>

        {/* Key Info: Location & Date */}
        <div className="space-y-1.5 text-xs text-slate-700 mb-4 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="font-medium text-slate-800">
              {outreach.lga}, {outreach.state}
              <span className="block text-[11px] text-slate-500 font-normal truncate">
                {outreach.venue}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium text-slate-800">
              {formatOutreachDate(outreach.start_datetime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {formatOutreachTime(outreach.start_datetime, outreach.end_datetime)}
            </span>
          </div>
        </div>

        {/* Services Offered Tags */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Services Available:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visibleServices.map((svc) => (
              <span
                key={svc}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100"
              >
                {svc}
              </span>
            ))}
            {extraServicesCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                +{extraServicesCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {showContributorInfo ? (
          <span className="text-slate-500 text-[11px]">
            By {outreach.contributor_name}
          </span>
        ) : (
          <span className="text-emerald-700 font-semibold group-hover:underline flex items-center gap-1">
            View full details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}

        {outreach.eligibility && (
          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[140px]">
            {outreach.eligibility}
          </span>
        )}
      </div>
    </div>
  );
};
