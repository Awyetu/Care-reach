import React from 'react';
import { ShieldCheck, Heart, AlertCircle, ArrowUpRight } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/nigeriaLocations';

interface FooterProps {
  navigate: (route: string) => void;
  onFilterState?: (state: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, onFilterState }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                CR
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                CareReach <span className="text-emerald-400">Nigeria</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nigeria’s community-driven platform for discovering and sharing verified free medical outreaches and healthcare services before they happen.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Moderated by certified healthcare advocates</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('outreaches')}
                  className="hover:text-white transition-colors text-left"
                >
                  Find Healthcare Outreaches
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('submit')}
                  className="hover:text-white transition-colors text-left text-emerald-400 font-medium"
                >
                  Submit a Free Outreach
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('how-it-works')}
                  className="hover:text-white transition-colors text-left"
                >
                  How Verification Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('admin')}
                  className="hover:text-white transition-colors text-left text-slate-400"
                >
                  Moderator & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Browse by State */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Popular States
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LOCATIONS.map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    if (onFilterState) {
                      onFilterState(state);
                    } else {
                      navigate('outreaches');
                    }
                  }}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-800 transition-colors"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Trust & Verification Standard */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2">
              Verification Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every public listing labelled <strong>✓ VERIFIED</strong> is audited by our moderation team against official flyers, organizer registrations, or credible community evidence.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>100% free community public service for all Nigerians. No commercial ads or medical referrals.</span>
            </div>
          </div>
        </div>

        {/* Medical & Legal Disclaimer - CRITICAL SPEC REQUIREMENT */}
        <div className="py-6 border-b border-slate-800/80 my-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-200 uppercase tracking-wide text-[11px]">
                Medical & Event Information Disclaimer
              </p>
              <p>
                <strong>CareReach Nigeria provides information about healthcare outreaches.</strong> We do not provide medical advice, diagnoses, treatment recommendations, or hospital booking services, and we do not guarantee the quality, availability, or outcome of services offered at any listed event.
              </p>
              <p>
                Our team verifies the <em>authenticity of the event announcement</em>, not the medical standard of individual practitioners. Always confirm important details with the organizer prior to travelling.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareReach Nigeria. Built for community health access across 36 states & FCT.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('about')} className="hover:text-slate-300">
              Trust & Safety
            </button>
            <span>•</span>
            <button onClick={() => navigate('how-it-works')} className="hover:text-slate-300">
              Community Guidelines
            </button>
            <span>•</span>
            <button onClick={() => navigate('submit')} className="hover:text-emerald-400 flex items-center gap-1">
              Share Outreach <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
