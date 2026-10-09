import React from 'react';
import { ShieldCheck, Heart, AlertCircle, Users, CheckCircle2, Building2, MapPin } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Our Mission & Community Purpose
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About CareReach Nigeria
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Bridging the gap between life-changing free medical outreaches and the Nigerian communities that need them most.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            The Problem We Saw
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every weekend across Nigeria, generous faith organizations, NGOs, alumni bodies, and diaspora doctors conduct free medical screenings, dental clinics, and eye surgeries.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            However, information is trapped in fragmented WhatsApp groups, Facebook fliers, or word of mouth. Those who need free surgeries or hypertension drugs often hear about the event the day after it ended.
          </p>
        </div>

        <div className="bg-emerald-50/60 p-6 sm:p-7 rounded-2xl border border-emerald-200 space-y-3">
          <h2 className="text-lg font-bold text-emerald-950">
            The CareReach Solution
          </h2>
          <p className="text-sm text-emerald-900 leading-relaxed">
            CareReach Nigeria is a centralized, searchable, and verified directory of upcoming free healthcare opportunities across all 36 states and the Federal Capital Territory.
          </p>
          <p className="text-sm text-emerald-900 leading-relaxed">
            Our volunteers verify dates, venues, organizers, and services before publication so families can travel with confidence.
          </p>
        </div>
      </div>

      {/* What We Are vs What We Are NOT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Our Product Scope
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What CareReach IS:
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>A free discovery directory for community health outreaches.</li>
              <li>A crowdsourced platform where anyone can submit an event flyer.</li>
              <li>An independent verification layer verifying event authenticity.</li>
              <li>A fast mobile tool optimized for Nigerian smartphones.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              What CareReach is NOT:
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>NOT a medical advice or diagnosis tool.</li>
              <li>NOT a hospital appointment booking system.</li>
              <li>NOT a telemedicine service or drug vendor.</li>
              <li>NOT a provider or guarantor of medical treatment quality.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* What "Verified" Means (Spec Item 27) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          <span>Understanding the "✓ VERIFIED" Standard</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          What does "Verified" mean on CareReach Nigeria?
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          A verified outreach has been reviewed by the CareReach team using information supplied by the organizer, official community flyers, or credible institutional sources.
        </p>
        <p className="text-xs text-slate-400 bg-slate-800 p-4 rounded-xl border border-slate-700 leading-relaxed">
          <strong>Important distinction:</strong> Verification certifies that the <em>event exists, date and venue match, and organizer was confirmed</em>. Verification does NOT evaluate the clinical qualifications of the volunteering practitioners nor does it guarantee medical outcomes.
        </p>
      </div>

      {/* Legal & Medical Disclaimer (Spec Item 27) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3 text-xs sm:text-sm text-amber-900">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>CareReach Nigeria Medical & Event Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          CareReach Nigeria provides information about healthcare outreaches. We do not provide medical advice and do not guarantee the quality, availability or outcome of services offered at any listed event.
        </p>
        <p className="leading-relaxed">
          Patients with urgent symptoms or emergencies should visit the nearest accredited General Hospital or Primary Healthcare Centre. Always confirm event scheduling and specific requirements directly with organizers before traveling long distances.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('outreaches')}
          className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 shadow-xs text-sm"
        >
          Find Free Outreaches Now →
        </button>
      </div>
    </div>
  );
};
