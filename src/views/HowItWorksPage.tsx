import React from 'react';
import { Search, ShieldCheck, CheckCircle2, Upload, AlertCircle, ArrowRight, Clock, HelpCircle } from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          User Guide & Verification Protocol
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How CareReach Nigeria Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          From community submission to independent moderation and public discovery.
        </p>
      </div>

      {/* 3 Step Core Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xl shadow-xs">
            1
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            1. Discover
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Search by your state, LGA, or specific medical interventions such as eye testing, dental surgery, maternal checks, or malaria treatment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xl shadow-xs">
            2
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            2. Verify
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every submission is checked by trained moderators against original flyers, social evidence, and organizer contacts before receiving the <strong>✓ VERIFIED</strong> status.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-xl shadow-xs">
            3
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            3. Attend
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Get Google Maps directions to the venue, check what to bring, share with neighbours on WhatsApp, and arrive early for tokens.
          </p>
        </div>
      </div>

      {/* Contributor Workflow */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
          <Upload className="w-4 h-4" />
          <span>For Community Contributors</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Share a Free Outreach
        </h2>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              a
            </span>
            <p>
              <strong>Fill the submission form:</strong> Provide the title, organizer name, date, time, and exact venue and LGA.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              b
            </span>
            <p>
              <strong>Attach evidence:</strong> Upload a photo of the flyer, banner, or letter of invitation, along with source URLs where you found the announcement.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
              c
            </span>
            <p>
              <strong>Moderation Queue:</strong> Your submission enters <code>PENDING</code>. It will never appear as verified until our volunteers confirm it.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('submit')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800"
          >
            Submit an Outreach Now →
          </button>
        </div>
      </div>

      {/* Verification States Explained */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Understanding Verification Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 block">✓ VERIFIED</span>
            <p className="text-emerald-900">
              The organizer, flyer, venue, and date were independently checked and approved by CareReach.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-800 block">⏳ Community submitted — verification pending</span>
            <p className="text-amber-900">
              Submitted by a community member; awaiting review by the CareReach moderation team.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">⏰ EXPIRED</span>
            <p className="text-slate-600">
              The outreach event date has already passed. Kept for historical reference.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="font-bold text-rose-800 block">✕ CANCELLED</span>
            <p className="text-rose-900">
              Organizers announced a cancellation or venue unavailability.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">
              Are these healthcare services genuinely 100% free?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Yes. CareReach Nigeria only lists outreaches where consultations, screening, or medications are explicitly provided at zero cost by organizers, NGOs, faith missions, or government drives.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">
              Do I need to register or pay on this website?
            </span>
            <p className="text-slate-600 leading-relaxed">
              No. CareReach Nigeria never asks for payment, card details, or sensitive health data. You attend the event in person as indicated by the organizer.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">
              What should I do if an outreach changes venue or cancels?
            </span>
            <p className="text-slate-600 leading-relaxed">
              Click the "Report incorrect information" button on the outreach page. Our team will verify and update the status to CANCELLED to protect others from traveling unnecessarily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
