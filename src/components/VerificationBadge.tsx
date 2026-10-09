import React from 'react';
import { VerificationStatus } from '../types';
import { CheckCircle2, Clock, XCircle, AlertTriangle, CalendarOff } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showExplanation?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  showExplanation = false
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  let badgeContent;

  switch (status) {
    case 'VERIFIED':
      badgeContent = (
        <span
          className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium ${sizeClasses[size]}`}
          title="Verified by CareReach moderators"
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-700 shrink-0`} aria-hidden="true" />
          <span>✓ VERIFIED</span>
        </span>
      );
      break;

    case 'PENDING':
      badgeContent = (
        <span
          className={`inline-flex items-center rounded-md bg-amber-50 text-amber-800 border border-amber-300 font-medium ${sizeClasses[size]}`}
          title="Community submitted — verification pending review"
        >
          <Clock className={`${iconSizes[size]} text-amber-700 shrink-0`} aria-hidden="true" />
          <span>Community submitted — verification pending</span>
        </span>
      );
      break;

    case 'EXPIRED':
      badgeContent = (
        <span
          className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-300 font-medium ${sizeClasses[size]}`}
          title="This outreach event date has passed"
        >
          <CalendarOff className={`${iconSizes[size]} text-slate-500 shrink-0`} aria-hidden="true" />
          <span>EXPIRED</span>
        </span>
      );
      break;

    case 'CANCELLED':
      badgeContent = (
        <span
          className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-300 font-medium ${sizeClasses[size]}`}
          title="This outreach was cancelled by organizers"
        >
          <XCircle className={`${iconSizes[size]} text-rose-700 shrink-0`} aria-hidden="true" />
          <span>✕ CANCELLED</span>
        </span>
      );
      break;

    case 'REJECTED':
      badgeContent = (
        <span
          className={`inline-flex items-center rounded-md bg-slate-100 text-slate-600 border border-slate-300 font-medium ${sizeClasses[size]}`}
          title="Not approved by moderation team"
        >
          <AlertTriangle className={`${iconSizes[size]} text-slate-500 shrink-0`} aria-hidden="true" />
          <span>REJECTED</span>
        </span>
      );
      break;

    default:
      badgeContent = null;
  }

  if (showExplanation && status === 'VERIFIED') {
    return (
      <div className="flex flex-col gap-1">
        <div>{badgeContent}</div>
        <p className="text-xs text-emerald-800">
          Information reviewed and verified by CareReach team against organizer evidence.
        </p>
      </div>
    );
  }

  return badgeContent;
};
